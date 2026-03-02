import { useState, useEffect } from 'react'
import { Typewriter } from './Typewriter'

export function SocialsBox({ onFinish, isGlobalFinished }) {
  const [isLabelFinished, setIsLabelFinished] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (isFinished && onFinish) {
      onFinish('socials')
    }
  }, [isFinished, onFinish])

  return (
    <section className={`socials-box shell-card ${isGlobalFinished ? 'is-finished' : 'is-typing'}`}>
      <div className="socials-headline">
        <p className="eyebrow" style={{ color: '#fff' }}>
          <Typewriter text="SOCIALS" speed={8} onComplete={() => setIsLabelFinished(true)} />
        </p>
        <h3>
          {isLabelFinished && (
            <Typewriter text="connect with me" speed={5} onComplete={() => setIsFinished(true)} />
          )}
        </h3>
      </div>
      
      <div className="socials-links" style={{ opacity: isGlobalFinished ? 1 : 0 }}>
        <a 
          href="https://www.youtube.com/@format_life" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link yt"
        >
          <img src="/assets/icons/youtube_icon.png" alt="" className="social-icon-img" />
          <span className="social-text">format_life</span>
        </a>
        
        <a 
          href="https://www.linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=simon-d-900128391" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link li"
        >
          <img src="/assets/icons/linkedin_icon.png" alt="" className="social-icon-img" />
          <span className="social-text">simon_defrisco</span>
        </a>

        <a 
          href="https://github.com/prophetgang" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link gh"
        >
          <img src="/assets/icons/github_icon_bg.png" alt="" className="social-icon-img" />
          <span className="social-text">format_time</span>
        </a>
      </div>
    </section>
  )
}
