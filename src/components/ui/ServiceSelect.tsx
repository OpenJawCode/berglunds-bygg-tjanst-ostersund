'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SERVICE_OPTIONS, ServiceOption } from '@/lib/services'

interface ServiceSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options?: ServiceOption[]
  variant?: 'default' | 'chips' | 'dropdown'
}

export function ServiceSelect({
  value,
  onChange,
  placeholder = 'Välj tjänst...',
  options = SERVICE_OPTIONS,
  variant = 'default'
}: ServiceSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Chips variant for mobile-friendly horizontal scroll
  if (variant === 'chips') {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {options.map((option) => {
          const Icon = option.icon
          const isSelected = option.value === value
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap',
                'border transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-brand/30',
                isSelected
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10 hover:border-white/20'
              )}
            >
              <Icon className={cn('w-4 h-4', isSelected ? 'text-white' : 'text-brand')} />
              <span className="text-sm font-medium">{option.label}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <div ref={selectRef} className="relative w-full">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-xl',
          'bg-white/5 border border-border text-white',
          'hover:border-brand/50 hover:bg-white/10',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-brand/20',
          isOpen && 'border-brand ring-2 ring-brand/20'
        )}
      >
        <div className="flex items-center gap-3">
          {selectedOption && (
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              'bg-brand/20'
            )}>
              <selectedOption.icon className="w-4 h-4 text-brand" />
            </div>
          )}
          <div className="text-left">
            <span className={cn('text-sm block', selectedOption ? 'text-white' : 'text-white/50')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption && (
              <span className="text-xs text-white/40">{selectedOption.description}</span>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/50" />
        </motion.div>
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              'absolute z-50 w-full mt-2 py-2 rounded-xl',
              'bg-[#1a1f2e] border border-white/10 shadow-xl',
              'max-h-64 overflow-y-auto'
            )}
          >
            {options.map((option, index) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left',
                    'transition-colors',
                    option.value === value
                      ? 'text-brand bg-brand/10'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center',
                    option.value === value ? 'bg-brand/20' : 'bg-white/5'
                  )}>
                    <Icon className={cn('w-4 h-4', option.value === value ? 'text-brand' : 'text-white/60')} />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium block">{option.label}</span>
                    <span className="text-xs text-white/40">{option.description}</span>
                  </div>
                  {option.value === value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4 text-brand" />
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
