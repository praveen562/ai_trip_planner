/**
 * Naviora Color System
 *
 * The brand palette is pinned by the product brief. Every one of those
 * hexes happens to land exactly on a Tailwind v4 default swatch (blue-600,
 * sky-500, cyan-500, green-500, amber-500, red-500, slate-50, slate-900),
 * so rather than hand-roll a second scale, each brand color below carries
 * its full 50-900 neighborhood from that same family. This keeps the CSS
 * theme (src/styles/tokens.css) and this TS module as one source of truth,
 * both derived from the same swatches.
 */

export const colorPalette = {
  // Primary — Blue. Trust, water, the sky a plane climbs into.
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb', // brand primary
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },

  // Secondary — Sky. Sits one step lighter/brighter than primary.
  secondary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // brand secondary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e'
  },

  // Accent — Cyan. Reserved for highlights, links, active states.
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // brand accent
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63'
  },

  // Neutrals — Slate, matching background/dark exactly.
  neutral: {
    50: '#f8fafc', // brand background
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a' // brand dark
  },

  background: {
    page: '#f8fafc',
    card: '#ffffff',
    dark: '#0f172a',
    elevated: 'rgba(255, 255, 255, 0.72)' // for glass panels
  },

  semantic: {
    success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#22c55e', 700: '#15803d' },
    warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 500: '#f59e0b', 700: '#b45309' },
    error: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 500: '#ef4444', 700: '#b91c1c' },
    info: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 500: '#2563eb', 700: '#1d4ed8' }
  },

  gradients: {
    primary: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
    accent: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
    dark: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
    aurora: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)'
  }
};

export default colorPalette;
