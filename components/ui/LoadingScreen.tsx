'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { SITE_NAME } from '@/lib/constants'

interface LoadingScreenProps {
  progress: number   // 0–1
  onComplete: () => void
}

export default function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const isComplete = progress >= 0.9 // Let them in early for a "fast" feel

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {!isComplete && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-obsidian flex flex-col items-center justify-center"
          role="status"
          aria-live="polite"
        >
          {/* Brand name */}
          <p className="font-display text-4xl text-ivory mb-12 tracking-widest">
            {SITE_NAME}
          </p>

          {/* Progress bar */}
          <div className="w-64 h-px bg-fog/30 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gold transition-all duration-300 ease-out"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {/* Visually hidden percentage for screen readers */}
          <span className="sr-only">
            {Math.round(progress * 100)}% loaded
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
