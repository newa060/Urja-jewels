'use client'

import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'

const variants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.0, 0.0, 0.58, 1.0] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
}

interface PageTransitionProps {
  children: React.ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      className="relative"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  )
}
