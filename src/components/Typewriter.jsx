import { useState, useEffect } from 'react'

export function Typewriter({ text, speed = 5, onComplete, className = '', style = {} }) {
  const [displayedText, setDisplayedText] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index])
        setIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [index, text, speed, onComplete])

  return <span className={className} style={style}>{displayedText}</span>
}
