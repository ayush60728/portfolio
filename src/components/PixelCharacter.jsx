import React, { useEffect, useState, useRef } from 'react';
import './PixelCharacter.css';

/**
 * Multiple sprite sheets:
 * character-sprite.png: 5 frames (0=idle, 1=idle_2, 2=raise, 3=thumbsUp, 4=wink)
 * wave-sequence.png: 16 frames (waving & folding arms)
 */

const ANIM_TIMELINE = {
  off: { 
    src: 'character-sprite.png', 
    totalFrames: 5, 
    sequence: [0], 
    fps: 1, 
    next: null 
  },
  wavingSequence: { 
    src: 'full-sequence.png', 
    totalFrames: 24, 
    // Waving (0-15) then folding arms (16-23)
    sequence: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 
    fps: 8, 
    next: 'idleLoop' 
  },
  idleLoop: { 
    src: 'full-sequence.png', 
    totalFrames: 24, 
    // Loop the last two frames for a subtle breathing effect while arms are crossed
    sequence: [22, 23], 
    fps: 2, 
    next: 'idleLoop' 
  },
  armsCrossedTrans: { 
    src: 'full-sequence.png', 
    totalFrames: 24, 
    // Play the folding arms transition
    sequence: [16,17,18,19,20,21,22,23], 
    fps: 8, 
    next: 'idleLoop' 
  },
};

export default function PixelCharacter({ isOn }) {
  const [currentAnim, setCurrentAnim] = useState('off');
  const [frameIdx, setFrameIdx] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const timerRef = useRef(null);

  // ── Listen for START button ──────────────────────────────────────────────
  // (Removed to prevent frame cuts)
  useEffect(() => {
    // START button no longer interrupts the character animation.
  }, [isOn]);

  // ── Sync with power switch ───────────────────────────────────────────────
  useEffect(() => {
    if (isOn) switchAnim('wavingSequence');
    else switchAnim('off');
  }, [isOn]);

  // ── Animation engine ─────────────────────────────────────────────────────
  function switchAnim(name) {
    clearInterval(timerRef.current);
    setCurrentAnim(name);
    setFrameIdx(0);
    setShowSparkles(false);

    const config = ANIM_TIMELINE[name];
    if (!config || config.sequence.length <= 1) return;

    let idx = 0;
    const ms = 1000 / config.fps;
    timerRef.current = setInterval(() => {
      idx++;
      if (idx >= config.sequence.length) {
        if (config.next && config.next !== name) {
          clearInterval(timerRef.current);
          switchAnim(config.next);
          return;
        }
        idx = 0; // loop
      }
      setFrameIdx(idx);
    }, ms);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const config = ANIM_TIMELINE[currentAnim] || ANIM_TIMELINE.off;
  const currentFramePos = config.sequence[frameIdx] ?? config.sequence[0];

  return (
    <div
      className={`pixel-character-container anim-${currentAnim} ${isOn ? 'is-on' : ''}`}
      aria-hidden="true"
    >
      {/* Pixel sparkles — shown during thumbs-up */}
      <div className={`sparkles ${showSparkles ? 'sparkles-active' : ''}`}>
        <span className="sparkle sparkle-1"></span>
        <span className="sparkle sparkle-2"></span>
        <span className="sparkle sparkle-3"></span>
        <span className="sparkle sparkle-4"></span>
        <span className="sparkle sparkle-5"></span>
      </div>

      {/* The dynamic character sprite */}
      <div
        className="character-sprite"
        style={{
          backgroundImage: `url('/character/${config.src}')`,
          backgroundSize: `${config.totalFrames * 550}px 520px`,
          backgroundPositionX: `${-(currentFramePos * 550)}px`,
        }}
      />
    </div>
  );
}
