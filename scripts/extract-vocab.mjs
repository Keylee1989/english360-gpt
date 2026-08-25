#!/usr/bin/env node
/**
 * ECDICT Vocabulary Extractor
 * Reads ecdict.csv and generates TypeScript word bank files organized by CEFR level.
 * 
 * Usage: node scripts/extract-vocab.mjs
 * Input: /tmp/ECDICT-master/ecdict.csv
 * Output: src/engines/vocabulary/data/words-ecdict-{level}.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const CSV_PATH = resolve('scripts/ECDICT-master/ecdict.csv');
const OUTPUT_DIR = resolve('src/engines/vocabulary/data');

// ============================================================
// Parse CSV (handles quoted fields with commas/newlines)
// ============================================================
function parseCSV(text) {
  const lines = [];
  let current = '';
  let inQuote = false;
  
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuote = !inQuote;
      current += ch;
    } else if (ch === '\n' && !inQuote) {
      if (current.trim()) lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) lines.push(current);
  
  return lines.map(line => {
    const fields = [];
    let field = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQ = !inQ;
      } else if (ch === ',' && !inQ) {
        fields.push(field);
        field = '';
      } else {
        field += ch;
      }
    }
    fields.push(field);
    return fields;
  });
}

// ============================================================
// Word filtering and CEFR assignment
// ============================================================

// Stop words and very basic function words (already in A1)
const SKIP_WORDS = new Set([
  'the', 'a', 'an', 'i', 'me', 'my', 'mine', 'we', 'our', 'ours',
  'you', 'your', 'yours', 'he', 'him', 'his', 'she', 'her', 'hers',
  'it', 'its', 'they', 'them', 'their', 'theirs',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'doing',
  'have', 'has', 'had', 'having',
  'will', 'shall', 'would', 'should', 'can', 'could', 'may', 'might', 'must',
  'and', 'or', 'but', 'if', 'then', 'so', 'because', 'that', 'this', 'these', 'those',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'into',
  'not', 'no', 'yes', 'hello', 'hi', 'goodbye', 'bye',
  'what', 'where', 'when', 'who', 'which', 'how', 'why',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
]);

// Exam tags that indicate useful vocabulary
const USEFUL_TAGS = new Set(['zk', 'gk', 'cet4', 'cet6', 'ielts', 'toefl', 'gre', 'bec', 'kaoyan']);

// CEFR level mapping based on Collins rating + frequency
function assignCEFR(collins, frq, bnc) {
  const freq = parseInt(frq) || 99999;
  const b = parseInt(bnc) || 99999;
  const avgFreq = (freq + b) / 2;
  const c = parseInt(collins) || 0;
  
  if (c >= 5 || avgFreq < 500) return 'A1';
  if (c >= 4 || avgFreq < 2000) return 'A2';
  if (c >= 3 || avgFreq < 8000) return 'B1';
  if (c >= 2 || avgFreq < 25000) return 'B2';
  if (c >= 1 || avgFreq < 80000) return 'C1';
  return 'C2';
}

function assignDifficulty(cefr) {
  const map = { A1: 've', A2: 'e', B1: 'm', B2: 'h', C1: 'vh', C2: 'vh' };
  return map[cefr] || 'm';
}

// Extract first Chinese meaning (clean)
function extractMeaning(translation) {
  if (!translation) return '';
  // Take first line of translation
  let t = translation.split('\\n')[0].trim();
  // Remove leading POS markers like "n. ", "v. ", "adj. "
  t = t.replace(/^[a-z]+\.\s*/, '');
  // Take first meaning (before comma or semicolon)
  t = t.split(/[,;，；]/)[0].trim();
  return t;
}

