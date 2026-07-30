/**
 * Sophisticated Shadow System
 * Multiple layers for depth and realism
 */

export const shadow = {
  // Subtle shadows for cards and surfaces
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',

  // Elevated shadows for floating elements
  '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.2)',
  '4xl': '0 45px 65px -15px rgba(0, 0, 0, 0.25)',

  // Inner shadows for pressed states
  inner: {
    sm: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },

  // Outline shadows for focus rings
  outline: {
    blue: '0 0 0 3px rgba(59, 130, 246, 0.5)',
    green: '0 0 0 3px rgba(16, 185, 129, 0.5)',
    red: '0 0 0 3px rgba(239, 68, 68, 0.5)'
  },

  // Specialized shadows
  dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  tooltip: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',

  // Glass/morphism effects
  glass: {
    light: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    dark: '0 8px 32px 0 rgba(0, 0, 0, 0.375)'
  }
};

export default shadow;
