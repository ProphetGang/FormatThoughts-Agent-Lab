import { useState, useEffect, useRef, useCallback } from 'react'

const LOADING_SOUND = '/assets/sounds/loading_sound.wav'
const MUSIC_TRACK = '/assets/sounds/Crystaline_Fractals_in_Time.mp3'

export function MusicPlayer({ isGlobalFinished, frameInfo, isMirror }) {
  // Default to off on mobile/touch devices, on for desktop
  const [isPlaying, setIsPlaying] = useState(() => {
    if (typeof window === 'undefined') return true
    return !window.matchMedia('(hover: none) and (pointer: coarse)').matches
  })
  const [volume, setVolume] = useState(0.33)
  const [hasStartedBoot, setHasStartedBoot] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  
  const bootAudioRef = useRef(null)
  const musicAudioRef = useRef(null)
  const volumeTimeoutRef = useRef(null)

  const resetVolumeTimer = useCallback(() => {
    if (volumeTimeoutRef.current) {
      clearTimeout(volumeTimeoutRef.current)
    }
    setShowVolume(true)
    volumeTimeoutRef.current = setTimeout(() => {
      setShowVolume(false)
    }, 2000)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current)
      }
    }
  }, [])

  const handleVolumeChange = (e) => {
    if (isMirror) return
    const val = parseFloat(e.target.value)
    setVolume(val)
    resetVolumeTimer()
  }

  const togglePlay = useCallback(() => {
    if (isMirror) return
    setIsPlaying(prev => !prev)
    resetVolumeTimer()
  }, [resetVolumeTimer, isMirror])

  // Initialize audio objects
  if (!isMirror && !bootAudioRef.current) {
    bootAudioRef.current = new Audio(LOADING_SOUND)
    bootAudioRef.current.loop = false
    bootAudioRef.current.volume = 0.33
  }
  if (!isMirror && !musicAudioRef.current) {
    musicAudioRef.current = new Audio(MUSIC_TRACK)
    musicAudioRef.current.loop = true
    musicAudioRef.current.volume = 0.33
  }

  // Handle global play/pause toggle
  useEffect(() => {
    if (isMirror) return
    const boot = bootAudioRef.current
    const music = musicAudioRef.current
    
    if (!isPlaying) {
      boot?.pause()
      music?.pause()
    } else {
      // Re-trigger playback if supposed to be playing
      if (frameInfo && !frameInfo.isFinished) {
        boot?.play().catch(() => {})
      } else if (musicStarted) {
        music?.play().catch(() => {})
      }
    }
  }, [isPlaying, frameInfo.isFinished, musicStarted, isMirror])

  // Sync loading sound with frameInfo completion
  useEffect(() => {
    if (isMirror) return
    const boot = bootAudioRef.current
    if (!boot || !frameInfo || !isPlaying) return

    if (frameInfo.isFinished) {
      boot.pause()
      return
    }

    const syncTime = () => {
      if (boot.duration && !isNaN(boot.duration)) {
        boot.currentTime = (frameInfo.completion / 100) * boot.duration
      }
    }

    if (boot.readyState >= 1) {
      syncTime()
    } else {
      boot.addEventListener('loadedmetadata', syncTime, { once: true })
    }

    if (!hasStartedBoot) {
      boot.play().then(() => setHasStartedBoot(true)).catch(() => {
        const startOnInteraction = () => {
          boot.play().then(() => {
            setHasStartedBoot(true)
            window.removeEventListener('click', startOnInteraction)
          })
        }
        window.addEventListener('click', startOnInteraction)
      })
    }
  }, [frameInfo.completion, isPlaying, hasStartedBoot, frameInfo.isFinished, isMirror])

  // Handle music start (2s after boot completion)
  useEffect(() => {
    if (isMirror) return
    if (frameInfo.isFinished && isPlaying && !musicStarted) {
      const timer = setTimeout(() => {
        musicAudioRef.current?.play().then(() => setMusicStarted(true)).catch(() => {
          const startOnInteraction = () => {
            musicAudioRef.current?.play().then(() => {
              setMusicStarted(true)
              window.removeEventListener('click', startOnInteraction)
            })
          }
          window.addEventListener('click', startOnInteraction)
        })
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [frameInfo.isFinished, isPlaying, musicStarted, isMirror])

  // Volume and Fade out logic for boot sound
  useEffect(() => {
    if (isMirror) return
    const boot = bootAudioRef.current
    if (!boot) return

    let targetBootVolume = volume
    if (frameInfo && !frameInfo.isFinished && frameInfo.completion >= 95) {
      const remaining = 100 - frameInfo.completion
      targetBootVolume = (remaining / 5) * volume
    }
    boot.volume = Math.max(0, targetBootVolume)
    
    if (musicAudioRef.current) {
      musicAudioRef.current.volume = volume
    }
  }, [volume, frameInfo.completion, frameInfo.isFinished, isMirror])

  return (
    <div className="music-player" style={{ opacity: isGlobalFinished ? 1 : 0.6 }}>
      <div className="player-controls">
        <button className="play-toggle-icon" onClick={togglePlay}>
          <img 
            src={isPlaying ? '/assets/icons/volume_on.png' : '/assets/icons/volume_off.png'} 
            alt={isPlaying ? 'Mute' : 'Unmute'} 
            className="audio-status-icon"
          />
        </button>
        <div className={`volume-container ${showVolume ? 'is-visible' : ''}`}>
          <label htmlFor="volume-slider">VOL</label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            onInput={handleVolumeChange} // Ensure timer resets while dragging
          />
        </div>
      </div>
    </div>
  )
}