// Extract POS from translation
function extractPOS(translation, posField) {
  if (posField && posField.trim()) {
    const p = posField.toLowerCase().trim();
    if (p.includes('vt') || p.includes('vi') || p === 'v') return 'v';
    if (p === 'n' || p === 'nc' || p === 'nq') return 'n';
    if (p === 'adj' || p === 'a') return 'adj';
    if (p === 'adv') return 'adv';
    if (p === 'prep') return 'prep';
    if (p === 'conj') return 'conj';
    if (p === 'pron') return 'pron';
    if (p === 'interj') return 'interj';
    if (p === 'det' || p === 'art') return 'det';
    if (p === 'aux') return 'aux';
    if (p === 'num') return 'num';
  }
  // Infer from translation prefix
  if (translation) {
    const firstLine = translation.split('\\n')[0];
    if (/^v[t]?\./.test(firstLine)) return 'v';
    if (/^n\.|^n\//.test(firstLine)) return 'n';
    if (/^adj/.test(firstLine)) return 'adj';
    if (/^adv/.test(firstLine)) return 'adv';
  }
  return 'n';
}

// ============================================================
// Main extraction
// ============================================================
console.log('Reading ECDICT CSV...');
const raw = readFileSync(CSV_PATH, 'utf-8');
const rows = parseCSV(raw);
console.log(`Total rows: ${rows.length}`);

// Skip header
const header = rows[0];
const dataRows = rows.slice(1);
console.log(`Data rows: ${dataRows.length}`);

// Filter and process words
const wordsByLevel = { A1: [], A2: [], B1: [], B2: [], C1: [], C2: [] };
let skipped = 0;

for (const row of dataRows) {
  const [word, phonetic, definition, translation, pos, collins, oxford, tag, bnc, frq] = row;
  
  // Skip if no word or no translation
  if (!word || !word.trim() || !translation || !translation.trim()) {
    skipped++;
    continue;
  }
  
  const w = word.trim().toLowerCase();
  
  // Skip very short, very long, or skip words
  if (w.length < 2 || w.length > 25) { skipped++; continue; }
  if (SKIP_WORDS.has(w)) { skipped++; continue; }
  // Skip single letters and non-standard words
  if (w.length <= 2) { skipped++; continue; }
  // Skip words with special characters (keep only letters, hyphens, apostrophes)
  if (!/^[a-z][a-z'-]*$/.test(w)) { skipped++; continue; }
  // Skip words that are just numbers or symbols
  if (/^[0-9]/.test(w) || /^['"]/.test(w)) { skipped++; continue; }
  
  // Extract clean Chinese meaning
  const meaning = extractMeaning(translation);
  if (!meaning || meaning.length < 1) { skipped++; continue; }
  
  // Extract IPA
  let ipa = phonetic ? phonetic.trim() : '';
  if (ipa && !ipa.startsWith('/')) ipa = '/' + ipa;
  if (ipa && !ipa.endsWith('/') && !ipa.endsWith('/ ')) ipa = ipa + '/';
  
  // Assign CEFR level
  const cefr = assignCEFR(collins, frq, bnc);
  const difficulty = assignDifficulty(cefr);
  const partOfSpeech = extractPOS(translation, pos);
  
  // Check tags for exam relevance
  const tags = tag ? tag.trim().split(/\s+/) : [];
  
  wordsByLevel[cefr].push({
    w, ipa, zh: meaning, pos: partOfSpeech, dif: difficulty,
    ex: '', exzh: '', syn: '', ant: '',
    tags: tags.join(','),
    frq: parseInt(frq) || 99999,
  });
}

console.log('\n=== Word counts by CEFR level ===');
for (const [level, words] of Object.entries(wordsByLevel)) {
  console.log(`${level}: ${words.length} words`);
}
console.log(`Skipped: ${skipped}`);
console.log(`Total: ${Object.values(wordsByLevel).reduce((a, b) => a + b.length, 0)}`);

// ============================================================
// Generate TypeScript files
// ============================================================

function generateTSFile(words, level, category) {
  // Remove tags and frq from output (internal use only)
  const clean = words.map(({ tags, frq, ...rest }) => rest);
  
  const safeName = level.toUpperCase();
  const lines = [
    `/**`,
    ` * ${level} Vocabulary Bank — ${category}`,
    ` * Auto-generated from ECDICT. ${clean.length} words.`,
    ` * Format: CompactWord { w, ipa, zh, pos, dif, ex, exzh }`,
    ` */`,
    ``,
    `import type { CompactWord } from "./vocab-generator";`,
    ``,
    `export const WORDS_${safeName}: CompactWord[] = [`,
  ];
  
  for (const word of clean) {
    const esc = (s) => (s || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    lines.push(
      `  { w: "${esc(word.w)}", ipa: "${esc(word.ipa)}", zh: "${esc(word.zh)}", pos: "${word.pos}", dif: "${word.dif}", ex: "", exzh: "" },`
    );
  }
  
  lines.push(`];`);
  return lines.join('\n');
}

// Write files for each level
const TARGET_COUNTS = {
  A1: 500,
  A2: 1350,
  B1: 4678,
  B2: 5000,
  C1: 5000,
  C2: 3500,
};

for (const [level, words] of Object.entries(wordsByLevel)) {
  // Sort by frequency (lower = more common)
  words.sort((a, b) => a.frq - b.frq);
  
  // Take up to target count
  const target = TARGET_COUNTS[level] || 1000;
  const selected = words.slice(0, target);
  
  const filename = `words-ecdict-${level.toLowerCase()}.ts`;
  const content = generateTSFile(selected, level, `${level} Core`);
  writeFileSync(resolve(OUTPUT_DIR, filename), content);
  console.log(`Written: ${filename} (${selected.length} words)`);
}

console.log('\nDone! Now update all-words.ts to import the new files.');
