import { useState, useEffect } from 'react'
import { Typewriter } from './Typewriter'

export function PostCard({ post, isActive, onClick, isMirror, onFinish, isGlobalFinished }) {
  const [isTitleFinished, setIsTitleFinished] = useState(false)
  const [isIntroFinished, setIsIntroFinished] = useState(false)
  const [activeParaIndex, setActiveParaIndex] = useState(-1)
  
  const isExpanded = !!onClick === false && post.fullContent;

  useEffect(() => {
    if (isIntroFinished && isExpanded) {
      setActiveParaIndex(0)
    } else if (isIntroFinished && !isExpanded && onFinish) {
      onFinish(post.id)
    }
  }, [isIntroFinished, isExpanded, onFinish, post.id])

  const handleParaComplete = (idx) => {
    if (idx < post.fullContent.length - 1) {
      setActiveParaIndex(idx + 1)
    } else if (onFinish) {
      onFinish(post.id)
    }
  }

  const renderParaText = (text, idx) => {
    let content = text;
    let isHeader = false;

    if (content.startsWith('△')) {
      content = content.slice(1).trim();
      isHeader = true;
    }

    const colorMap = {
      'A': '#FF0000', // Red
      'B': '#FF8C00', // Orange
      'C': '#FFFF00', // Yellow
      'D': '#32CD32', // Lime Green
      'E': '#1E90FF', // Dodger Blue
      'F': '#FF00FF'  // Magenta
    };

    const parts = content.split(/(<[A-F]>.*?<\/[A-F]>|<SPECIAL>.*?<\/SPECIAL>)/g);
    
    return (
      <div key={idx} className={isHeader ? 'body-triangle-header' : 'post-para'}>
        {isHeader && (
          <span className="header-triangle" style={{ color: '#fff', marginRight: '8px' }}>△</span>
        )}
        {parts.map((part, pIdx) => {
          if (part.startsWith('<SPECIAL>')) {
            const specialText = part.replace('<SPECIAL>', '').replace('</SPECIAL>', '');
            return (
              <Typewriter 
                key={pIdx}
                text={specialText} 
                speed={2} 
                className="special-body-text"
                onComplete={() => pIdx === parts.length - 1 && handleParaComplete(idx)}
              />
            );
          }
          
          const tagMatch = part.match(/^<([A-F])>(.*?)<\/\1>$/);
          if (tagMatch) {
            const [_, letter, text] = tagMatch;
            return (
              <Typewriter 
                key={pIdx}
                text={text} 
                speed={1} 
                style={{ color: colorMap[letter], fontWeight: 'bold' }}
                onComplete={() => pIdx === parts.length - 1 && handleParaComplete(idx)}
              />
            );
          }

          return (
            <Typewriter 
              key={pIdx}
              text={part} 
              speed={1} 
              onComplete={() => pIdx === parts.length - 1 && handleParaComplete(idx)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <article
      className={`post-card shell-card ${isActive ? 'is-active' : ''} ${isGlobalFinished ? 'is-finished' : 'is-typing'} ${isExpanded ? 'is-expanded' : ''}`}
      data-scroll-section={isMirror ? undefined : post.id}
      id={isMirror ? undefined : post.id}
      onClick={isExpanded ? undefined : onClick}
    >
      <div className="post-topline">
        <div>
          <h3>
            {post.title.startsWith('△') ? (
              <>
                <span className="title-triangle" style={{ color: '#fff', marginRight: '8px' }}>△</span>
                <Typewriter text={post.title.slice(2)} speed={5} onComplete={() => setIsTitleFinished(true)} />
              </>
            ) : (
              <Typewriter text={post.title} speed={5} onComplete={() => setIsTitleFinished(true)} />
            )}
          </h3>
        </div>
        <span className="timestamp" style={{ opacity: isGlobalFinished ? 1 : 0 }}>{post.postedAt}</span>
      </div>

      <div className="author-row" style={{ opacity: isGlobalFinished ? 1 : 0 }}>
        <strong>{post.author}</strong>
      </div>

      <p className="post-body">
        {isTitleFinished && (
          <Typewriter text={post.body} speed={2} onComplete={() => setIsIntroFinished(true)} />
        )}
      </p>

      {isExpanded && (
        <div className="post-full-content">
          {post.fullContent.map((para, idx) => (
            <div key={idx} className="post-para">
              {activeParaIndex >= idx && renderParaText(para, idx)}
            </div>
          ))}
        </div>
      )}

      <div className="tag-row" style={{ opacity: isGlobalFinished ? 1 : 0 }}>
        {post.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    </article>
  )
}
