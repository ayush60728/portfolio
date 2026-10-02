import React, { useRef, useEffect, useState } from 'react';

const ANIMATIONS = {
  waving: { start: 5.0, end: 6.9, next: 'armsCrossed' }, // Waving segment
  armsCrossed: { start: 3.0, end: 4.9, next: 'armsCrossed' }, // Arms crossed (loops)
  idle: { start: 0.0, end: 0.5, next: 'idle' },
};

export default function SpriteVideo({ isOn }) {
  const videoRef = useRef(null);
  const [currentAnim, setCurrentAnim] = useState('idle');

  useEffect(() => {
    if (isOn) {
      setCurrentAnim('waving');
    } else {
      setCurrentAnim('idle');
    }
  }, [isOn]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || currentAnim === 'idle') {
      if (video) {
        video.pause();
        video.style.display = 'none'; // hide when off
      }
      return;
    }

    video.style.display = 'block';
    const anim = ANIMATIONS[currentAnim];
    video.currentTime = anim.start;
    video.play();

    const handleTimeUpdate = () => {
      if (video.currentTime >= anim.end) {
        if (anim.next === currentAnim) {
          // loop
          video.currentTime = anim.start;
        } else {
          // transition to next animation
          setCurrentAnim(anim.next);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [currentAnim]);

  // Position it to the right of the console shell
  return (
    <div 
      className={`hidden 2xl:block absolute transition-all duration-1000 ease-out transform pointer-events-none z-0 ${
        isOn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
      style={{ 
        right: '4%', // Float on the right side of the screen
        bottom: '15%',
        width: '320px',
        height: '420px',
        mixBlendMode: 'multiply' // Helps hide the white parts of the checkerboard
      }}
    >
      <video 
        ref={videoRef}
        src="/transparent.mp4" 
        muted 
        playsInline 
        className="w-full h-full object-contain filter drop-shadow-2xl"
      />
    </div>
  );
}
