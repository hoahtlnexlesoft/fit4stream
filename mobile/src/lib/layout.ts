import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints.
 *  - phone  : < 700pt wide (all iPhones / Android phones, foldables folded)
 *  - wide   : ≥ 700pt (iPhone Duo open, Galaxy Fold open, iPad) → two-pane layouts + side rail nav
 *  - compact: short screens (< 720pt tall) → denser spacing
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const wide = width >= 700;
  return { width, height, wide, compact: height < 720, gutter: 16, sideRail: wide ? 104 : 0 };
}
