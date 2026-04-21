# DPE YouTube Intro — Brand & Motion Bible

**Read this every time you generate a new intro composition.** It defines the visual language. No exceptions, no deviations.

---

## 1. Palette (hex, canonical)

| Token | Hex | Usage |
|-------|-----|-------|
| `DPE_CYAN_PRIMARY` | `#00C2FF` | Headlines, key accents, hero glow |
| `DPE_CYAN_BRIGHT` | `#00E5FF` | Secondary highlights, gradient endpoints |
| `DPE_BLUE_HOVER` | `#0075FF` | Gradient deep end (rarely used alone) |
| `DPE_BG_DARK` | `#050508` | Primary dark background |
| `DPE_BG_NAVY` | `#0a1a2e` | Panel center gradient (list backdrop) |
| `DPE_GOLD` | `#F5A623` | Money / hero text (e.g. "$5 Million", "Into one book") |
| `DPE_GOLD_DEEP` | `#F08912` | Gold gradient end |
| `DPE_RED_ALERT` | `#FF4444` | Pain-point indicators (list bullets) |
| `DPE_WHITE` | `#FFFFFF` | Primary text |
| `DPE_WHITE_SOFT` | `rgba(255,255,255,0.88)` | Secondary text (subdued) |

### Rules
- Cyan is the brand hero color — use sparingly for maximum impact.
- Gold is reserved for **money, proof, or the main promise** (e.g. "$5 Million", "Into one book"). Never use gold for pain-points or secondary text.
- Red is reserved for **pain-point list items**. Never use red for positive messaging.
- No pure black — use `#050508`. No pure white for backgrounds — use low-alpha overlays.

---

## 2. Typography

| Role | Family | Weights | Notes |
|------|--------|---------|-------|
| Headlines / phrases | **Montserrat** | 900 (black), italic 900 | ALL CAPS for hero phrases. Letter-spacing -1 to -10px depending on size. |
| Body / wordmark / subtitles | **Open Sans** | 400, 600, 700 | Letter-spacing 4-16px for labels/eyebrows. |

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,700;0,900;1,900&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

### Font-size guide (at 1920x1080)
- Hero phrase (like "$5 Million"): 220-260px
- Standard phrase (like "Lessons from a decade"): 88-100px
- List item text: 52-60px
- List panel title (like "2026"): 110-130px
- Wordmark / eyebrow labels: 20-28px, letter-spacing 4-16px

---

## 3. Motion Presets

All motion uses GSAP. No linear easing for entrances — always use springs or `back.out`.

### Enter (element appears)
```
ease: "back.out(1.6)" or "back.out(1.8)" for hero elements
ease: "power3.out" for slide-ins
duration: 0.45-0.70s
```

### Idle pulse (hero elements while on screen)
```
ease: "sine.inOut"
scale: 1 → 1.04
duration: 0.8-1.4s
```

### Exit
```
duration: 0.30-0.45s
Add overwrite: "auto" to avoid conflicts with entrance/idle tweens
```

### Particle burst (money / hero reveals)
```
Enter: stagger 0.04s, ease "back.out(2)", scale 0→1 over 0.35s
Exit: stagger 0.03s, scale 1→1.8, y -50, opacity 1→0 over 0.55s
```

### Cyan underline swipe (under a phrase)
```
Transform: scaleX 0 → 1, transform-origin: left center
Duration: matches phrase speaking duration (e.g. "Lessons from a decade" = 2.0s)
Ease: "none" (linear swipe — matches natural speech pacing)
```

---

## 4. Composition Structure (2-phase pattern)

Every DPE intro uses this pattern. Total duration: 12-18 seconds.

### Phase 1 — "HUD + Kinetic Text" (0 - ~7s)

Peter visible, branded HUD overlays + kinetic phrase callouts synced to his words.

**Persistent HUD elements** (fade in 0-0.5s, hold through Phase 1):
- Radial vignette (edges darkened, `rgba(5,5,8,0.65)` at 100%, transparent at 45%)
- Blueprint grid overlay (80px spacing, `rgba(0,194,255,0.10)` lines)
- Top + bottom cyan accent bars (4px, horizontal gradient fade)
- Wordmark top-left: `● DRIVEN PUBLISHERS ELITE` (Open Sans 700, 22px, letter-spacing 4px)

**Kinetic phrases** (word-synced to transcript, one at a time):
- Pick 3-5 punchy phrases per ~7s (one per ~1.5-2s of speech)
- Each phrase lands at the word-level onset of its key word
- Hold each phrase for the duration of the spoken phrase + 0.3-0.5s tail
- Fade out before next phrase enters (slight overlap is fine for dynamic feel)

