'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Search,
  FileText,
  Hammer,
  CheckCircle,
  Lightbulb,
  Building2,
  Key,
  LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimelineStep as TimelineStepType } from '@/lib/service-data'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const iconMap: Record<string, LucideIcon> = {
  Search,
  FileText,
  Hammer,
  CheckCircle,
  Lightbulb,
  Building2,
  Key,
}

interface ProcessTimelineProps {
  steps: TimelineStepType[]
  className?: string
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const lineRef = useRef<SVGPathElement>(null)
  const lineContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      // Set initial states
      stepsRef.current.forEach((step) => {
        if (step) {
          gsap.set(step, { opacity: 0, y: 30 })
        }
      })

      // Create the scroll trigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      // Animate steps with stagger
      stepsRef.current.forEach((step, index) => {
        if (step) {
          tl.to(
            step,
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power2.out',
            },
            index * 0.1
          )
        }
      })

      // Animate the connecting line after first step appears
      if (lineRef.current) {
        const pathLength = lineRef.current.getTotalLength()
        gsap.set(lineRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })

        tl.to(
          lineRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          0.3
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [steps.length])

  return (
    <div
      ref={sectionRef}
      className={cn('bg-[#080d12] py-20 md:py-28', className)}
    >
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-[#e8e4dc] mb-4">
            Så går det till
          </h2>
          <p className="text-[#c8bfa8] text-lg max-w-2xl mx-auto">
            En tydlig process från första kontakt till färdigt resultat
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <div
            ref={lineContainerRef}
            className="hidden lg:block absolute top-[60px] left-0 right-0 h-[1px] pointer-events-none"
          >
            <svg
              className="w-full h-4 absolute -top-2"
              preserveAspectRatio="none"
            >
              <path
                ref={lineRef}
                d={`M ${100 / steps.length / 2}% 2 L ${100 - 100 / steps.length / 2}% 2`}
                stroke="#00B8D4"
                strokeWidth="1"
                fill="none"
                opacity="0.3"
                style={{ vectorEffect: 'non-scaling-stroke' }}
              />
            </svg>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = iconMap[step.icon]
              return (
                <div
                  key={step.number}
                  ref={(el) => {
                    stepsRef.current[index] = el
                  }}
                  className="relative"
                >
                  {/* Step Number */}
                  <div className="font-heading text-5xl md:text-6xl font-bold text-brand mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                    {Icon && (
                      <Icon
                        className="w-5 h-5 text-brand"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-base text-[#e8e4dc] font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-relaxed text-[#c8bfa8] line-clamp-2">
                    {step.description}
                  </p>

                  {/* Mobile connector line */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute left-5 top-full w-[1px] h-8 bg-brand/20" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
