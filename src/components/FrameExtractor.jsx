import React, { useRef, useState } from 'react';

export default function FrameExtractor() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('Ready.');
  const [spriteUrl, setSpriteUrl] = useState(null);
  
  // By default, capture 5.0 to 6.2 (wave) and 2.5 to 3.25 (fold) at 15fps
  const [fps, setFps] = useState(15);
  const [clips, setClips] = useState([
    { start: 5.0, end: 6.2 }, // Adjust this so end frame matches start of next!
    { start: 2.5, end: 3.25 }
  ]);

  const updateClip = (idx, field, val) => {
    const newClips = [...clips];
    newClips[idx][field] = parseFloat(val);
    setClips(newClips);
  };

  const captureFullSequence = async () => {
    const video = videoRef.current;
    if (!video) return;

    setStatus('Capturing frames... (This will take a moment at high FPS)');
    
    const frames = [];
    const interval = 1 / fps;

    for (const clip of clips) {
      for (let t = clip.start; t <= clip.end; t += interval) {
        frames.push(parseFloat(t.toFixed(3)));
      }
    }

    const FRAME_W = 550;
    const FRAME_H = 520;
    const TOTAL_FRAMES = frames.length;

    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = FRAME_W * TOTAL_FRAMES;
    spriteCanvas.height = FRAME_H;
    const spriteCtx = spriteCanvas.getContext('2d', { willReadFrequently: true });
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = FRAME_W;
    tempCanvas.height = FRAME_H;
    const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

    const applyChromaKey = (canvas, ctx) => {
      const w = canvas.width;
      const h = canvas.height;
      const frameData = ctx.getImageData(0, 0, w, h);
      const data = frameData.data;
      const visited = new Uint8Array(w * h);
      const stack = [];
      const isBg = (idx) => {
        const r = data[idx], g = data[idx + 1], b = data[idx + 2];
        return (Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b)) < 35 && ((r + g + b) / 3) > 90;
      };
      
      for (let x = 0; x < w; x++) {
        if (isBg(x * 4)) { stack.push(x); visited[x] = 1; }
        if (isBg(((h - 1) * w + x) * 4)) { stack.push((h - 1) * w + x); visited[(h - 1) * w + x] = 1; }
      }
      for (let y = 0; y < h; y++) {
        if (isBg((y * w) * 4)) { stack.push(y * w); visited[y * w] = 1; }
        if (isBg((y * w + w - 1) * 4)) { stack.push(y * w + w - 1); visited[y * w + w - 1] = 1; }
      }
      while (stack.length > 0) {
        const curr = stack.pop();
        const cx = curr % w;
        const cy = Math.floor(curr / w);
        data[curr * 4 + 3] = 0;
        if (cx > 0)     { const n = curr - 1; if (!visited[n] && isBg(n * 4)) { visited[n] = 1; stack.push(n); } }
        if (cx < w - 1) { const n = curr + 1; if (!visited[n] && isBg(n * 4)) { visited[n] = 1; stack.push(n); } }
        if (cy > 0)     { const n = curr - w; if (!visited[n] && isBg(n * 4)) { visited[n] = 1; stack.push(n); } }
        if (cy < h - 1) { const n = curr + w; if (!visited[n] && isBg(n * 4)) { visited[n] = 1; stack.push(n); } }
      }
      
      const alphaBuffer = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) alphaBuffer[i] = data[i * 4 + 3];
      for (let y = 2; y < h - 2; y++) {
        for (let x = 2; x < w - 2; x++) {
          const a = alphaBuffer[y * w + x];
          if (a > 0) {
            let n = 0;
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++)
                if (!(dx === 0 && dy === 0) && alphaBuffer[(y + dy) * w + (x + dx)] === 0) n++;
            const idx = (y * w + x) * 4;
            if (n >= 4) data[idx + 3] = 0;
            else if (n > 0) data[idx + 3] = Math.round(a * (1 - (n / 8) * 0.8));
          }
        }
      }
      ctx.putImageData(frameData, 0, 0);
    };

    for (let i = 0; i < frames.length; i++) {
      const time = frames[i];
      setStatus(`Extracting ${time}s... (Frame ${i + 1} of ${frames.length})`);
      video.currentTime = time;
      await new Promise(r => { video.onseeked = r; });
      
      tempCtx.drawImage(video, 0, 0, FRAME_W, FRAME_H);
      applyChromaKey(tempCanvas, tempCtx);
      spriteCtx.drawImage(tempCanvas, i * FRAME_W, 0, FRAME_W, FRAME_H);
      
      await new Promise(r => setTimeout(r, 40)); 
    }

    setStatus(`✅ Done! ${TOTAL_FRAMES} frames extracted. Click image to download.`);
    
    // Store metadata globally so the agent can read it later
    window.generatedSpriteData = { totalFrames: TOTAL_FRAMES, fps };
    console.log(window.generatedSpriteData);

    setSpriteUrl(spriteCanvas.toDataURL('image/png'));
  };

  const previewFrame = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0a0a0a', zIndex: 9999, color: '#34d399', overflowY: 'auto', padding: 40, fontFamily: 'sans-serif' }}>
      <h2>🎬 Advanced Sequence Builder</h2>
      <p style={{ color: '#fff' }}>Match the end of Clip 1 with the start of Clip 2 to prevent visual cuts!</p>
      
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        {clips.map((clip, idx) => (
          <div key={idx} style={{ background: '#111', padding: 20, borderRadius: 8, border: '1px solid #333' }}>
            <h3>Clip {idx + 1}</h3>
            <label>Start (s): <input type="number" step="0.1" value={clip.start} onChange={e => updateClip(idx, 'start', e.target.value)} /></label>
            <button onClick={() => previewFrame(clip.start)} style={{ marginLeft: 10 }}>Preview</button>
            <br/><br/>
            <label>End (s): <input type="number" step="0.1" value={clip.end} onChange={e => updateClip(idx, 'end', e.target.value)} /></label>
            <button onClick={() => previewFrame(clip.end)} style={{ marginLeft: 10 }}>Preview</button>
          </div>
        ))}
        
        <div style={{ background: '#111', padding: 20, borderRadius: 8, border: '1px solid #333' }}>
          <h3>Settings</h3>
          <label>Frames per second (FPS): <input type="number" value={fps} onChange={e => setFps(Number(e.target.value))} style={{ width: 60 }} /></label>
          <p style={{ fontSize: 12, color: '#888', marginTop: 10 }}>Higher FPS = smoother, but larger file.</p>
        </div>
      </div>

      <div style={{ border: '1px dashed #333', display: 'inline-block', marginBottom: 20 }}>
        <video ref={videoRef} src="/transparent.mp4" muted playsInline controls style={{ width: 400 }} />
      </div>
      <br/>
      
      <button onClick={captureFullSequence} style={{ padding: '12px 24px', background: '#22d3ee', color: '#000', cursor: 'pointer', marginBottom: 20, fontSize: 16, fontWeight: 'bold' }}>
        Generate Super-Smooth Sprite Sheet
      </button>
      
      <p style={{ fontSize: 20, fontWeight: 'bold' }}>{status}</p>
      
      {spriteUrl && (
        <div style={{ marginTop: 20 }}>
          <p style={{ color: '#fbbf24' }}>Download this image and save it as <b>public/character/smooth-sequence.png</b></p>
          <a href={spriteUrl} download="smooth-sequence.png">
            <img src={spriteUrl} style={{ width: '100%', border: '2px solid #333', background: '#222' }} />
          </a>
        </div>
      )}
    </div>
  );
}
