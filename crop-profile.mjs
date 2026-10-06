import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';

async function cropImage() {
  const image = await loadImage('/home/ayush/.gemini/antigravity/brain/f054acba-f354-4269-85bc-7e6f9fe2557d/.user_uploaded/media_1791210303149.png');
  
  // The user wants to remove the footer. The footer seems to be the very bottom part.
  // Let's crop the bottom 10% or just precisely above the signature.
  // I'll cut off the bottom 30 pixels (which should remove the black section and signature).
  // Actually, let's just crop it so the bottom edge is the wooden bar, or just cut 40px off the bottom.
  const cropBottom = 40; 
  
  const width = image.width;
  const height = image.height - cropBottom;
  
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Draw the image, cropping the bottom
  ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/profile-pic.png', buffer);
  console.log('✅ Cropped image saved to public/profile-pic.png!');
}

cropImage().catch(console.error);
