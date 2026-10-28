'use strict';

// Manual, no-API production smoke test. Produces a genuine short MP4 with local FFmpeg
// and fails unless FFprobe confirms a readable video stream and positive duration.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { getFFmpegPath, getFFprobePath } = require('../utils/ffmpeg');

const output = path.resolve(process.argv[2] || 'artifacts/mr-ahlawat-smoke-test.mp4');
fs.mkdirSync(path.dirname(output), { recursive: true });

function run(binary, args) {
  const result = spawnSync(binary, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${path.basename(binary)} failed: ${(result.stderr || result.stdout || '').slice(-2500)}`);
  return result.stdout || '';
}

const ffmpeg = getFFmpegPath();
run(ffmpeg, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'lavfi', '-i', 'testsrc2=size=1280x720:rate=24:duration=8',
  '-f', 'lavfi', '-i', 'sine=frequency=440:sample_rate=44100:duration=8',
  '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart',
  output
]);

const stat = fs.statSync(output);
if (stat.size < 10000) throw new Error(`MP4 is suspiciously small (${stat.size} bytes)`);
const probe = JSON.parse(run(getFFprobePath(), [
  '-v', 'error', '-show_entries', 'format=duration,format_name:stream=codec_type,codec_name,width,height',
  '-of', 'json', output
]));
const duration = Number(probe.format && probe.format.duration);
const video = (probe.streams || []).find(stream => stream.codec_type === 'video');
const audio = (probe.streams || []).find(stream => stream.codec_type === 'audio');
if (!video || !audio || !Number.isFinite(duration) || duration < 7.5) {
  throw new Error(`MP4 validation failed: ${JSON.stringify({ duration, streams: probe.streams })}`);
}
console.log(JSON.stringify({ status: 'PASS', output, bytes: stat.size, durationSeconds: duration, video, audio }, null, 2));
