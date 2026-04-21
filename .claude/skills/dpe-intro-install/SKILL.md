---
name: dpe-intro-install
description: One-time setup for the DPE YouTube intro pipeline. Verifies Node.js and FFmpeg, installs Hyperframes, copies the DPE template, installs npm dependencies, runs a smoke test. Trigger phrases - "/dpe-intro-install", "install DPE intro", "set up DPE intro maker", "setup the intro pipeline".
---

# DPE Intro — Install Skill

Run this skill ONCE when the freelancer first clones the repo, to prepare their machine for producing DPE intros.

## Prerequisites (Claude verifies, prompts to install if missing)

1. **Node.js ≥ 22**
   ```bash
   node --version
   ```
   If missing or < 22: direct user to https://nodejs.org/en/download — they download the "LTS" installer for their OS. After install, they restart the terminal.

2. **FFmpeg**
   ```bash
   ffmpeg -version
   ```
   If missing:
   - **Windows:** direct to https://www.gyan.dev/ffmpeg/builds/ — download "full_build", extract, add `bin/` to PATH. Or use `winget install Gyan.FFmpeg`.
   - **Mac:** `brew install ffmpeg`
   - **Linux:** `sudo apt install ffmpeg`

3. **Claude Code** — if they're reading this skill inside Claude Code, they already have it. Otherwise direct to https://claude.com/claude-code.

4. **OpenAI API key** — needed for word-level transcription. $0.006 per minute of audio (~$0.0015 per intro). They get one at https://platform.openai.com/api-keys. Save to the repo's `.env` file:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Install Steps

Run these in order. Each step should succeed before moving to the next.

### Step 1: Install Hyperframes skills globally

```bash
npx skills add heygen-com/hyperframes
```

This installs `/hyperframes`, `/hyperframes-cli`, and `/gsap` slash commands into Claude Code. Hyperframes is the HTML-to-video renderer we use.

### Step 2: Initialize a Hyperframes project in the repo

```bash
cd /path/to/dpe-youtube-intro
npx hyperframes init working --yes
```

Creates a `working/` folder scaffolded with Hyperframes' structure.

### Step 3: Copy DPE template files into the working folder

```bash
# From repo root
cp template/index.html working/
cp template/overlay.html working/
```

The `template/` folder has the locked-in DPE pattern. Copying it into `working/` gives the user a starting point that matches the brand.

### Step 4: Install npm dependencies for the transcribe script

```bash
cd /path/to/dpe-youtube-intro/scripts
npm init -y
npm install openai minimist
```

The `word-transcribe.js` script needs `openai` and `minimist`.

### Step 5: Verify the `.env` file has OPENAI_API_KEY

Check if `.env` exists at repo root. If not, create it with a prompt for the key:
```
OPENAI_API_KEY=<paste key here>
```

If the user hasn't provided a key yet, pause and ask them to paste it before continuing.

### Step 6: Run smoke test

Render the example composition that ships with the repo to verify everything works:

```bash
cd /path/to/dpe-youtube-intro
cp examples/approved-reference-source.* working/assets/ 2>/dev/null || true
cd working
npx hyperframes lint
```

The lint should report 0 errors. If it errors, something's wrong with the copy — stop and debug.

### Step 7: Report success

Tell the user:
- All dependencies are installed.
- The `/dpe-intro` skill is now ready to use.
- They can produce their first intro by running `/dpe-intro <path-to-peter-clip.mp4>`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `node: command not found` | Restart terminal after installing Node. |
| `ffmpeg: command not found` on Windows | FFmpeg folder's `bin/` must be in PATH. Use System Environment Variables. |
| `whisper-cpp not found` when running `npx hyperframes transcribe` | We don't use Hyperframes transcribe — we use our own OpenAI wrapper in `scripts/word-transcribe.js`. Ignore this error. |
| `OPENAI_API_KEY` not found | Create `.env` at repo root with `OPENAI_API_KEY=sk-...`. |
| `npx skills add` fails | Requires `npm ≥ 9`. Upgrade with `npm install -g npm@latest`. |

## What the user ends up with

After this skill runs successfully:
- Hyperframes skills installed globally in Claude Code
- `working/` folder scaffolded with DPE template
- `scripts/` has npm deps for the Whisper wrapper
- `.env` has their OpenAI API key
- They're ready to run `/dpe-intro <clip-path>`
