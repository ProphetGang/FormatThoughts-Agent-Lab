export function ProgressRail({ posts, activeId, scrollProgress }) {
  return (
    <div className="progress-rail shell-card" aria-label="Scroll progress rail">
      <div className="progress-track">
        <div className="progress-fill" style={{ height: `${Math.max(6, scrollProgress * 100)}%` }} />
      </div>

      <div className="progress-points">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`#${post.id}`}
            className={`progress-point ${activeId === post.id ? 'is-active' : ''}`}
            aria-label={`Jump to ${post.title}`}
            title={post.title}
          />
        ))}
      </div>
    </div>
  )
}
