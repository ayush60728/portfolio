import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function refineSprite() {
  console.log('Loading full-sequence.png...');
  const image = await loadImage('./public/character/full-sequence.png');
  const canvas = createCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const w = canvas.width;
  const h = canvas.height;
  
  console.log('Scanning for isolated background blobs (between fingers)...');
  
  let removedPixels = 0;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const alpha = data[idx + 3];
      
      if (alpha > 0) {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        const colorfulness = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
        const brightness = (r + g + b) / 3;
        
        // Background was gray/white. 
        // If it's grayish (colorfulness < 35) and brightness is between 90 and 220 (to avoid pure white teeth/eyes).
        if (colorfulness < 35 && brightness > 90 && brightness < 210) {
          data[idx + 3] = 0;
          removedPixels++;
        }
        // Extra check for slightly greenish/grayish artifacts left by compression
        else if (colorfulness < 45 && brightness > 120 && brightness < 200) {
          data[idx + 3] = 0;
          removedPixels++;
        }
      }
    }
  }

  console.log(`Removed ${removedPixels} internal background pixels.`);
  ctx.putImageData(imageData, 0, 0);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/character/full-sequence.png', buffer);
  console.log('✅ Refined sprite sheet saved over full-sequence.png!');
}

refineSprite().catch(console.error);
