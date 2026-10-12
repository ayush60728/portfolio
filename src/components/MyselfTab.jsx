import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { profileData } from '../data/portfolio';

const PIXEL_FRAME_CLIP = 'polygon(0 10px, 10px 10px, 10px 0, calc(100% - 10px) 0, calc(100% - 10px) 10px, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 10px calc(100% - 10px), 0 calc(100% - 10px))';

function PortraitBackgroundPattern({ imageSrc }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const frame = canvas?.parentElement;
    if (!canvas || !frame) return undefined;

    const image = new Image();
    image.decoding = 'async';
    image.src = imageSrc;
    let animationFrameId = null;

    const renderPattern = () => {
      if (!image.naturalWidth || !frame.clientWidth || !frame.clientHeight) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(frame.clientWidth * dpr));
      const height = Math.max(1, Math.round(frame.clientHeight * dpr));
      const pixelCount = width * height;
      const canvasContext = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;
      canvasContext.clearRect(0, 0, width, height);

      // Match the modal image's object-cover/object-top crop in an offscreen canvas.
      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = width;
      sourceCanvas.height = height;
      const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true });
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale;
      const drawnHeight = image.naturalHeight * scale;
      sourceContext.drawImage(image, (width - drawnWidth) / 2, 0, drawnWidth, drawnHeight);
      const sourcePixels = sourceContext.getImageData(0, 0, width, height).data;

      // Flood-fill the light, neutral region connected to the image edges. This
      // keeps the lines on the portrait background instead of the face or shirt.
      const backgroundMask = new Uint8Array(pixelCount);
      const queue = new Int32Array(pixelCount);
      let queueStart = 0;
      let queueEnd = 0;
      const isBackgroundPixel = (pixelIndex) => {
        const offset = pixelIndex * 4;
        const red = sourcePixels[offset];
        const green = sourcePixels[offset + 1];
        const blue = sourcePixels[offset + 2];
        const brightness = (red + green + blue) / 3;
        const colorSpread = Math.max(red, green, blue) - Math.min(red, green, blue);
        return brightness > 165 && colorSpread < 55;
      };
      const addBackgroundPixel = (pixelIndex) => {
        if (!backgroundMask[pixelIndex] && isBackgroundPixel(pixelIndex)) {
          backgroundMask[pixelIndex] = 1;
          queue[queueEnd] = pixelIndex;
          queueEnd += 1;
        }
      };

      for (let x = 0; x < width; x += 1) {
        addBackgroundPixel(x);
        addBackgroundPixel((height - 1) * width + x);
      }
      for (let y = 0; y < height; y += 1) {
        addBackgroundPixel(y * width);
        addBackgroundPixel(y * width + width - 1);
      }

      while (queueStart < queueEnd) {
        const pixelIndex = queue[queueStart];
        queueStart += 1;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        if (x > 0) addBackgroundPixel(pixelIndex - 1);
        if (x < width - 1) addBackgroundPixel(pixelIndex + 1);
        if (y > 0) addBackgroundPixel(pixelIndex - width);
        if (y < height - 1) addBackgroundPixel(pixelIndex + width);
      }

      const patternCanvas = document.createElement('canvas');
      patternCanvas.width = width;
      patternCanvas.height = height;
      const patternContext = patternCanvas.getContext('2d');
      const dotSpacing = 24 * dpr;
      const random = (seed) => {
        const value = Math.sin(seed * 12.9898) * 43758.5453;
        return value - Math.floor(value);
      };

      patternContext.shadowColor = 'rgba(52, 211, 153, 0.45)';
      patternContext.shadowBlur = 2 * dpr;

      // Dense overlapping mint dots create a soft retro halftone texture.
      for (let y = -dotSpacing; y < height + dotSpacing; y += dotSpacing) {
        for (let x = -dotSpacing; x < width + dotSpacing; x += dotSpacing) {
          const cellSeed = x * 0.13 + y * 0.37;
          const centerX = x + (random(cellSeed) - 0.5) * dotSpacing * 0.45;
          const centerY = y + (random(cellSeed + 1) - 0.5) * dotSpacing * 0.45;
          const dotCount = 4 + Math.floor(random(cellSeed + 2) * 3);

          for (let dotIndex = 0; dotIndex < dotCount; dotIndex += 1) {
            const dotSeed = cellSeed + dotIndex * 17.17;
            const radius = (1.7 + random(dotSeed) * 1.6) * dpr;
            const offsetX = (random(dotSeed + 1) - 0.5) * 7 * dpr;
            const offsetY = (random(dotSeed + 2) - 0.5) * 7 * dpr;
            const opacity = 0.48 + random(dotSeed + 3) * 0.34;

            patternContext.fillStyle = `rgba(52, 211, 153, ${opacity})`;
            patternContext.beginPath();
            patternContext.arc(centerX + offsetX, centerY + offsetY, radius, 0, Math.PI * 2);
            patternContext.fill();
          }
        }
      }

      const patternPixels = patternContext.getImageData(0, 0, width, height);
      for (let pixelIndex = 0; pixelIndex < pixelCount; pixelIndex += 1) {
        if (!backgroundMask[pixelIndex]) patternPixels.data[pixelIndex * 4 + 3] = 0;
      }
      patternContext.putImageData(patternPixels, 0, 0);
      canvasContext.drawImage(patternCanvas, 0, 0);
    };

    const scheduleRender = () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(renderPattern);
    };

    image.onload = scheduleRender;
    if (image.complete) scheduleRender();
    const resizeObserver = new ResizeObserver(scheduleRender);
    resizeObserver.observe(frame);

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      image.onload = null;
      resizeObserver.disconnect();
    };
  }, [imageSrc]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

