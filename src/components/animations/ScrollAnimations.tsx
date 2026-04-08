'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface FadeInUpProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.8,
  once = true,
}: FadeInUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    gsap.set(element, { y: 30, opacity: 0 })

    const animation = gsap.to(element, {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === element)
        .forEach((st) => st.kill())
    }
  }, [delay, duration, once])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  childClassName?: string
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  childClassName,
}: StaggerContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const children = container.children
    if (children.length === 0) return

    gsap.set(children, { y: 20, opacity: 0 })

    const animation = gsap.to(children, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === container)
        .forEach((st) => st.kill())
    }
  }, [stagger])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}

interface ScaleRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScaleReveal({ children, className, delay = 0 }: ScaleRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    gsap.set(element, { scale: 0.95, opacity: 0 })

    const animation = gsap.to(element, {
      scale: 1,
      opacity: 1,
      duration: 0.6,
      delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll()
        .filter((st) => st.trigger === element)
        .forEach((st) => st.kill())
    }
  }, [delay])

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
