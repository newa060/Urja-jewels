import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import SmoothScrollProvider from '@/components/layout/SmoothScrollProvider'
import AnimatePresenceWrapper from '@/components/layout/AnimatePresenceWrapper'
import ConditionalHeaderFooter from '@/components/layout/ConditionalHeaderFooter'

// ---------------------------------------------------------------------------
// Fonts
// ---------------------------------------------------------------------------

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
})

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Urja Jewels — Luxury Jewelry',
  description: 'Crafted for Eternity. Timeless luxury jewelry by Urja Jewels.',
}

// ---------------------------------------------------------------------------
// Root layout
// ---------------------------------------------------------------------------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable}`}
    >
      <body>
        <SmoothScrollProvider>
          <ConditionalHeaderFooter>
            <AnimatePresenceWrapper>
              {children}
            </AnimatePresenceWrapper>
          </ConditionalHeaderFooter>
        </SmoothScrollProvider>
      </body>
    </html>
  )
}
