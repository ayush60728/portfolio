/**
 * stitch-sprites.mjs
 * Combines 5 transparent PNG frames into one horizontal sprite sheet.
 * Run: node stitch-sprites.mjs
 */

import { createCanvas, loadImage } from 'canvas';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FRAMES = [
  'idle',
  'idle_2',
  'raise',
  'thumbs_up',
  'wink',
];

const FRAME_W = 550;
const FRAME_H = 520;
const SHEET_W = FRAME_W * FRAMES.length;
const SHEET_H = FRAME_H;

async function main() {
  const canvas = createCanvas(SHEET_W, SHEET_H);
  const ctx = canvas.getContext('2d');

  // transparent background
  ctx.clearRect(0, 0, SHEET_W, SHEET_H);

  for (let i = 0; i < FRAMES.length; i++) {
    const imgPath = path.join(__dirname, 'public', 'character', `${FRAMES[i]}.png`);
    const img = await loadImage(imgPath);
    ctx.drawImage(img, i * FRAME_W, 0, FRAME_W, FRAME_H);
    console.log(`✅ Stitched: ${FRAMES[i]}.png → x=${i * FRAME_W}`);
  }

  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(__dirname, 'public', 'character', 'character-sprite.png');
  writeFileSync(outPath, buffer);
  console.log(`\n🎉 Sprite sheet saved to: public/character/character-sprite.png`);
  console.log(`   Dimensions: ${SHEET_W}×${SHEET_H}px`);
}

main().catch(console.error);
