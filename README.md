# DPE YouTube Intro Maker

AI-assisted motion graphics pipeline for Peter Holmquist's Driven Publishers YouTube channel. Turns a raw talking-head clip into a branded animated intro (overlay PNG sequence) that the editor composites in Premiere.

## Quick Start

**Freelancer (non-coder path):**
1. Install Claude Code: https://claude.com/claude-code
2. Open a fresh chat, paste this prompt:

   ```
   Set up the DPE YouTube intro toolkit. Read and follow the instructions at:
   https://raw.githubusercontent.com/gebhardtim1-lang/dpe-youtube-intro/main/BOOTSTRAP.md

   Walk me through each step in plain English. Ask me what I need to answer
   (install location, API key), and handle the rest yourself.
   ```

3. Claude handles the rest. Full guide: [`INSTRUCTIONS.html`](https://gebhardtim1-lang.github.io/dpe-youtube-intro/INSTRUCTIONS.html)

**Tim / maintainer:** brand tokens in [`brand/brand.md`](./brand/brand.md). Skills in [`.claude/skills/`](./.claude/skills/). Template in [`template/`](./template/). Install orchestration in [`BOOTSTRAP.md`](./BOOTSTRAP.md).

## What it produces

For every raw Peter clip you feed it, this pipeline produces:

- **`dpe-intro.mov`** — ProRes 4444 with alpha channel (single-file overlay)
- **`dpe-intro-png-sequence/`** — 525 PNG frames with alpha channel (production format)
- **`dpe-intro-preview.mp4`** — composited preview with Peter baked in (for approval only)

The editor drops either the MOV or the PNG sequence into Premiere on V2, puts Peter's raw clip on V1 underneath, and the intro composites cleanly.

## Stack

- **Claude Code** — the AI agent running locally that orchestrates everything
- **Hyperframes** — HTML-to-video rendering framework (free, open-source, by HeyGen)
- **OpenAI Whisper API** — word-level transcription (~$0.006 per intro)
- **FFmpeg** — video/audio processing
- **Node.js ≥ 22** — runtime

## Brand

DPE palette (hex codes, fonts, motion presets) is defined in [`brand/brand.md`](./brand/brand.md). Every intro uses these exact tokens — no deviation.
