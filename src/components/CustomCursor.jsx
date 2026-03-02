import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)

      const target = e.target
      const interactiveSelector = 'button, a, input, textarea, [onClick], .post-card.is-finished:not(.is-expanded), .social-link, .back-to-blog, .view-post-button, .play-toggle-icon'
      
      const isInteractive = target.closest(interactiveSelector)
      setIsHovering(!!isInteractive)
    }

    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <div 
      className={`custom-cursor-container ${isHovering ? 'is-hovering' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <img 
        src={isHovering ? '/assets/icons/mouse_hover.png' : '/assets/icons/mouse_default.png'} 
        alt="cursor"
        className="cursor-img"
      />
    </div>
  )
}
