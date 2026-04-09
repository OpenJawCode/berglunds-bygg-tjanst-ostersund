'use client'

import { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  separator?: string
  decimals?: number
  startOnView?: boolean
  className?: string
}

export function AnimatedCountUp({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  separator = ' ',
  decimals = 0,
  startOnView = true,
  className,
}: CountUpProps) {
  const [startCounting, setStartCounting] = useState(!startOnView)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!startOnView) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStartCounting(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [startOnView])

  return (
    <span ref={ref} className={className}>
      {startCounting ? (
        <CountUp
          end={end}
          duration={duration}
          prefix={prefix}
          suffix={suffix}
          separator={separator}
          decimals={decimals}
          useEasing={true}
          easingFn={(t, b, c, d) => {
            // Ease out cubic
            const td = t / d
            return c * (td * td * td + 1) + b
          }}
        />
      ) : (
        <span>{`${prefix}0${suffix}`}</span>
      )}
    </span>
  )
}
