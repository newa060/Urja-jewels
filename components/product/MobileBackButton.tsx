'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface MobileBackButtonProps {
  href?: string
}

export default function MobileBackButton({ href }: MobileBackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onClick={handleBack}
      className="md:hidden flex items-center space-x-2 text-stone hover:text-obsidian transition-colors mb-6 font-body text-sm uppercase tracking-widest"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
      <span>Back</span>
    </motion.button>
  )
}
