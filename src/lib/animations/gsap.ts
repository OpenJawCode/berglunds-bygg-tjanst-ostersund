'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Custom easing curves
export const easings = {
  smooth: 'power2.out',
  bounce: 'elastic.out(1, 0.5)',
  snappy: 'power4.out',
  gentle: 'power1.out',
}

// Fade in up animation
export function fadeInUp(
  element: HTMLElement | string,
  delay: number = 0,
  duration: number = 0.8
) {
  return gsap.fromTo(
    element,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: easings.smooth,
    }
  )
}

// Fade in left animation
export function fadeInLeft(
  element: HTMLElement | string,
  delay: number = 0,
  duration: number = 0.8
) {
  return gsap.fromTo(
    element,
    { x: -40, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration,
      delay,
      ease: easings.smooth,
    }
  )
}

// Scale reveal animation
export function scaleReveal(
  element: HTMLElement | string,
  delay: number = 0,
  duration: number = 0.6
) {
  return gsap.fromTo(
    element,
    { scale: 0.92, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: easings.smooth,
    }
  )
}

// Stagger children animation
export function staggerChildren(
  parent: HTMLElement | string,
  children: string,
  stagger: number = 0.08
) {
  return gsap.fromTo(
    children,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      ease: easings.smooth,
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    }
  )
}

// Clip reveal animation
export function clipReveal(
  element: HTMLElement | string,
  delay: number = 0
) {
  return gsap.fromTo(
    element,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration: 1,
      delay,
      ease: easings.snappy,
    }
  )
}

// Hook for scroll-triggered animations
export function useScrollAnimation(
  animation: (element: HTMLElement) => gsap.core.Tween | gsap.core.Timeline,
  deps: unknown[] = []
) {
  const elementRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Create animation
    animationRef.current = animation(element)

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, deps)

  return elementRef
}

// Hook for GSAP context (cleanup on unmount)
export function useGSAPContext() {
  const contextRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    contextRef.current = gsap.context(() => {})

    return () => {
      contextRef.current?.revert()
    }
  }, [])

  return contextRef
}
