---
name: dpe-intro
description: Generate a branded DPE YouTube intro from a raw Peter talking-head clip. Transcribes with word-level Whisper, picks phrases, syncs animations, renders composited preview + PNG sequence overlay. Trigger - "/dpe-intro <clip-path>", "create DPE intro for <clip>", "make an intro for <clip>".
---

# DPE Intro — Per-Video Skill

Generate a branded intro overlay for a raw Peter Holmquist talking-head clip. Ships as a PNG sequence with alpha, ready for the editor to composite over Peter in Premiere.

## Input

A video file path. The freelancer exports this themselves from Peter's full raw YouTube recording — specifically the INTRO SECTION where Peter is on camera (before any screenshare starts). Typical duration: 12-25 seconds.

Example invocations:
- `/dpe-intro E:\DPE-Intros\raw\2026-04-22-peter-pitch.mp4`
- `create a DPE intro for E:\path\intro-section.mp4`

The input is NOT the full raw YouTube recording. If the clip looks like it contains screenshare footage, ask the freelancer to re-export just the on-camera section.

## Prerequisites

The `dpe-intro-install` skill must have been run once. If anything is missing, Claude runs the install skill automatically.

## MANDATORY READING (every invocation)

Before generating anything, read these four files. They define the brand and the pattern. No shortcuts.

1. **`brand/brand.md`** — DPE palette, fonts, motion presets, phrase patterns, anti-patterns
2. **`template/index.html`** — composited reference pattern (Peter + overlay)
3. **`template/overlay.html`** — overlay-only reference pattern (transparent bg, production format)
4. **`examples/approved-reference.mp4`** — the v3b approved render (motion benchmark)

Study these every time. The brand stays consistent because Claude re-reads these on every invocation.

## Workflow

### Step 1: Transcribe with word-level Whisper

```bash
cd /path/to/dpe-youtube-intro
node scripts/word-transcribe.js <input-clip-path> working/transcript.json
```

The script writes `transcript.json` with word-level timestamps. Read this file to understand what Peter is saying and when.

### Step 2: Apply corrections dictionary

Read `brand/brand.md` section 6 (corrections dictionary). Apply to the transcript: Whisper often mishears "KDP" as "K2P" etc. Always fix these before using the text.

### Step 3: Analyze the transcript

Identify:
- **Duration** — total clip length (trim if needed, max 18s)
- **Phase 1 phrases** (first ~7s) — pick 3-5 punchy noun/number phrases to animate. Prefer: numbers, money amounts, platforms, proof points.
- **Phase 2 opportunity** — is there a list (3+ items) anywhere? If yes, Phase 2 triggers. If no, skip Phase 2 and end the intro at ~8-10s.
- **Pauses** — is there a > 2s silent gap between sentences? If yes, splice it out with ffmpeg concat so speech feels tight. See `scripts/splice-silence.sh` for the template command.

### Step 4: Trim / splice the clip if needed

If Peter's first word starts > 1s into the clip, trim the lead-in:
```bash
ffmpeg -y -ss <offset> -i <input> -t <duration> -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k working/assets/peter.mp4
```

If there's a long pause mid-clip, splice it:
```bash
ffmpeg -y -i <input> -filter_complex "[0:v]trim=0:<sentence1_end>,setpts=PTS-STARTPTS[v1];[0:a]atrim=0:<sentence1_end>,asetpts=PTS-STARTPTS[a1];[0:v]trim=<sentence2_start>:<end>,setpts=PTS-STARTPTS[v2];[0:a]atrim=<sentence2_start>:<end>,asetpts=PTS-STARTPTS[a2];[v1][a1][v2][a2]concat=n=2:v=1:a=1[outv][outa]" -map "[outv]" -map "[outa]" -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k working/assets/peter.mp4
```

After trimming/splicing, re-transcribe to get accurate timings on the new clip.

### Step 5: Extract audio as AAC

