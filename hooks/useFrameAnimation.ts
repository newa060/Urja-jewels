'use client'

import { useState, useEffect } from 'react'
import type { FrameAnimationState } from '@/lib/constants'

/**
 * Preloads `totalFrames` images from `${basePath}/frame_NNN.jpg`.
 * Tracks load/error progress (0–1) and sets `ready` when all frames resolve.
 * After load, calls img.decode() to pre-warm GPU texture cache — this eliminates
 * the slow-scroll decode stall on mobile (first opening lag).
 *
 * Validates: Requirements 3.2, 3.5, 4.2
 */
export function useFrameAnimation(
  totalFrames: number,
  basePath: string,
  getFileName: (index: number) => string,
  minimumFrames: number = 15 // Minimum frames needed to show the page
): FrameAnimationState {
  const [frames, setFrames] = useState<HTMLImageElement[]>([])
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let loaded = 0
    let isMounted = true

    const imgs = Array.from({ length: totalFrames }, (_, i) => {
      const img = new Image()
      img.src = `${basePath}/${getFileName(i)}`

      const handleLoad = () => {
        if (!isMounted) return
        loaded++
        setProgress(loaded / totalFrames)
        
        // Mark as ready if we have the minimum frames needed for initial display
        if (loaded >= minimumFrames) {
          setReady(true)
        }

        // Pre-decode into GPU memory to eliminate slow-scroll stall on mobile.
        // img.decode() is async and non-blocking — it primes the browser's
        // raster cache so the first drawImage() call is instant, not laggy.
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {
            // decode() can fail if the image is already GC'd or offscreen — safe to ignore
          })
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
  }, [totalFrames, basePath, getFileName, minimumFrames])

  return { frames, progress, ready }
}
