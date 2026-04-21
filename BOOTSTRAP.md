# DPE YouTube Intro — Bootstrap

> **You are Claude Code**, running in a fresh chat on a freelancer's machine. They've pasted a prompt asking you to set up the DPE YouTube Intro toolkit. Follow these steps carefully, one by one. Talk to the user in plain English. Ask before destructive actions. Assume they have zero coding experience — explain what each step does before you run it.

## Context

The user is a Premiere Pro editor hired by Tim Gebhard to produce branded YouTube intros for Peter Holmquist's "Driven Publishers" channel. This toolkit uses Claude Code + Hyperframes + OpenAI Whisper to generate the intros from a raw clip. Your job right now: install everything they need, once.

## Step 0 — Greet and confirm

Say hello, confirm you're installing the DPE intro toolkit, and ask:
- What OS are they on? (Windows, Mac, Linux)
- Where would they like the toolkit installed? Offer a sensible default: `~/dpe-youtube-intro` (Mac/Linux) or `C:\dpe-youtube-intro` (Windows). Ask them to confirm or give an alternative.

Save the install path for later — call it `$INSTALL_PATH` in your head.

## Step 1 — Check Node.js

Run:
```bash
node --version
```

If it reports v22 or higher: great, move on.

If it reports a version below 22, OR the command isn't found: **do not silently install Node yourself**. Direct the user to:
- **Windows:** `winget install OpenJS.NodeJS.LTS` (in PowerShell, as Admin)
- **Mac:** `brew install node` (requires Homebrew from https://brew.sh)
- **Linux:** follow https://nodejs.org/en/download/package-manager

After they install, ask them to close and reopen Claude Code (or just close this terminal tab and reopen). Then re-run `node --version`. Don't continue until it reports ≥ v22.

## Step 2 — Check FFmpeg

Run:
```bash
ffmpeg -version
```

If the command isn't found, guide the user:
- **Windows:** `winget install Gyan.FFmpeg` (PowerShell, as Admin). After it finishes, close/reopen the terminal.
- **Mac:** `brew install ffmpeg`
- **Linux:** `sudo apt install ffmpeg` (or `dnf`, etc.)

Re-run `ffmpeg -version` to confirm.

## Step 3 — Check git

Run:
```bash
git --version
```

If missing: direct them to https://git-scm.com/downloads and wait for them to install. Re-check.

## Step 4 — Clone the repo

Run (replace `<INSTALL_PATH>` with what they chose in Step 0):
```bash
git clone https://github.com/gebhardtim1-lang/dpe-youtube-intro.git "<INSTALL_PATH>"
```

If the clone fails because the directory already exists and they want to start fresh, ask them before deleting anything. Most likely they want you to reuse the existing clone — in that case `cd` into it and run `git pull` to get the latest.

After clone/pull, `cd` into the folder.

## Step 5 — Install Hyperframes skills

From inside the cloned folder:
```bash
npx skills add heygen-com/hyperframes
```

This installs `/hyperframes`, `/hyperframes-cli`, and `/gsap` slash commands globally for Claude Code. If prompted to confirm, say yes.

## Step 6 — Install npm dependencies

Still inside the cloned folder:
```bash
npm install
```

This pulls in `openai` and `minimist` for the transcription script.

## Step 7 — Set up OpenAI API key

Tell the user:
> "I need an OpenAI API key to transcribe Peter's audio. It costs about $0.002 per 15-second intro — basically free.
>
> 1. Go to https://platform.openai.com/api-keys
> 2. Sign in (or sign up — free)
> 3. Click 'Create new secret key', copy the whole string (starts with `sk-`)
> 4. Paste it here."

Wait for them to paste. Don't echo the key back to the screen when you write it.

Create `.env` at the repo root:
```
OPENAI_API_KEY=<the-key-they-pasted>
```

Reassure them: "Your key stays only on your machine — `.env` is gitignored."

## Step 8 — Smoke test

Validate that the template lints cleanly:
```bash
cd "<INSTALL_PATH>/template"
npx hyperframes lint
```

Expected: `0 errors`. A handful of warnings is fine.

`cd` back to the repo root.

## Step 9 — Final instructions (tell the user literally)

Tell them (adapt the path to their install location):

> 🎉 **Installation complete.**
>
> To make your first intro:
>
> 1. **Close this Claude Code window.**
> 2. **Reopen Claude Code** and open the folder `<INSTALL_PATH>` as the project (File → Open Folder → pick that folder).
> 3. **Start a fresh chat.**
> 4. Export a 12-18s intro section from Peter's raw video as an MP4 (any editor — Premiere is fine). Save it somewhere memorable.
> 5. In the fresh chat, paste this prompt (replace the path with your real clip path):
>
>    ```
>    Make a DPE intro for "C:\path\to\your\exported-intro.mp4"
>    ```
>
>    (On Mac/Linux use forward slashes: `/Users/you/path/to/clip.mp4`)
>
> 6. Claude will transcribe, design, and render. Review the preview, approve or request tweaks, deliver the PNG sequence.
>
> Full guide: https://gebhardtim1-lang.github.io/dpe-youtube-intro/INSTRUCTIONS.html

## Error recovery

If any step fails, stop and diagnose. Don't silently skip. Ask the user to paste the full error output, then search for it (a WebSearch is fine) or apply the fixes in `INSTRUCTIONS.html` → Troubleshooting section. Common failures:
- Node/FFmpeg not in PATH → restart terminal after install
- `npx skills add` fails → upgrade npm: `npm install -g npm@latest`
- `npm install` fails with permission errors on Windows → run Claude Code / terminal as Administrator once
- OpenAI API key rejected → regenerate at platform.openai.com/api-keys

If fully stuck: tell them to message Tim directly with a screenshot of the error.
