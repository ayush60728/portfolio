import { useEffect } from 'react';

export const useGameInput = (onInput) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrows and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          onInput('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          onInput('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          onInput('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          onInput('RIGHT');
          break;
        case 'Enter':
        case ' ':
        case 'z':
        case 'Z':
          onInput('A');
          break;
        case 'Escape':
        case 'Backspace':
        case 'x':
        case 'X':
          onInput('B');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput]);
};
