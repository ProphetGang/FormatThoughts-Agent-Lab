import { useMemo, useState, useEffect, useCallback } from 'react'
import { starterPosts } from './data/posts'
import { useScrollSync } from './hooks/useScrollSync'
import { useAutoFrame } from './hooks/useFrameAnimation'
import { useIsMobile } from './hooks/useMobile'
import { Header } from './components/Header'
import { SocialsBox } from './components/SocialsBox'
import { PostCard } from './components/PostCard'
import { MiniScreenLayer } from './components/MiniScreenLayer'
import { MusicPlayer } from './components/MusicPlayer'
import { CustomCursor } from './components/CustomCursor'

function buildDraftPost(draft) {
  const cleanTags = draft.tags
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean)

  return {
    id: `thought-${Math.random().toString(36).slice(2, 9)}`,
    author: draft.author || 'You',
    postedAt: 'Just now',
    title: draft.title,
    body: draft.body,
    tags: cleanTags.length ? cleanTags : ['#formatthoughts'],
  }
}

export default function App() {
  const isMobile = useIsMobile(768)
  const [posts, setPosts] = useState(starterPosts)
  const [selectedPost, setSelectedPost] = useState(null)
  const { activeSectionId } = useScrollSync('hero')
  const frameInfo = useAutoFrame()
  const [showContent, setShowContent] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [finishedComponents, setFinishedComponents] = useState(new Set())
  const [isGlobalFinished, setIsGlobalFinished] = useState(false)

  useEffect(() => {
    setFinishedComponents(new Set())
    setIsGlobalFinished(false)
  }, [selectedPost])

  const requiredComponents = useMemo(() => {
    if (selectedPost) return [selectedPost.id]
    return ['socials', ...posts.map((p) => p.id)]
  }, [selectedPost, posts])

  useEffect(() => {
    if (requiredComponents.every((id) => finishedComponents.has(id))) {
      setIsGlobalFinished(true)
    }
  }, [finishedComponents, requiredComponents])

  const handleComponentFinish = useCallback((id) => {
    setFinishedComponents((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  const handleHome = useCallback(() => {
    setSelectedPost(null)
  }, [])

  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    let timer
    const onScroll = () => {
      setIsScrolling(true)
      clearTimeout(timer)
      timer = setTimeout(() => setIsScrolling(false), 800)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (frameInfo.isFinished) {
      setShowContent(true)
    }
  }, [frameInfo.isFinished])

  const activePost = useMemo(() => {
    if (selectedPost) return selectedPost
    return posts.find((post) => post.id === activeSectionId) || posts[0]
  }, [posts, activeSectionId, selectedPost])

  function handlePublish(draft) {
    setPosts((current) => [buildDraftPost(draft), ...current])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function renderContent(isMirror = false) {
    return (
      <>
        <Header 
          onHome={handleHome} 
          isMirror={isMirror} 
          showLogo={showContent} 
        />
        <MusicPlayer 
          isGlobalFinished={isGlobalFinished} 
          frameInfo={frameInfo}
          isMirror={isMirror}
        />
        <div className="main-grid">
          {!selectedPost && (
            <>
              <SocialsBox 
                isMirror={isMirror} 
                onFinish={isMirror ? undefined : handleComponentFinish}
                isGlobalFinished={isGlobalFinished}
              />
            </>
          )}
          <section 
            className="feed-column" 
            aria-label="Thought feed"
            style={{ gridColumn: selectedPost ? '1 / -1' : undefined }}
          >
            {selectedPost ? (
              <>
                {!isMirror && (
                  <button 
                    className="back-to-blog"
                    onClick={handleHome}
                  >
                    <span>←</span> BACK TO BLOG
                  </button>
                )}
                <PostCard 
                  key={`${selectedPost.id}-focused`} 
                  post={selectedPost} 
                  isActive={true} 
                  isMirror={isMirror}
                  onFinish={isMirror ? undefined : handleComponentFinish}
                  isGlobalFinished={isGlobalFinished}
                />
              </>
            ) : (
              posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  isActive={post.id === activeSectionId} 
                  isMirror={isMirror}
                  onFinish={isMirror ? undefined : handleComponentFinish}
                  isGlobalFinished={isGlobalFinished}
                  onClick={isMirror ? undefined : () => handleSelectPost(post)}
                />
              ))
            )}
          </section>
        </div>
      </>
    )
  }

  return (
    <div className={`app-shell ${isScrolling ? 'is-scrolling' : ''} ${isMobile ? 'is-mobile' : ''}`}>
      <div className="page-backdrop" />
      <main className="page-layout" style={{ opacity: showContent ? 1 : 0 }}>
        {showContent && renderContent(false)}
      </main>

      <MiniScreenLayer 
        activePost={activePost} 
        frameInfo={frameInfo}
      >
        {renderContent(true)}
      </MiniScreenLayer>

      {!isMobile && <CustomCursor />}
    </div>
  )
}
