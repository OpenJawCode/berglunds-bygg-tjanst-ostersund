import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'light' | 'dark' | 'primary'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export function Section({
  children,
  className,
  background = 'light',
  padding = 'lg',
}: SectionProps) {
  const backgrounds = {
    light: 'bg-background-light',
    dark: 'bg-background-dark text-white',
    primary: 'bg-primary text-white',
  }

  const paddings = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20 md:py-28',
    xl: 'py-24 md:py-32',
  }

  return (
    <section className={cn(backgrounds[background], paddings[padding], className)}>
      <div className="container-custom">
        {children}
      </div>
    </section>
  )
}

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  light = false,
}: SectionHeaderProps) {
  const alignments = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  }

  return (
    <div className={cn('max-w-3xl mb-12 md:mb-16', alignments[align])}>
      {eyebrow && (
        <span className={cn(
          'inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider mb-4',
          light ? 'bg-white/10 text-white/80' : 'bg-primary/10 text-primary'
        )}>
          {eyebrow}
        </span>
      )}
      <h2 className={cn(
        'font-heading text-3xl md:text-4xl lg:text-5xl font-semibold',
        light ? 'text-white' : 'text-text'
      )}>
        {title}
      </h2>
      {description && (
        <p className={cn(
          'mt-4 text-lg md:text-xl',
          light ? 'text-white/80' : 'text-text-muted'
        )}>
          {description}
        </p>
      )}
    </div>
  )
}