export default function MyselfTab() {
  const scrollRef = useRef(null);
  const portraitButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isPortraitOpen, setIsPortraitOpen] = useState(false);

  useEffect(() => {
    const handleContentNav = (e) => {
      if (!scrollRef.current) return;
      const { direction } = e.detail;
      if (direction === 'up') {
        scrollRef.current.scrollBy({ top: -50, behavior: 'smooth' });
      } else if (direction === 'down') {
        scrollRef.current.scrollBy({ top: 50, behavior: 'smooth' });
      }
    };
    window.addEventListener('contentNav', handleContentNav);
    return () => window.removeEventListener('contentNav', handleContentNav);
  }, []);

  useEffect(() => {
    if (!isPortraitOpen) return undefined;

    const handleModalKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      event.preventDefault();
      event.stopPropagation();
      setIsPortraitOpen(false);
    };

    // Capture Escape before the console's global B/Escape handler receives it.
    window.addEventListener('keydown', handleModalKeyDown, true);
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      window.removeEventListener('keydown', handleModalKeyDown, true);
      document.body.style.overflow = previousBodyOverflow;
      portraitButtonRef.current?.focus({ preventScroll: true });
    };
  }, [isPortraitOpen]);

  return (
    <div ref={scrollRef} className="w-full h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-4 pt-4 px-3 pb-8">

        {/* Profile Card */}
        <div className="flex gap-4 w-full justify-between">
          {/* Left: Text Info */}
          <div className="flex-1 flex flex-col gap-2.5 font-pixel text-[13px]">
            <div className="flex gap-1">
              <span className="text-slate-500 tracking-wider">NAME:</span>
              <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
                {profileData.name}
              </span>
            </div>
            <div className="w-full h-[1px] bg-slate-700/50"></div>
            <div className="flex gap-1">
              <span className="text-slate-500 tracking-wider">ROLE:</span>
              <span className="text-retro-mint tracking-wider" style={{ textShadow: '0 0 6px rgba(52,211,153,0.4)' }}>
                {profileData.role}
              </span>
            </div>
            <div className="w-full h-[1px] bg-slate-700/50"></div>
            <div className="flex flex-col gap-1.5 mt-1">
              <span className="text-slate-500 tracking-wider">BIO:</span>
              <p className="text-slate-300 font-sans leading-relaxed tracking-wide text-[11px] break-words">
                {profileData.bio}
              </p>
            </div>
          </div>

          {/* Right: Portrait Frame */}
          <div className="shrink-0 flex flex-col items-center gap-2">
            <button
              ref={portraitButtonRef}
              type="button"
              className="group relative rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-neonCyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f19]"
              onClick={() => setIsPortraitOpen(true)}
              aria-label="Open Ayush portrait"
              aria-expanded={isPortraitOpen}
            >
              <div className="relative w-[120px] h-[120px] border-2 border-retro-neonCyan/70 bg-[#0d0f1a] rounded-sm p-1 shadow-[0_0_15px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(34,211,238,0.2)] animate-[pulse_3s_ease-in-out_infinite] transition-transform duration-200 group-hover:scale-[1.03]">
                <div className="w-full h-full bg-[#0f1320] rounded-sm overflow-hidden flex items-center justify-center relative">
                  {/* Pixel art avatar */}
                  <img
                    src={profileData.portrait.src}
                    alt=""
                    className="w-full h-full object-cover object-top scale-125 origin-top -translate-y-4"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  {/* Scanline overlay */}
                  <div className="absolute inset-0 opacity-20" style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
                  }}></div>
                </div>
              </div>
            </button>
            <span className="font-pixel text-[7px] text-slate-600 tracking-[0.3em] uppercase">portrait</span>
          </div>
        </div>

        {/* Simple Divider */}
        <div className="w-full h-[1px] bg-slate-700/50 my-2"></div>

        {/* Contact Links */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2.5 font-sans text-[11px]">
            <a href={profileData.github.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-retro-neonCyan transition-colors flex items-center gap-2">
              <span className="text-retro-neonCyan text-[9px]">►</span> {profileData.github.label}
            </a>
            <span className="text-slate-400 flex items-center gap-2">
              <span className="text-retro-neonCyan text-[9px]">►</span> {profileData.email}
            </span>
          </div>
        </div>

      </div>

      {isPortraitOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#05060d]/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded Ayush portrait"
          onClick={() => setIsPortraitOpen(false)}
        >
          <div
            className="relative h-[min(72dvh,500px)] w-[min(80vw,440px)] bg-gradient-to-br from-[#d3c0ff] via-[#9b84d6] to-[#5e4398] p-[3px] shadow-[5px_5px_0_#090711,0_0_30px_rgba(155,132,214,0.35)]"
            style={{ clipPath: PIXEL_FRAME_CLIP }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative h-full w-full overflow-hidden border border-[#c7b5f2]/25 bg-[#0b0f19]"
              style={{ clipPath: PIXEL_FRAME_CLIP }}
            >
              <img
                src={profileData.portrait.src}
                alt={profileData.portrait.alt}
                className="block h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12),transparent_28%,transparent_72%,rgba(52,211,153,0.08))]" />
              <PortraitBackgroundPattern imageSrc={profileData.portrait.src} />
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsPortraitOpen(false)}
              className="group absolute right-4 top-3 flex h-11 min-w-[50px] items-center justify-center gap-1.5 border-2 border-[#c7b5f2]/80 bg-[#201737]/95 px-2 text-retro-mint shadow-[3px_3px_0_#090711] backdrop-blur-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-retro-mint hover:bg-[#2b2050] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_#090711] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-retro-neonCyan focus-visible:ring-offset-2 focus-visible:ring-offset-[#101623]"
              style={{ clipPath: 'polygon(0 4px, 4px 4px, 4px 0, calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px))' }}
              aria-label="Close expanded portrait"
              title="Back to profile"
            >
              <span className="font-pixel text-[6px] tracking-wider text-[#d8b4fe] transition-colors group-hover:text-retro-mint"></span>
              <span className="flex h-6 w-7 items-center justify-center border border-retro-mint/60 bg-[#0b0f19]/70 transition-colors group-hover:bg-retro-mint/15">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="h-4 w-4">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
