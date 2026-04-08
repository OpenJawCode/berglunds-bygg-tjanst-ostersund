import { cn } from '@/lib/utils'

interface PageHeroProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  align?: 'left' | 'center'
}

/**
 * Standardized Page Hero Component
 * 
 * Uses bg-background-light (cream) with text-text (dark) for proper contrast.
 * This ensures all subpage heroes have consistent, readable styling.
 * 
 * NEVER use text-white on this component - the background is light cream (#F8F6F3)
 */
export function PageHero({ 
  title, 
  description, 
  children,
  className,
  align = 'center'
}: PageHeroProps) {
  return (
    <section className={cn(
      "pt-32 pb-16 md:pt-40 md:pb-24 bg-background-light",
      className
    )}>
      <div className={cn(
        "container-custom max-w-3xl",
        align === 'center' && "text-center"
      )}>
        <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-text-muted leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  )
}
