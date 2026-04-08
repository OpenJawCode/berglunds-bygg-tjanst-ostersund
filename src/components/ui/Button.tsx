import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: cn(
      'bg-brand text-white hover:bg-brand-400',
      'focus:ring-2 focus:ring-brand focus:ring-offset-2'
    ),
    secondary: cn(
      'bg-white text-brand border-2 border-brand',
      'hover:bg-brand hover:text-white',
      'focus:ring-2 focus:ring-brand focus:ring-offset-2'
    ),
    ghost: 'text-brand hover:bg-brand/5',
    outline: 'border-2 border-current text-brand hover:bg-brand/5',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
}