Phrase placement varies — don't stack them all in the same spot:
- Lower-left for declarative phrases ("Lessons from a decade")
- Center for hero reveals ("$5 Million")
- Lower-right chip for nouns/platforms ("Amazon KDP")
- Center-large for closers ("Into one book")

### Phase 2 — "Full-Screen List Takeover" (optional, ~7s - end)

**Only trigger this when the transcript naturally calls for a list.** If the speaker is enumerating 3+ items, use this phase. If not, skip it — don't force full-screen content.

**Trigger signals in the transcript:**
- "struggle with X, Y, Z, and W"
- "the 3 things you need are..."
- "most people fail at A, B, C..."
- "here are the top 5..."

**Layout:**
- Opaque dark panel fills frame (Peter hidden, audio continues)
- Blueprint grid visible on panel (higher contrast, `rgba(0,194,255,0.15)` lines)
- Centered title up top: eyebrow (cyan label) + hero number/year + subtitle
- 4 list items stacked, each with a red alert bullet (`!` in red-outlined circle)
- Each item springs in from left EXACTLY when speaker names it (word-synced)

**List item bullet style:**
- 46x46px circle, 3px red border (`#FF4444`), red text `!` inside
- Background `rgba(245,70,70,0.15)`, glow `0 0 20px rgba(255,68,68,0.4)`

---

## 5. Audio handling

Hyperframes requires separate `<video>` (muted) + `<audio>` elements for a clip with sound.

```html
<video class="clip bg-video" data-start="0" data-duration="17.5"
       data-track-index="0" muted src="assets/peter.mp4"></video>
<audio class="clip" data-start="0" data-duration="17.5"
       data-track-index="1" data-volume="1.0" src="assets/peter.aac"></audio>
```

Extract the audio track as AAC alongside the video:
```bash
ffmpeg -i peter.mp4 -vn -acodec copy peter.aac
```

---

## 6. Transcript corrections dictionary

Whisper frequently mis-hears domain terms. Always apply these corrections before placing text:

| Whisper heard | Correct |
|---------------|---------|
| K2P, KP2, KTP | **KDP** |
| publisher champ, publisherchamps | PublisherChamp |
| driven publisher elite, drive publishers | Driven Publishers Elite |
| Peter Holmquist → check both spellings | Holmquist |

Add new corrections when you encounter them.

---

## 7. Reference files (must read before generating)

Every new composition starts by reading these:

1. **This file** (`brand/brand.md`) — tokens & patterns
2. **`examples/approved-reference.mp4`** — the approved reference render (v3b): Peter's "Lessons from a decade... 5 million... Amazon KDP... Into one book... publishers in 2026 struggle with..." intro. Study the pacing, phrase placement, animation style.
3. **`template/index.html`** — the composited pattern (with Peter video layer)
4. **`template/overlay.html`** — the overlay-only pattern (transparent bg, for production shipping)

When generating a new composition, don't write from scratch — adapt the reference pattern with the new transcript's word timings and phrase choices.

---

## 8. Safe zones (YouTube 16:9)

Avoid placing overlays in these regions where YouTube adds UI:
- Bottom 10% — progress bar / controls
- Top-right 20% — info cards / end screens
- Bottom-right 15% — subscribe button hover, watermark

Keep hero phrases in the middle 60% of the frame both horizontally and vertically.

---

## 9. Output specs

- **Composition:** 1920×1080 at 30fps
- **Duration:** 12-18 seconds
- **Preview render:** MP4 H.264, standard quality, ~7-10 MB
- **Overlay render:** MOV ProRes 4444 with alpha, ~1 GB for 17s
- **PNG sequence:** RGBA, 30fps, `dpe-intro_%04d.png` naming, ~4 GB for 525 frames

---

## 10. Anti-patterns (NEVER do these)

- ❌ Full-screen DPE logo/wordmark ident at the start — don't open with a brand card. Brand should feel organic, not advertised.
- ❌ Gold for pain points or red for success — colors are semantic.
- ❌ Linear ease on entrances — always spring.
- ❌ Covering Peter's face with text — he's the hook. Use bottom-third, corners, or full takeover.
- ❌ More than 1 phrase on screen at once (except during quick overlapping transitions <0.4s).
- ❌ Full-screen takeover when there's no list in the transcript — earn the takeover with content.
- ❌ Peter audio muted during list takeover — his voice carries the intro; the visual is just illustration.
