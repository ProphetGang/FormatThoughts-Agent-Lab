import { useState } from 'react'
import { Typewriter } from './Typewriter'

const baseDraft = {
  author: 'You',
  title: '',
  body: '',
  tags: '#formatthoughts #draft',
}

export function Composer({ onPublish }) {
  const [isFinished, setIsFinished] = useState(false)
  const [draft, setDraft] = useState(baseDraft)

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!draft.title.trim() || !draft.body.trim()) return

    onPublish(draft)
    setDraft(baseDraft)
  }

  return (
    <form className={`composer shell-card ${isFinished ? 'is-finished' : 'is-typing'}`} onSubmit={submit}>
      <div className="composer-headline">
        <div>
          <p className="eyebrow">
            <Typewriter text="Compose" speed={8} />
          </p>
          <h3>
            <Typewriter text="Publish a thought" speed={5} onComplete={() => setIsFinished(true)} />
          </h3>
        </div>
        <button className="publish-button" type="submit" style={{ opacity: isFinished ? 1 : 0 }}>
          Publish
        </button>
      </div>

      <div className="composer-grid" style={{ opacity: isFinished ? 1 : 0 }}>
        <input
          value={draft.author}
          onChange={(event) => update('author', event.target.value)}
          placeholder="Display name"
          aria-label="Display name"
        />
      </div>

      <input
        style={{ opacity: isFinished ? 1 : 0 }}
        value={draft.title}
        onChange={(event) => update('title', event.target.value)}
        placeholder="Headline"
        aria-label="Headline"
      />

      <textarea
        style={{ opacity: isFinished ? 1 : 0 }}
        value={draft.body}
        onChange={(event) => update('body', event.target.value)}
        placeholder="Write what is on your mind..."
        aria-label="Post body"
        rows={4}
      />

      <input
        style={{ opacity: isFinished ? 1 : 0 }}
        value={draft.tags}
        onChange={(event) => update('tags', event.target.value)}
        placeholder="#tags"
        aria-label="Tags"
      />
    </form>
  )
}
