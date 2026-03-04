import { Platform } from "react-native";

/** Base spacing scale (in logical pixels) */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
} as const;

/** Font sizes */
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 72,
} as const;

/** Border radii */
export const radii = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

/** Tab bar height (platform default) */
export const tabBarHeight = Platform.select({ ios: 49, default: 56 });

/**
 * Get panel dimensions from current screen size.
 * Use in components with useWindowDimensions() for rotation support.
 */
export function getPanelDimensions(screenWidth: number, screenHeight: number) {
  const inset = Math.max(spacing.lg, screenWidth * 0.04);
  const maxW = Math.min(400, screenWidth - inset * 2);
  const minW = Math.min(280, screenWidth - inset * 2);
  return {
    panelWidth: Math.max(minW, Math.min(maxW, screenWidth - inset * 2)),
    panelHeight: Math.min(screenHeight * 0.9, screenHeight - inset * 2),
    horizontalPadding: inset,
    contentPadding: Math.max(spacing.lg, screenWidth * 0.08),
  };
}
