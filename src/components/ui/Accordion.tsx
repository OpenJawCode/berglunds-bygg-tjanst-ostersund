'use client'

import { useState } from 'react'
import { ChevronRight, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  id: string
  icon?: LucideIcon
  title: string
  content: string
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  variant?: 'default' | 'faq'
  className?: string
}

export function Accordion({
  items,
  allowMultiple = false,
  variant = 'default',
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(id)
      }
      return newSet
    })
  }

  const isOpen = (id: string) => openItems.has(id)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item) => {
        const Icon = item.icon
        const itemOpen = isOpen(item.id)

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-[10px] border border-white/[0.08] overflow-hidden',
              'transition-all duration-300',
              itemOpen && 'border-brand/30',
              variant === 'default' ? 'bg-[#0d1117]' : 'bg-[#080d12]'
            )}
          >
            {/* Top border accent when open */}
            <div
              className={cn(
                'h-[1px] bg-brand transition-all duration-300',
                itemOpen ? 'opacity-100' : 'opacity-0'
              )}
            />

            {/* Header */}
            <button
              onClick={() => toggleItem(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-4 text-left',
                'transition-colors duration-200',
                'hover:bg-white/[0.02]'
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    'w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200',
                    itemOpen ? 'text-brand' : 'text-brand/70'
                  )}
                  strokeWidth={1.5}
                />
              )}
              <span
                className={cn(
                  'flex-1 font-heading text-[15px] transition-colors duration-200',
                  itemOpen ? 'text-[#e8e4dc]' : 'text-[#e8e4dc]/90'
                )}
              >
                {item.title}
              </span>
              <ChevronRight
                className={cn(
                  'w-5 h-5 text-brand/70 flex-shrink-0 transition-transform duration-250',
                  itemOpen && 'rotate-90'
                )}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </button>

            {/* Content */}
            <div
              className={cn(
                'grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
                itemOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    'pb-4 text-[13px] leading-[1.7] text-[#c8bfa8]',
                    Icon ? 'pl-[44px] pr-4' : 'px-4'
                  )}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
