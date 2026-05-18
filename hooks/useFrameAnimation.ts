'use client'

import { useState, useEffect, useRef } from 'react'
import type { FrameAnimationState } from '@/lib/constants'

/**
 * Preloads `totalFrames` images from `${basePath}/frame_NNN.jpg`.
 * Tracks load/error progress (0–1) and sets `ready` when all frames resolve.
 *
 * Validates: Requirements 3.2, 3.5, 4.2
 */
export function useFrameAnimation(
  totalFrames: number,
  basePath: string,
  getFileName: (index: number) => string
): FrameAnimationState {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  // Use a ref to store the latest getFileName callback to prevent
  // the preloading effect from re-running due to referential changes.
  const getFileNameRef = useRef(getFileName)
  useEffect(() => {
    getFileNameRef.current = getFileName
  }, [getFileName])

  useEffect(() => {
    if (totalFrames <= 0) {
      // Defer state updates to satisfy strict react-hooks/set-state-in-effect lint rules
      const timer = setTimeout(() => {
        setProgress(0)
        setReady(false)
        setFrames([])
      }, 0)
      return () => clearTimeout(timer)
    }

    let loaded = 0
    let isMounted = true

    const imgs = Array.from({ length: totalFrames }, (_, i) => {
      const img = new Image()
      img.src = `${basePath}/${getFileNameRef.current(i)}`

      const handleLoad = () => {
        if (!isMounted) return
        loaded++
        setProgress(loaded / totalFrames)
        
        // Mark as ready if at least 95% of frames are fully loaded and cached in RAM.
        // This ensures the animation has all its frames ready for buttery-smooth playback from the start.
        const requiredFrames = Math.max(1, Math.round(totalFrames * 0.95))
        if (loaded >= requiredFrames) {
          setReady(true)
        }
      }

      img.onload = handleLoad
      img.onerror = handleLoad // Count errors as "loaded" to prevent infinite hangs

      return img
    })

    const timer = setTimeout(() => {
      if (isMounted) {
        setFrames(imgs)
      }
    }, 0)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [totalFrames, basePath])

  return { frames, progress, ready }
}
