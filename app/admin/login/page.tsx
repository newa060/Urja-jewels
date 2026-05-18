'use client'

import { useActionState, useState } from 'react'
import { login } from '@/app/actions/auth'
import { IoDiamondOutline } from 'react-icons/io5'
import { MdOutlineMail, MdOutlineLock, MdOutlineVisibilityOff, MdOutlineVisibility, MdArrowForward } from 'react-icons/md'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      return await login(formData)
    },
    null
  )

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="bg-ivory min-h-screen flex items-center justify-center relative overflow-hidden font-body">
      {/* Subtle Background Image with Overlay for Depth */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-stone/10 z-10 mix-blend-multiply"></div>
        <img
          alt="Minimal architectural background"
          className="w-full h-full object-cover object-center opacity-40 grayscale"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCb6KgXcMJ_X4NSKbZxuXWjHxwYuMs_lEb7LdeD17FoPpiZ7kGqifSzVYVf2SojRgX4l6c2HoxDqhN7a34EYgdUhmMUhJ7X81_iU3DRjgl-RkKJa3hnqqMPa8Nvts0g9kzSscyiQZ5IQpGGtKEgTcSfQfC1p1wiUEr2LH4g_hmN_sLI2fv-0da41a95Yuia7MfkSW4JH1Xo1oc4QPy_DhMIvJzF0UN5RDH-v-vDu3M2jDLcphCPER_sTwcFj5bo-8WDACOesUFizac"
        />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[520px] px-5 md:px-0">
        <div className="bg-pearl border border-obsidian/10 p-12 shadow-[0_0_60px_rgba(27,28,28,0.02)]">
          {/* Brand Header */}
          <div className="text-center mb-12 flex flex-col items-center">
            <IoDiamondOutline className="text-gold mb-4 text-3xl font-light" />
            <h1 className="font-display text-2xl text-gold tracking-[0.2em] uppercase mb-2">Urja Jewels</h1>
            <p className="font-body text-xs text-stone tracking-widest uppercase">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form action={formAction} className="space-y-8">
            {state?.error && (
              <div className="bg-red-50 text-red-500 p-3 text-sm border border-red-100 text-center uppercase tracking-wider font-medium">
                {state.error}
              </div>
            )}

            {/* Admin Email Field */}
            <div className="relative group">
              <label className="font-body text-xs text-mink block mb-2 uppercase tracking-widest" htmlFor="email">
                Admin Email
              </label>
              <div className="relative flex items-center">
                <MdOutlineMail className="absolute left-0 text-mink/50 group-focus-within:text-gold transition-colors duration-300 pointer-events-none text-xl" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@urjajewels.com"
                  required
                  className="w-full bg-transparent border-0 border-b border-obsidian/20 pl-8 pr-0 py-3 font-body text-base text-obsidian focus:ring-0 focus:border-gold focus:border-b-2 transition-all outline-none placeholder:text-mink/30 rounded-none"
                />
              </div>
            </div>

            {/* Secure Password Field */}
            <div className="relative group">
              <label className="font-body text-xs text-mink flex justify-between mb-2 uppercase tracking-widest" htmlFor="password">
                <span>Secure Password</span>
                <a className="text-gold hover:text-obsidian transition-colors duration-300" href="#">Reset?</a>
              </label>
              <div className="relative flex items-center">
                <MdOutlineLock className="absolute left-0 text-mink/50 group-focus-within:text-gold transition-colors duration-300 pointer-events-none text-xl" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-transparent border-0 border-b border-obsidian/20 pl-8 pr-8 py-3 font-body text-base text-obsidian focus:ring-0 focus:border-gold focus:border-b-2 transition-all outline-none rounded-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 text-mink/50 hover:text-obsidian transition-colors duration-300 focus:outline-none"
                >
                  {showPassword ? (
                    <MdOutlineVisibility className="text-xl" />
                  ) : (
                    <MdOutlineVisibilityOff className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Device & Actions */}
            <div className="flex items-center justify-between pt-2 pb-6">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="peer appearance-none w-4 h-4 border border-obsidian/20 cursor-pointer transition-colors duration-200 checked:border-gold rounded-none"
                  />
                  <svg className="absolute w-3 h-3 text-gold pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" />
                  </svg>
                </div>
                <label className="font-body text-base text-mink cursor-pointer group-hover:text-obsidian transition-colors duration-300" htmlFor="remember">
                  Remember this device
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full bg-obsidian text-pearl font-body text-sm uppercase tracking-widest py-4 border border-obsidian hover:bg-gold hover:border-gold transition-colors duration-300 flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{pending ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              {!pending && (
                <MdArrowForward className="opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-lg" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
