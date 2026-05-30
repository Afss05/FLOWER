/**
 * Premium Design System
 * MNC-level SaaS aesthetic
 */

export const colors = {
  primary: {
    50: "#F8F6FF",
    100: "#F3EDFF",
    200: "#E6D9FF",
    300: "#D4C1FF",
    400: "#B8A3FF",
    500: "#9B85FF",
    600: "#7E67FF",
    700: "#6149FF",
    800: "#4A2DFF",
    900: "#3311FF",
    950: "#0F172A", // Dark Navy - Main Primary
  },
  secondary: {
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
  },
  accent: {
    50: "#FDF2F8",
    100: "#FCE7F3",
    200: "#FBCFE8",
    300: "#F8A3D9",
    400: "#F472B6",
    500: "#EC4899",
    600: "#DB2777",
    700: "#BE185D",
    800: "#9D174D",
    900: "#831843",
    950: "#E11D48", // Rose - Main Accent
  },
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
};

export const typography = {
  fontFamily: {
    heading: "'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI'",
    body: "'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI'",
    mono: "'JetBrains Mono', 'Menlo', 'monospace'",
  },
  fontSize: {
    xs: { size: "12px", lineHeight: "16px", weight: 500 },
    sm: { size: "14px", lineHeight: "20px", weight: 500 },
    base: { size: "16px", lineHeight: "24px", weight: 400 },
    lg: { size: "18px", lineHeight: "28px", weight: 500 },
    xl: { size: "20px", lineHeight: "28px", weight: 500 },
    "2xl": { size: "24px", lineHeight: "32px", weight: 600 },
    "3xl": { size: "30px", lineHeight: "36px", weight: 700 },
    "4xl": { size: "36px", lineHeight: "44px", weight: 700 },
    "5xl": { size: "48px", lineHeight: "56px", weight: 700 },
    "6xl": { size: "60px", lineHeight: "72px", weight: 700 },
  },
};

export const spacing = {
  0: "0",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  7: "28px",
  8: "32px",
  9: "36px",
  10: "40px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px",
  24: "96px",
  28: "112px",
  32: "128px",
};

export const borderRadius = {
  none: "0",
  sm: "8px",
  base: "12px",
  md: "16px",
  lg: "20px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "40px",
  full: "9999px",
};

export const shadows = {
  none: "none",
  xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
  sm: "0 2px 4px rgba(15, 23, 42, 0.06)",
  base: "0 4px 6px rgba(15, 23, 42, 0.1)",
  md: "0 8px 12px rgba(15, 23, 42, 0.12)",
  lg: "0 12px 20px rgba(15, 23, 42, 0.15)",
  xl: "0 20px 32px rgba(15, 23, 42, 0.2)",
  "2xl": "0 32px 48px rgba(15, 23, 42, 0.25)",
  inner: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
};

export const animations = {
  duration: {
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
    slower: "500ms",
  },
  timing: {
    linear: "linear",
    ease: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    easeIn: "cubic-bezier(0.42, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.58, 1)",
    easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
  },
};

export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

/**
 * Component-specific tokens
 */
export const components = {
  button: {
    base: {
      padding: "12px 20px",
      borderRadius: "16px",
      fontSize: "16px",
      fontWeight: "500",
      transition: `all ${animations.duration.normal} ${animations.timing.easeOut}`,
      cursor: "pointer",
    },
    primary: {
      background: colors.primary[950],
      color: colors.white,
      hover: `hover:bg-gray-900`,
      active: `active:scale-95`,
    },
    secondary: {
      background: colors.secondary[100],
      color: colors.secondary[900],
      hover: `hover:bg-gray-200`,
    },
    accent: {
      background: colors.accent[950],
      color: colors.white,
      hover: `hover:bg-rose-700`,
    },
  },
  card: {
    borderRadius: "24px",
    shadow: shadows.base,
    padding: "24px",
    transition: `all ${animations.duration.normal} ${animations.timing.easeOut}`,
    hover: `hover:shadow-lg hover:scale-102`,
  },
  input: {
    borderRadius: "16px",
    padding: "12px 16px",
    border: `1px solid ${colors.secondary[200]}`,
    fontSize: "16px",
    transition: `all ${animations.duration.normal} ${animations.timing.easeOut}`,
  },
  modal: {
    borderRadius: "32px",
    shadow: shadows["2xl"],
  },
};
