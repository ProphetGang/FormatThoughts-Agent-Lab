import { useState, useEffect, useRef } from 'react'
import { Typewriter } from './Typewriter'

const SPRITE_WIDTH = 253;
const SPRITE_HEIGHT = 252;
const SCREEN_BOUNDS = { x: 98.67, y: 113, width: 55.6666, height: 30.6666 };
const SCREEN_CONTENT_SCALE = 1.15; // Scale up only the screen area by 15% (original + 5%)

// Adjustment offsets to fix alignment with the PNG image
const ADJUST_X = -45; 
const ADJUST_Y = 25;

export function MiniScreenLayer({ activePost, frameInfo, isPopping, children }) {
  const [viewportSize, setViewportSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef(null);
  const canvasRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  // Dynamic Scale Factor based on screen width
  const SCALE_FACTOR = viewportSize.width < 768 
    ? (viewportSize.width - 40) / SPRITE_WIDTH 
    : 3.0;

  // Render frame to canvas for high-performance sequence playback on mobile
  useEffect(() => {
    if (frameInfo.frameImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = frameInfo.frameImage;

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      if (img.complete) {
        draw();
      } else {
        img.onload = draw;
      }
    }
  }, [frameInfo.frameImage]);

  useEffect(() => {
    let requestRef;
    
    const updateMetrics = () => {
      const scrollX = window.pageXOffset || window.scrollX || document.documentElement.scrollLeft || 0;
      const scrollY = window.pageYOffset || window.scrollY || document.documentElement.scrollTop || 0;
      
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
      setScrollPos({ x: scrollX, y: scrollY });

      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(requestRef);
      requestRef = requestAnimationFrame(updateMetrics);
    };

    const handleResize = () => {
      updateMetrics();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial update
    updateMetrics();

    // Check height periodically for late-loading items
    const interval = setInterval(updateMetrics, 2000);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef);
      clearInterval(interval);
    };
  }, []);
  
  // Offset from sprite center to screen center (unscaled):
  const offsetX = (SCREEN_BOUNDS.x + SCREEN_BOUNDS.width / 2) - SPRITE_WIDTH / 2;
  const offsetY = (SCREEN_BOUNDS.y + SCREEN_BOUNDS.height / 2) - SPRITE_HEIGHT / 2;
  
  // Offset at scale:
  const scaledOffsetX = (offsetX * SCALE_FACTOR) + (ADJUST_X * (SCALE_FACTOR / 3.0));
  const scaledOffsetY = (offsetY * SCALE_FACTOR) + (ADJUST_Y * (SCALE_FACTOR / 3.0));

  const screenWidth = SCREEN_BOUNDS.width * SCALE_FACTOR * SCREEN_CONTENT_SCALE;
  const screenHeight = SCREEN_BOUNDS.height * SCALE_FACTOR * SCREEN_CONTENT_SCALE;
  
  // Scale based on width to ensure content wrapping matches perfectly
  const minScale = screenWidth / viewportSize.width;

  // Calculate the mapped scroll position to ensure sync from top to bottom
  const mainMaxScroll = Math.max(1, document.documentElement.scrollHeight - viewportSize.height);
  const mirrorMaxScroll = Math.max(0, contentHeight * minScale - screenHeight);
  const scrollProgress = scrollPos.y / mainMaxScroll;
  const mappedMirrorY = scrollProgress * mirrorMaxScroll;

  return (
    <aside 
      className="mini-screen-container" 
      aria-label="Retro mini screen"
      style={{
        '--screen-width': `${screenWidth}px`,
        '--screen-height': `${screenHeight}px`,
      }}
    >
      <div 
        className="mini-screen-sprite"
        style={{
          width: SPRITE_WIDTH * SCALE_FACTOR,
          height: SPRITE_HEIGHT * SCALE_FACTOR,
        }}
      >
        <canvas
          ref={canvasRef}
          width={SPRITE_WIDTH}
          height={SPRITE_HEIGHT}
          className="sprite-img"
        />
        
        <div 
          className="mini-screen-content"
          style={{
            left: `calc(50% + ${scaledOffsetX}px)`,
            top: `calc(50% + ${scaledOffsetY}px)`,
            width: screenWidth,
            height: screenHeight,
            /* Ensure children (the mirror) are contained and start from the same Y as the sprite */
            overflow: 'hidden'
          }}
        >
          {!frameInfo.isFinished ? (
            <div className="mini-loader">
              <span className="mini-percent">{frameInfo.completion}%</span>
              <div className="mini-progress-bar">
                <div 
                  className="mini-progress-fill" 
                  style={{ width: `${frameInfo.completion}%` }} 
                />
              </div>
            </div>
          ) : (
            <div className="mini-screen-mirror">
               <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: `${viewportSize.width}px`,
                  /* Scale then translate based on mapped range for perfect top-to-bottom sync */
                  transform: `scale(${minScale}) translate3d(0, ${-mappedMirrorY / minScale}px, 0)`,
                  transformOrigin: '0 0',
                  pointerEvents: 'none',
                  willChange: 'transform'
               }}>
                  <div ref={contentRef} className="page-layout" style={{ 
                    opacity: 1, 
                    paddingBottom: 0, 
                    paddingTop: 'calc(env(safe-area-inset-top) + var(--fluid-padding))',
                    marginTop: 0 
                  }}>
                    {children}
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
