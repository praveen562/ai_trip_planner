/**
 * Naviora Typography System
 *
 * Display: Clash Display — a confident geometric face used with restraint,
 *   reserved for headlines and the signature itinerary/route-code moments.
 * Body: General Sans — designed by the same foundry to pair with Clash
 *   Display, so headline and body always sit in the same visual family.
 * Mono: JetBrains Mono — used specifically for route codes, timestamps,
 *   and coordinates, echoing real boarding-pass/flight-board typography
 *   rather than serving as a neutral "data font."
 */

export const typography = {
  // Font Families
  fontFamily: {
    display:
      '"Clash Display", "General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    sans: '"General Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, "Times New Roman", Times, serif',
    mono: '"JetBrains Mono", "SF Mono", "Roboto Mono", Menlo, Monaco, Consolas, monospace'
  },

  // Font Weights
  fontWeight: {
    hairline: '100',
    thin: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },

  // Font Sizes
  fontSize: {
    '2xs': '0.625rem', // 10px
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem'      // 128px
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },

  // Typography Styles
  styles: {
    // Display / Hero
    display1: {
      fontFamily: 'display',
      fontSize: '9xl',
      fontWeight: 'bold',
      letterSpacing: '-0.05em',
      lineHeight: '1.1'
    },
    display2: {
      fontFamily: 'display',
      fontSize: '8xl',
      fontWeight: 'bold',
      letterSpacing: '-0.05em',
      lineHeight: '1.1'
    },
    display3: {
      fontFamily: 'display',
      fontSize: '7xl',
      fontWeight: 'bold',
      letterSpacing: '-0.05em',
      lineHeight: '1.1'
    },

    // Headlines
    headline1: {
      fontFamily: 'display',
      fontSize: '6xl',
      fontWeight: 'bold',
      letterSpacing: '-0.025em',
      lineHeight: '1.2'
    },
    headline2: {
      fontFamily: 'display',
      fontSize: '5xl',
      fontWeight: 'bold',
      letterSpacing: '-0.025em',
      lineHeight: '1.2'
    },
    headline3: {
      fontFamily: 'display',
      fontSize: '4xl',
      fontWeight: 'bold',
      letterSpacing: '-0.025em',
      lineHeight: '1.25'
    },
    headline4: {
      fontFamily: 'display',
      fontSize: '3xl',
      fontWeight: 'semibold',
      letterSpacing: '-0.015em',
      lineHeight: '1.3'
    },

    // Title
    title1: {
      fontSize: '2xl',
      fontWeight: 'semibold',
      letterSpacing: '0',
      lineHeight: '1.3'
    },
    title2: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      letterSpacing: '0',
      lineHeight: '1.3'
    },
    title3: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      letterSpacing: '0',
      lineHeight: '1.4'
    },

    // Body
    body: {
      fontSize: 'base',
      fontWeight: 'normal',
      letterSpacing: '-0.01em',
      lineHeight: '1.6'
    },
    bodyLarge: {
      fontSize: 'lg',
      fontWeight: 'normal',
      letterSpacing: '-0.01em',
      lineHeight: '1.6'
    },
    bodySmall: {
      fontSize: 'sm',
      fontWeight: 'normal',
      letterSpacing: '-0.01em',
      lineHeight: '1.5'
    },

    // Label / Caption
    label: {
      fontSize: 'xs',
      fontWeight: 'medium',
      letterSpacing: '0.05em',
      lineHeight: '1.4'
    },
    caption: {
      fontSize: 'xs',
      fontWeight: 'regular',
      letterSpacing: '0',
      lineHeight: '1.4'
    },

    // Overline
    overline: {
      fontSize: '2xs',
      fontWeight: 'medium',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      lineHeight: '1.4'
    },

    // Route code / boarding-pass data — JetBrains Mono.
    // For itinerary leg codes, timestamps, and coordinates
    // (e.g. "NVR · 014   KYOTO ⇄ OSAKA   09:40").
    routeCode: {
      fontFamily: 'mono',
      fontSize: 'sm',
      fontWeight: 'medium',
      letterSpacing: '0.05em',
      lineHeight: '1.4'
    }
  }
};

export default typography;
