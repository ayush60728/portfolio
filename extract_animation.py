import cv2
import numpy as np
import imageio
import sys

def extract():
    print("Opening intro.mp4...")
    cap = cv2.VideoCapture('intro.mp4')
    if not cap.isOpened():
        print("Error: Could not open intro.mp4")
        sys.exit(1)
        
    fps = cap.get(cv2.CAP_PROP_FPS)
    if not fps or fps < 1:
        fps = 30
        
    frames = []
    count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
            
        # Resize frame slightly to make processing and GIF saving faster/smaller
        # The original video is probably 1080p or 720p. Let's scale to width 800.
        h, w = frame.shape[:2]
        new_w = 600
        new_h = int((new_w / w) * h)
        frame = cv2.resize(frame, (new_w, new_h))
        
        # Convert BGR to RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        R = rgb_frame[:, :, 0]
        G = rgb_frame[:, :, 1]
        B = rgb_frame[:, :, 2]
        
        # Mask for bright green.
        # The green text looks like a neon green, e.g., (100, 255, 100) or similar.
        # Let's say G must be relatively high, and significantly higher than R and B.
        mask = (G > 60) & (G.astype(int) - R.astype(int) > 30) & (G.astype(int) - B.astype(int) > 30)
        
        rgba = np.zeros((new_h, new_w, 4), dtype=np.uint8)
        rgba[mask, 0] = R[mask]
        rgba[mask, 1] = G[mask]
        rgba[mask, 2] = B[mask]
        rgba[mask, 3] = 255
        
        # Optionally, crop the frame to the central screen area to completely discard UI borders.
        # But if the mask is perfect, it will only capture the green dots anyway.
        
        frames.append(rgba)
        count += 1
        if count % 30 == 0:
            print(f"Processed {count} frames...")

    cap.release()
    print(f"Total frames processed: {len(frames)}")
    print("Saving transparent_intro.gif (this might take a moment)...")
    
    # Save as GIF with transparency
    # duration is in milliseconds per frame (1000/fps)
    imageio.mimsave('transparent_intro.gif', frames, format='GIF', fps=fps, loop=0)
    print("Done! Saved as transparent_intro.gif")

if __name__ == '__main__':
    extract()
