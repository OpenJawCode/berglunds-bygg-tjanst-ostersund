'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg'
type ChatState = 'idle' | 'sending' | 'success' | 'error'

interface AnimatedButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  chatState?: ChatState
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function AnimatedButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  chatState = 'idle',
  children,
  className,
  disabled,
  onClick,
}: AnimatedButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setRipples((prev) => [...prev, { x, y, id: Date.now() }])

    setTimeout(() => {
      setRipples((prev) => prev.slice(1))
    }, 600)
    
    onClick?.(e)
  }, [onClick])

  const variants = {
    primary: 'bg-brand text-white hover:bg-brand-400 shadow-lg shadow-brand/30',
    secondary: 'bg-white text-brand border-2 border-brand hover:bg-brand hover:text-white',
    ghost: 'text-brand hover:bg-brand/5',
    outline: 'border-2 border-current text-brand hover:bg-brand/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const getPulseClass = () => {
    if (chatState === 'error') return 'animate-shake'
    if (chatState === 'success') return 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent'
    return 'group-hover:animate-pulse-glow'
  }

  const isDisabled = disabled || isLoading || chatState === 'sending'

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'relative overflow-hidden',
        'active:scale-[0.98]',
        getPulseClass(),
        variants[variant],
        sizes[size],
        isDisabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ width: 0, height: 0, x: ripple.x, y: ripple.y, opacity: 0.6 }}
          animate={{ width: 200, height: 200, x: ripple.x - 100, y: ripple.y - 100, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Pulse glow effect */}
      <motion.span
        className="absolute inset-0 rounded-full bg-brand/40 blur-xl"
        animate={{
          opacity: chatState === 'idle' ? [0.3, 0.6, 0.3] : 0,
          scale: chatState === 'idle' ? [1, 1.1, 1] : 1,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  )
}

// Add custom animation keyframes via style tag
if (typeof document !== 'undefined' && !document.getElementById('button-animations')) {
  const style = document.createElement('style')
  style.id = 'button-animations'
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-4px); }
      40%, 80% { transform: translateX(4px); }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0, 184, 212, 0.4); }
      50% { box-shadow: 0 0 20px 10px rgba(0, 184, 212, 0.2); }
    }
    .animate-shake {
      animation: shake 0.4s ease-in-out;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
  `
  document.head.appendChild(style)
}