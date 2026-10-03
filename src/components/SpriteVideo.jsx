import React, { useRef, useEffect, useState } from 'react';

const ANIMATIONS = {
  waving: { start: 5.0, end: 6.0, next: 'armsCrossed' }, 
  armsCrossed: { start: 3.0, end: 4.0, next: 'armsCrossed' }, 
  thumbsUp: { start: 8.0, end: 10.0, next: 'armsCrossed' },
  idle: { start: 0.0, end: 0.5, next: 'idle' },
};

export default function SpriteVideo({ isOn }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentAnim, setCurrentAnim] = useState('idle');
  const frameRef = useRef(null);

  // Sync state with power switch
  useEffect(() => {
    if (isOn) setCurrentAnim('waving');
    else setCurrentAnim('idle');
  }, [isOn]);

  // Listen for START button
  useEffect(() => {
    const handleStart = () => {
      if (isOn) setCurrentAnim('thumbsUp');
    };
    window.addEventListener('startBtn', handleStart);
    return () => window.removeEventListener('startBtn', handleStart);
  }, [isOn]);

  // Video playback controller
  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentAnim === 'idle') {
      if (video) video.pause();
      return;
    }

    const anim = ANIMATIONS[currentAnim];
    video.currentTime = anim.start;
    
    // Slow down the arms crossed animation
    if (currentAnim === 'armsCrossed') {
      video.playbackRate = 0.5; // Half speed
    } else {
      video.playbackRate = 1.0; // Normal speed
    }
    
    video.play().catch(e => console.warn("Autoplay blocked until interaction", e));

    let checkTimeRef;
    const checkTime = () => {
      if (!video.paused && video.currentTime >= anim.end) {
        if (anim.next === currentAnim) {
          video.currentTime = anim.start; // Loop
        } else {
          setCurrentAnim(anim.next); // Transition
          return;
        }
      }
      checkTimeRef = requestAnimationFrame(checkTime);
    };
    checkTimeRef = requestAnimationFrame(checkTime);

    return () => {
      cancelAnimationFrame(checkTimeRef);
    };
  }, [currentAnim]);

  // Real-time Canvas Chroma Key
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    const processFrame = () => {
      if (video.paused || video.ended) {
        frameRef.current = requestAnimationFrame(processFrame);
        return;
      }
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frameData.data;
      const w = canvas.width;
      const h = canvas.height;
      
      // Pass 1: Flood-fill to find connected background
      const visited = new Uint8Array(w * h);
      const stack = [];
      
      const isCheckerboard = (idx) => {
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        const colorfulness = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
        const brightness = (r + g + b) / 3;
        // Strict threshold to avoid leaking into hair/outline
        return colorfulness < 35 && brightness > 90;
      };

      // Seed the edges
      for (let x = 0; x < w; x++) {
        if (isCheckerboard((x) * 4)) { stack.push(x); visited[x] = 1; }
        if (isCheckerboard(((h - 1) * w + x) * 4)) { stack.push((h - 1) * w + x); visited[(h - 1) * w + x] = 1; }
      }
      for (let y = 0; y < h; y++) {
        if (isCheckerboard((y * w) * 4)) { stack.push(y * w); visited[y * w] = 1; }
        if (isCheckerboard((y * w + w - 1) * 4)) { stack.push(y * w + w - 1); visited[y * w + w - 1] = 1; }
      }

      // Fast Flood-fill
      while (stack.length > 0) {
        const curr = stack.pop();
        const cx = curr % w;
        const cy = Math.floor(curr / w);

        // Make background 100% transparent (no fading needed, it's definitely background)
        const i = curr * 4;
        data[i + 3] = 0;

        // Check neighbors
        if (cx > 0) {
          const n = curr - 1;
          if (!visited[n] && isCheckerboard(n * 4)) { visited[n] = 1; stack.push(n); }
        }
        if (cx < w - 1) {
          const n = curr + 1;
          if (!visited[n] && isCheckerboard(n * 4)) { visited[n] = 1; stack.push(n); }
        }
        if (cy > 0) {
          const n = curr - w;
          if (!visited[n] && isCheckerboard(n * 4)) { visited[n] = 1; stack.push(n); }
        }
        if (cy < h - 1) {
          const n = curr + w;
          if (!visited[n] && isCheckerboard(n * 4)) { visited[n] = 1; stack.push(n); }
        }
      }
      
      // Pass 2 & 3: Edge feathering & Stray dot cleanup
      const alphaBuffer = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) alphaBuffer[i] = data[i * 4 + 3];
      
      for (let y = 2; y < h - 2; y++) {
        for (let x = 2; x < w - 2; x++) {
          const idx = (y * w + x) * 4;
          const currentAlpha = alphaBuffer[y * w + x];
          
          if (currentAlpha > 0) {
            let transparentNeighbors = 0;
            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                if (alphaBuffer[(y + dy) * w + (x + dx)] === 0) transparentNeighbors++;
              }
            }
            
            if (transparentNeighbors >= 4) {
              // Erode pixels that are sticking out or on the very edge (destroys the halo)
              data[idx + 3] = 0;
            } else if (transparentNeighbors > 0) {
              // Softly feather inner edges
              data[idx + 3] = Math.round(currentAlpha * (1 - (transparentNeighbors / 8) * 0.8));
            }
            
            // Stray dot check
            let wideTransparentCount = 0;
            for (let dy = -2; dy <= 2; dy++) {
              for (let dx = -2; dx <= 2; dx++) {
                if (dx === 0 && dy === 0) continue;
                if (alphaBuffer[(y + dy) * w + (x + dx)] === 0) wideTransparentCount++;
              }
            }
            if (wideTransparentCount >= 14) data[idx + 3] = 0;
          }
        }
      }
      
      ctx.putImageData(frameData, 0, 0);
      frameRef.current = requestAnimationFrame(processFrame);
    };
    
    frameRef.current = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div 
      className={`hidden lg:block fixed transition-all duration-1000 ease-out transform pointer-events-none z-[5] ${
        isOn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ 
        right: '-120px', 
        bottom: '80px',
        width: '700px',
        height: '520px',
      }}
    >
      <video 
        ref={videoRef}
        src="/transparent.mp4" 
        muted 
        playsInline 
        crossOrigin="anonymous"
        className="hidden" 
      />
      <canvas
        ref={canvasRef}
        width={550}
        height={520}
        className="w-full h-full filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
      />
    </div>
  );
}
