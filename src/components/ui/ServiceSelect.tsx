'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceOption {
  value: string
  label: string
}

interface ServiceSelectProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  options?: ServiceOption[]
}

const DEFAULT_SERVICES = [
  { value: 'takbyten', label: '🏠 Takbyten' },
  { value: 'badrumsrenovering', label: '🚿 Badrumsrenovering' },
  { value: 'köksrenovering', label: '🍳 Köksrenovering' },
  { value: 'nybyggnation', label: '🏗️ Nybyggnation' },
  { value: 'tillbyggnad', label: '📐 Tillbyggnad' },
  { value: 'ombyggnation', label: '🔧 Ombyggnation' },
  { value: 'snickeri', label: '🪵 Snickeriarbeten' },
  { value: 'fasad', label: '🏢 Fasadarbeten' },
  { value: 'annat', label: '❓ Annat' },
]

export function ServiceSelect({
  value,
  onChange,
  placeholder = 'Välj tjänst...',
  options = DEFAULT_SERVICES
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
          isOpen && 'border-brand ring-2 ring-brand/20'
        )}
      >
        <span className={cn('text-sm', selectedOption ? 'text-white' : 'text-white/50')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
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
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left',
                  'text-sm transition-colors',
                  option.value === value
                    ? 'text-brand bg-brand/10'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                )}
              >
                <span>{option.label}</span>
                {option.value === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-4 h-4 text-brand" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}