Hyperframes needs audio on a separate track:
```bash
ffmpeg -y -i working/assets/peter.mp4 -vn -acodec copy working/assets/peter.aac
```

### Step 6: Generate the composition

Copy the template into working/ and customize:

```bash
cp template/index.html working/index.html
cp template/overlay.html working/overlay.html
```

Edit both files to:
- Update `data-duration` on root + Peter video/audio + all HUD elements to match actual clip duration
- Replace the 4 Phase 1 kinetic phrases with your picks, with word-synced `data-start` values
- If Phase 2 list triggered: update list items with correct text + word-synced `data-start` values
- If Phase 2 list NOT triggered: remove the entire Phase 2 section, extend Peter video duration to end of last phrase + 1s

**Timing rules:**
- Phrase `data-start` = 0.10-0.20s BEFORE the onset of its key word (gives viewer's eye time to track)
- Phrase `data-duration` = spoken phrase duration + 0.3-0.5s tail for readability
- List items `data-start` = exactly the onset of the first word (item is named, item appears)

### Step 7: Lint both compositions

```bash
cd working
npx hyperframes lint
```

Expect 0 errors. Warnings about "overlapping_gsap_tweens" are fine if those tweens have `overwrite: "auto"`.

### Step 8: Render composited preview (for freelancer to approve)

```bash
cd working
npx hyperframes render -q standard -o ../outputs/<video-slug>-preview.mp4
```

Takes 1-2 min. Show this to the freelancer — they scrub it and either approve or request changes.

### Step 9: If approved, render overlay-only MOV + convert to PNG sequence

```bash
# Overlay MOV with alpha
cd working
# (ensure overlay.html is the active index.html for render)
cp index.html index-composited.html && cp overlay.html index.html
npx hyperframes render -q standard --format mov -o ../outputs/<video-slug>-overlay.mov
cp index-composited.html index.html  # restore

# Convert to PNG sequence
mkdir -p ../outputs/<video-slug>-png-sequence
ffmpeg -y -i ../outputs/<video-slug>-overlay.mov ../outputs/<video-slug>-png-sequence/dpe-intro_%04d.png
```

### Step 10: Package and report to freelancer

Report these paths:
- **`outputs/<video-slug>-preview.mp4`** — composited preview (for reference)
- **`outputs/<video-slug>-overlay.mov`** — single-file alpha MOV (one option for Premiere)
- **`outputs/<video-slug>-png-sequence/`** — 30fps PNG sequence with alpha (Tim's preferred format)

Tell the freelancer:
1. Zip the PNG sequence folder before uploading
2. Upload to the shared Drive/Dropbox folder
3. Message Tim with the upload link + clip slug

## Rules for generating the composition

**Re-read `brand/brand.md` before each invocation.** Specifically the anti-patterns (section 10). Never open with a full-screen DPE brand card. Never force Phase 2 without a list. Don't cover Peter's face with phrases.

**Word sync is non-negotiable.** If phrases don't land on words, the freelancer sends it back. Use the word-level JSON from `transcript.json` — not estimates.

**Phase 2 is situational.** Check the transcript. If there's no natural list, make a shorter intro (Phase 1 only, ~8-10s) instead of padding.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Lint error "overlapping_clips_same_track" | Every element needs a UNIQUE `data-track-index`. No two elements share a track. |
| Lint error "overlapping_gsap_tweens" | Add `overwrite: "auto"` to the later tween on the same property. |
| Fonts not loading in render | Google Fonts `<link>` must be in `<head>`, not `<body>`. |
| "Video has sparse keyframes" warning | Re-encode Peter clip with `-g 30 -keyint_min 30`. Warning is non-fatal. |
| Whisper mishears KDP as K2P | Always apply corrections dictionary (brand.md section 6). |
| Render time > 5 min | Try `-q draft` first for iteration, `-q standard` only for final. Check CPU/RAM — rendering uses all cores. |
