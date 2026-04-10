'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Experiment toggle - set to true to enable all experiments
export const EXPERIMENT_MODE = process.env.NEXT_PUBLIC_EXPERIMENT_MODE === 'true'

// Animation settings for experiments
export const experimentSettings = {
  parallax: {
    slow: 0.1,
    medium: 0.3,
    fast: 0.5,
  },
  reveal: {
    duration: 0.8,
    delay: 0.1,
    stagger: 0.08,
  },
  responsive: {
    mobileBreakpoint: 768,
  },
}

// Check if device is mobile
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < experimentSettings.responsive.mobileBreakpoint
}

// Create parallax effect
export function createParallax(
  element: HTMLElement,
  speed: number = 0.3,
  direction: 'vertical' | 'horizontal' = 'vertical'
): gsap.core.Tween {
  const axis = direction === 'vertical' ? 'y' : 'x'
  
  return gsap.to(element, {
    [axis]: () => (direction === 'vertical' ? window.innerHeight : window.innerWidth) * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  })
}

// Staggered reveal for grid items
export function staggerReveal(
  parent: HTMLElement,
  children: string,
  stagger: number = 0.08
): gsap.core.Timeline {
  return gsap.timeline({
    scrollTrigger: {
      trigger: parent,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  }).fromTo(
    children,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      ease: 'power2.out',
    }
  )
}

// Cleanup helper
export function cleanupAnimation(ref: unknown) {
  if (!ref) return
  if (ref && typeof ref === 'object' && 'revert' in ref) {
    (ref as { revert: () => void }).revert()
  } else if (ref && typeof ref === 'object' && 'kill' in ref) {
    (ref as { kill: () => void }).kill()
  }
}

// Check for reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Debounce helper for resize events
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}