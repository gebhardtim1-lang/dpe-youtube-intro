#!/usr/bin/env node
/**
 * Word-level Whisper transcription for DPE YouTube intros.
 *
 * Usage:
 *   node scripts/word-transcribe.js <audio-or-video> [output.json]
 *
 * Reads OPENAI_API_KEY from (in order):
 *   1. Environment variable
 *   2. .env file at repo root
 *
 * Output JSON contains `words[]` with { start, end, word } tuples
 * (word-level timestamps from Whisper's verbose_json response).
 */
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

function loadDotenv() {
  const repoRoot = path.resolve(__dirname, '..');
  const envPath = path.join(repoRoot, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function getApiKey() {
  loadDotenv();
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-paste-your-key-here') {
    return process.env.OPENAI_API_KEY;
  }
  console.error('Error: OPENAI_API_KEY not set.');
  console.error('Create a .env file at the repo root with:');
  console.error('  OPENAI_API_KEY=sk-...');
  console.error('Get a key at https://platform.openai.com/api-keys');
  process.exit(1);
}

async function main() {
  const inputPath = process.argv[2];
  const outPath = process.argv[3] || 'transcript.json';
  if (!inputPath) {
    console.error('Usage: node word-transcribe.js <audio-or-video> [output.json]');
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error(`File not found: ${inputPath}`);
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: getApiKey() });
  console.log(`Transcribing ${inputPath}...`);

  const r = await openai.audio.transcriptions.create({
    file: fs.createReadStream(inputPath),
    model: 'whisper-1',
    response_format: 'verbose_json',
    timestamp_granularities: ['word'],
  });

  fs.writeFileSync(outPath, JSON.stringify(r, null, 2));
  console.log(`\nTranscript saved: ${outPath}`);
  console.log(`Duration: ${r.duration.toFixed(2)}s | Words: ${(r.words || []).length}\n`);
  console.log('Word timings:');
  for (const w of r.words || []) {
    console.log(`  ${w.start.toFixed(2)}s - ${w.end.toFixed(2)}s  ${w.word}`);
  }
}

main().catch((e) => {
  console.error('Error:', e.message || e);
  process.exit(1);
});
