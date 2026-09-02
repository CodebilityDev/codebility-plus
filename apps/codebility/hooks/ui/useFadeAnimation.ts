"use client"

// Reusable fade animation variants with customizable options
export const useFadeAnimation = (options?: {
  backgroundOpacity?: number
  delayStep?: number
  baseDuration?: number
}) => {
  const { backgroundOpacity = 0.7, delayStep = 0.4, baseDuration = 1.2 } = options || {}

  return {
    // For background elements that need partial opacity
    backgroundFade: {
      hidden: { opacity: 0 },
      visible: { opacity: backgroundOpacity },
    },

    // For regular elements that need full opacity
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },

    // Timing functions for different elements
    timing: {
      background: { duration: baseDuration, ease: "easeOut" },
      grid: { duration: baseDuration + 0.3, delay: delayStep * 0.75, ease: "easeOut" },
      welcomeText: { duration: baseDuration, delay: delayStep * 2, ease: "easeOut" },
      logoText: { duration: baseDuration + 0.3, delay: delayStep * 3, ease: "easeOut" },
    },
  }
}

// Export types for better TypeScript support
export type FadeAnimationProps = ReturnType<typeof useFadeAnimation>
