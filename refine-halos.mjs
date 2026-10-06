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
  
  console.log('Applying edge erosion to remove white halos...');
  
  // Create a copy of the alpha channel to check neighbors
  const alphaBuffer = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    alphaBuffer[i] = data[i * 4 + 3];
  }
  
  // Erode edges by 1 pixel (if a pixel is near transparency AND it is very bright/white, make it transparent)
  let removedPixels = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      const alpha = alphaBuffer[y * w + x];
      
      // If the pixel is visible
      if (alpha > 0) {
        // Count how many transparent neighbors it has
        let transparentNeighbors = 0;
        if (alphaBuffer[(y - 1) * w + x] === 0) transparentNeighbors++;
        if (alphaBuffer[(y + 1) * w + x] === 0) transparentNeighbors++;
        if (alphaBuffer[y * w + (x - 1)] === 0) transparentNeighbors++;
        if (alphaBuffer[y * w + (x + 1)] === 0) transparentNeighbors++;
        
        if (transparentNeighbors > 0) {
          // It's a border pixel. Check if it's white/light gray (the halo)
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r + g + b) / 3;
          
          if (brightness > 180) { // If it's a bright pixel on the edge, it's the white background halo
            data[idx + 3] = 0; // Make it transparent
            removedPixels++;
          } else {
             // For non-white edges, maybe just lower opacity a bit for anti-aliasing
             data[idx + 3] = Math.floor(alpha * 0.7);
          }
        }
      }
    }
  }
  
  // Do a second pass of erosion for any remaining bright halos that were 2 pixels deep
  const alphaBuffer2 = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) alphaBuffer2[i] = data[i * 4 + 3];

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = (y * w + x) * 4;
      const alpha = alphaBuffer2[y * w + x];
      if (alpha > 0) {
        let transparentNeighbors = 0;
        if (alphaBuffer2[(y - 1) * w + x] === 0) transparentNeighbors++;
        if (alphaBuffer2[(y + 1) * w + x] === 0) transparentNeighbors++;
        if (alphaBuffer2[y * w + (x - 1)] === 0) transparentNeighbors++;
        if (alphaBuffer2[y * w + (x + 1)] === 0) transparentNeighbors++;
        if (transparentNeighbors > 0) {
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          if ((r + g + b) / 3 > 170) {
            data[idx + 3] = 0;
            removedPixels++;
          }
        }
      }
    }
  }

  console.log(`Removed ${removedPixels} halo pixels.`);
  ctx.putImageData(imageData, 0, 0);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/character/full-sequence.png', buffer);
  console.log('✅ Refined sprite sheet saved over full-sequence.png!');
}

refineSprite().catch(console.error);
