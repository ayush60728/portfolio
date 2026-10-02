import React, { useRef, useEffect, useState } from 'react';

const ANIMATIONS = {
  waving: { start: 5.0, end: 6.9, next: 'armsCrossed' }, 
  armsCrossed: { start: 3.0, end: 4.9, next: 'armsCrossed' }, 
  idle: { start: 0.0, end: 0.5, next: 'idle' },
};

export default function SpriteVideo({ isOn }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentAnim, setCurrentAnim] = useState('idle');
  const frameRef = useRef(null);

  useEffect(() => {
    if (isOn) setCurrentAnim('waving');
    else setCurrentAnim('idle');
  }, [isOn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentAnim === 'idle') {
      if (video) video.pause();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }

    const anim = ANIMATIONS[currentAnim];
    video.currentTime = anim.start;
    video.play();

    const handleTimeUpdate = () => {
      if (video.currentTime >= anim.end) {
        if (anim.next === currentAnim) {
          video.currentTime = anim.start;
        } else {
          setCurrentAnim(anim.next);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [currentAnim]);

  // Canvas Chroma Key Processor
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
      
      // Draw video to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Extract pixels
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frameData.data;
      
      // Remove checkerboard (white and light grey pixels)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Checkerboard is purely grayscale and bright. 
        // Character has color (tan, blue, brown). 
        const isGrayscale = Math.abs(r - g) < 15 && Math.abs(g - b) < 15;
        const isBright = r > 160; 
        
        if (isGrayscale && isBright) {
          data[i + 3] = 0; // Set alpha to 0 (transparent)
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
      className={`hidden lg:block absolute transition-all duration-1000 ease-out transform pointer-events-none -z-10 ${
        isOn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ 
        right: '-12%', 
        bottom: '0',
        width: '420px',
        height: '520px',
      }}
    >
      <video 
        ref={videoRef}
        src="/transparent.mp4" 
        muted 
        playsInline 
        crossOrigin="anonymous"
        className="hidden" // Hide the actual video
      />
      {/* Show the filtered canvas instead */}
      <canvas
        ref={canvasRef}
        width={420}
        height={520}
        className="w-full h-full object-right-bottom filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
      />
    </div>
  );
}
