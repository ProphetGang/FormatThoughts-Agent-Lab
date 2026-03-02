import { useEffect, useState } from 'react'
import { backgroundSlot } from '../config/assetSlots'
import { Typewriter } from './Typewriter'

function useImageProbe(src) {
  const [isAvailable, setIsAvailable] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!src) {
      setIsAvailable(false)
      return undefined
    }

    const img = new Image()
    img.onload = () => {
      if (!cancelled) setIsAvailable(true)
    }
    img.onerror = () => {
      if (!cancelled) setIsAvailable(false)
    }
    img.src = src

    return () => {
      cancelled = true
    }
  }, [src])

  return isAvailable
}

export function HeroStage({ frameInfo, activePost, isMirror, onFinish, isGlobalFinished }) {
  const [isEyebrowFinished, setIsEyebrowFinished] = useState(false)
  const [isTitleFinished, setIsTitleFinished] = useState(false)
  const [isCopyFinished, setIsCopyFinished] = useState(false)
  const frameReady = useImageProbe(frameInfo.framePath)
  const bgReady = useImageProbe(backgroundSlot.primary)

  useEffect(() => {
    if (isCopyFinished && onFinish) {
      onFinish('hero')
    }
  }, [isCopyFinished, onFinish])

  const bodyText = "this blog is where I'll post progress reports, break down logic, and share critical insight as I develop the worlds first Observer-Based Semantic Reality Platform."

  return (
    <section 
      className={`hero shell-card ${isGlobalFinished ? 'is-finished' : 'is-typing'}`} 
      data-scroll-section={isMirror ? undefined : "hero"}
    >
      {!isMirror && <div className="hero-backdrop" />}

      <div className="hero-copy">
        <p className="eyebrow first-post-eyebrow">
          <Typewriter text="format_thoughts" speed={8} onComplete={() => setIsEyebrowFinished(true)} />
        </p>
        <h2>
          {isEyebrowFinished && (
            <Typewriter 
              text="my journey Recorded" 
              speed={3} 
              onComplete={() => setIsTitleFinished(true)}
            />
          )}
        </h2>
        <p className="hero-body">
          {isTitleFinished && (
            <Typewriter 
              text={bodyText} 
              speed={2} 
              onComplete={() => setIsCopyFinished(true)} 
            />
          )}
        </p>
      </div>
    </section>
  )
}
