'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    let loaded = 0

    const imgs = Array.from({ length: totalFrames }, (_, i) => {
      const img = new Image()
      img.src = `${basePath}/${getFileName(i)}`

      img.onload = () => {
        loaded++
        setProgress(loaded / totalFrames)
        if (loaded === totalFrames) setReady(true)
      }

      img.onerror = () => {
        loaded++
        setProgress(loaded / totalFrames)
        if (loaded === totalFrames) setReady(true)
      }

      return img
    })

    const timer = setTimeout(() => {
      setFrames(imgs)
    }, 0)

    return () => clearTimeout(timer)
  }, [totalFrames, basePath, getFileName])

  return { frames, progress, ready }
}
