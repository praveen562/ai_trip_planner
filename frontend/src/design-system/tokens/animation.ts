/**
 * Sophisticated Animation System
 * Timing functions and durations for natural motion
 */

export const animation = {
  // Duration scales
  duration: {
    fastest: '50ms',
    faster: '75ms',
    fast: '100ms',
    normal: '150ms',
    slow: '200ms',
    slower: '250ms',
    slowest: '300ms',

    // Specific use cases
    hover: '150ms',
    press: '100ms',
    drag: '20ms',
    transition: '250ms',
    overlay: '300ms',
    drawer: '350ms',
    modal: '400ms',

    // Page transitions
    page: {
      enter: '300ms',
      exit: '250ms'
    }
  },

  // Easing functions (cubic-bezier)
  easing: {
    // Natural motion curves
    none: 'linear',
    'in': 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Soft curves for gentle motions
    softIn: 'cubic-bezier(0.4, 0, 0.6, 1)',
    softOut: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    softInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Sharp, responsive Feel
    snappy: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Bouncy for playful interactions
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

    // Material-inspired
    material: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // Custom curves for specific effects
    float: 'cubic-bezier(0.5, 0, 0.5, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },

  // Stagger patterns
  stagger: {
    small: '50ms',
    medium: '75ms',
    large: '100ms'
  },

  // Key animation presets
  presets: {
    fade: {
      in: { opacity: [0, 1] },
      out: { opacity: [1, 0] }
    },
    slide: {
      up: {
        enter: { y: [20, 0], opacity: [0, 1] },
        leave: { y: [0, 20], opacity: [1, 0] }
      },
      down: {
        enter: { y: [-20, 0], opacity: [0, 1] },
        leave: { y: [0, -20], opacity: [1, 0] }
      },
      left: {
        enter: { x: [20, 0], opacity: [0, 1] },
        leave: { x: [0, 20], opacity: [1, 0] }
      },
      right: {
        enter: { x: [-20, 0], opacity: [0, 1] },
        leave: { x: [0, -20], opacity: [1, 0] }
      }
    },
    scale: {
      in: { scale: [0.95, 1], opacity: [0, 1] },
      out: { scale: [1, 0.95], opacity: [1, 0] }
    },
    pop: {
      in: { scale: [0, 1], opacity: [0, 1] },
      out: { scale: [1, 0], opacity: [1, 0] }
    }
  }
};

export default animation;
