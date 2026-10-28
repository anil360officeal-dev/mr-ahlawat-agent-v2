# Mr Ahlawat Agent (Free-first)

A safety-first workspace for building Hindi/Hinglish YouTube videos for **Mr Ahlawat**.

## Current status

This repository is being prepared as a clean customization of the upstream YouTube Automation Agent. It is not yet a working video generator. The upstream project is available at https://github.com/darkzOGx/youtube-automation-agent.

## Requirements and guardrails

- Target output: Hindi/Hinglish news and explainer videos with readable Devanagari captions, verified facts, clean headlines, and real/licensed visuals.
- Prefer free/local providers first; clearly label any provider that requires a paid API or credits.
- Do not commit API keys, OAuth tokens, `.env`, Google credentials, channel cookies, or personal voice/photo files.
- No upload, scheduling, publishing, or automated workflow run without explicit user approval.
- Any finished video must wait for human review before publishing.
- Do not claim a generated video contains real footage or a real reporter unless verified.

## Planned implementation

1. Audit the upstream source and dependencies before copying or running it.
2. Add Mr Ahlawat defaults for Hindi/Hinglish scripts, brand text, vertical Shorts and 16:9 explainers.
3. Add a preflight mode that checks configuration without making paid API calls or contacting YouTube.
4. Validate Devanagari fonts and caption rendering; fail clearly rather than output square glyphs.
5. Prefer verified licensed moving visuals; use a clearly labelled slideshow fallback when video footage is unavailable.
6. Keep publishing and scheduler functions disabled by default.

## Safe setup

Do not run the scheduler or publishing scripts until the configuration has been audited. Start with static checks and local test assets only.

## Secrets

Use a local `.env` file that is excluded from Git. Never paste API keys or OAuth JSON into issues, commits, or chat.
