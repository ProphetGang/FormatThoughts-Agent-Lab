import { useMemo, useState, useEffect, useRef } from 'react'
import { animationSlot, getFramePath } from '../config/assetSlots'

const FRAME_DELAY = 50 // 20 FPS

export function useAutoFrame() {
  const [frame, setFrame] = useState(1)
  const total = animationSlot.totalFrames
  const imagesRef = useRef([])

  useEffect(() => {
    // Preload ALL frames and store them as objects
    for (let i = 1; i <= total; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      imagesRef.current[i] = img;
    }

    // Start a small delay to let the browser initiate the first few requests
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setFrame((prev) => (prev >= total ? total : prev + 1))
      }, FRAME_DELAY)
      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [total])

  return useMemo(() => ({
    totalFrames: total,
    frame,
    framePath: getFramePath(frame),
    frameImage: imagesRef.current[frame],
    completion: Math.round((frame / total) * 100),
    isFinished: frame === total
  }), [frame, total])
}

export function useFrameAnimation(scrollProgress) {
  return useMemo(() => {
    const total = animationSlot.totalFrames
    const frame = Math.min(total, Math.max(1, Math.round(scrollProgress * (total - 1)) + 1))

    return {
      totalFrames: total,
      frame,
      framePath: getFramePath(frame),
      completion: Math.round((frame / total) * 100),
    }
  }, [scrollProgress])
}
