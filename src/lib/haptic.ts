/**
 * Haptic Feedback Utility
 * 
 * Provides tactile feedback for mobile devices.
 * Automatically checks for vibration API support and user preferences.
 * Respects prefers-reduced-motion setting.
 */

// Check if device supports vibration
const supportsVibration = (): boolean => {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

// Check if user prefers reduced motion
const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export const haptic = {
  /**
   * Light feedback - for button presses
   */
  light: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate(10)
  },

  /**
   * Medium feedback - for important actions
   */
  medium: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate(20)
  },

  /**
   * Heavy feedback - for major actions
   */
  heavy: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate([30, 50, 30])
  },

  /**
   * Success pattern - for completed actions
   */
  success: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate([10, 50, 10])
  },

  /**
   * Error pattern - for errors/warnings
   */
  error: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate([50, 30, 50])
  },

  /**
   * Message sent - subtle confirmation
   */
  messageSent: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate(5)
  },

  /**
   * Image uploaded - confirmation
   */
  imageUploaded: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate([10, 30, 10])
  },

  /**
   * Selection feedback - for list/option selections
   */
  selection: () => {
    if (!supportsVibration() || prefersReducedMotion()) return
    navigator.vibrate(8)
  }
}

/**
 * Check if haptics are available
 */
export const isHapticAvailable = (): boolean => {
  return supportsVibration() && !prefersReducedMotion()
}

/**
 * Hook for using haptics in components
 */
export const useHaptic = () => {
  return {
    ...haptic,
    isAvailable: isHapticAvailable()
  }
}
