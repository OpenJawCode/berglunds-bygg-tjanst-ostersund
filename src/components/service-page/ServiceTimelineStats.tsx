'use client'

import { Clock, MessageCircle, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedCountUp } from '@/components/ui/CountUp'

interface ServiceStats {
  duration: string
  durationValue: string
  response: string
  responseValue: string
  warranty: string
  warrantyValue: string
}

interface ServiceTimelineStatsProps {
  stats: ServiceStats
  className?: string
}

export function ServiceTimelineStats({
  stats,
  className,
}: ServiceTimelineStatsProps) {
  const cards = [
    {
      icon: Clock,
      label: 'Typisk projekttid',
      value: stats.duration,
      numericValue: parseInt(stats.durationValue, 10),
      suffix: stats.duration.includes('år')
        ? ' år'
        : stats.duration.includes('dag')
          ? ' dagar'
          : ' dagar',
    },
    {
      icon: MessageCircle,
      label: 'Svar på offert',
      value: stats.response,
      numericValue: parseInt(stats.responseValue, 10),
      suffix: 'h',
    },
    {
      icon: Shield,
      label: 'Garanti på arbetet',
      value: stats.warranty,
      numericValue: parseInt(stats.warrantyValue, 10),
      suffix: ' år',
    },
  ]

  return (
    <div className={cn('bg-[#080d12] py-16', className)}>
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className={cn(
                  'rounded-[10px] p-6',
                  'bg-[#111820]',
                  'transition-all duration-300',
                  'hover:bg-[#111820]/80'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-[#c8bfa8] text-sm mb-1">{card.label}</p>
                    <p className="font-heading text-2xl md:text-3xl font-bold text-[#e8e4dc]">
                      {card.numericValue > 0 ? (
                        <AnimatedCountUp
                          end={card.numericValue}
                          suffix={card.suffix}
                          duration={2}
                        />
                      ) : (
                        card.value
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
