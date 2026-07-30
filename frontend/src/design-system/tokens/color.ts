/**
 * Premium Travel-Inspired Color System
 * Inspired by: Apple, Airbnb, Linear, Stripe, Figma
 */

export const colorPalette = {
  // Primary - Sophisticated Blues (Travel/Trust/Professional)
  primary: {
    50: '#f0f7ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main brand blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },

  // Secondary - Warm Accents (Sunset/Adventure)
  secondary: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Warm amber/gold
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },

  // Neutrals - Sophisticated Grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },

  // Backgrounds
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    paper: '#ffffff',
    elevated: 'rgba(255, 255, 255, 0.9)'
  },

  // Semantic - Travel Context
  semantic: {
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      500: '#22c55e' // Fresh green for confirmed bookings
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      500: '#f59e0b' // Amber for pending trips
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      500: '#ef4444' // Soft red for cancellations
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      500: '#3b82f6' // Info blue
    }
  },

  // Travel-Specific Accents
  travel: {
    sky: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      500: '#60a5fa'
    },
    sea: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      500: '#06b6d4'
    },
    sun: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      500: '#fbbf24'
    },
    earth: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#e9d5ff',
      500: '#8b5cf6'
    }
  },

  // Gradient Definitions
  gradients: {
    primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    secondary: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    sunset: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
    ocean: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    sky: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    aurora: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    voyage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)'
  }
};

// CSS Variable Generator
export const generateCssVariables = () => {
  const generateColorVars = (obj: any, prefix = ''): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          return generateColorVars(value, `${prefix}${key}-`);
        }
        return `--color-${prefix}${key}: ${value};`;
      })
      .join('\n  ');
  };

  return `
  :root {
    ${generateColorVars(colorPalette)}
  }
`;
};

export default colorPalette;
