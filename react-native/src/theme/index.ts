/**
 * Fit4Stream design tokens (dark theme).
 * Values mirror the approved prototype: https://fit4stream.vercel.app
 */
import { Platform, TextStyle } from 'react-native';

export const colors = {
  // surfaces
  bg: '#0F0E14',
  bgDeep: '#0B0A10',
  surface: 'rgba(255,255,255,0.05)',
  surfaceRaised: 'rgba(255,255,255,0.07)',
  surfaceStrong: 'rgba(255,255,255,0.10)',
  surfaceSolid: '#1B1921', // opaque sheets / dialogs
  sheet: '#1B1921',
  border: 'rgba(255,255,255,0.08)',
  borderStrong: 'rgba(255,255,255,0.18)',
  scrim: 'rgba(6,8,12,0.55)',
  glass: 'rgba(10,9,14,0.45)', // overlays on video

  // text
  text: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted: 'rgba(255,255,255,0.50)',
  textSubtle: 'rgba(255,255,255,0.40)',

  // brand + semantic
  primary: '#F4A425',
  primaryPressed: '#D98E14',
  primarySoft: 'rgba(244,164,37,0.14)',
  primaryText: '#F6C26B',
  onPrimary: '#1B1306',
  live: '#E5484D',
  liveText: '#FF7B7A',
  success: '#39C87C',
  successText: '#7FE0A8',
  successSoft: 'rgba(57,200,124,0.14)',
  danger: '#E74645',
  dangerText: '#FF8A80',
  dangerSoft: 'rgba(231,70,69,0.14)',
  info: '#39CAE0',
  infoText: '#7AD9EA',
  infoSoft: 'rgba(57,202,224,0.14)',
  purple: '#A57AD8',
  purpleText: '#D6BCFB',
  purpleSoft: 'rgba(165,122,216,0.22)',

  // roles on stage
  roleHost: '#F4A425',
  roleOrganizer: '#A57AD8',
  roleGuest: '#39CAE0',
  roleYou: '#FFFFFF',

  // brand logo palette
  brandPurple: '#782F8D',
  brandPlum: '#392163',
  brandIndigo: '#33438D',
  brandCyan: '#39CAE0',
  brandCoral: '#E74645',
  brandYellow: '#FACD60',
} as const;

export const spacing = { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 7: 28, 8: 32, 10: 40, 12: 48 } as const;

export const radius = { xs: 6, sm: 10, md: 12, lg: 16, xl: 20, xxl: 24, full: 999 } as const;

/** Minimum touch target */
export const TAP = 44;

/**
 * Font family names after loading Plus Jakarta Sans with expo-font:
 *   useFonts({ PlusJakartaSans_400Regular, ..._600SemiBold, ..._700Bold, ..._800ExtraBold })
 * from @expo-google-fonts/plus-jakarta-sans
 */
export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

const t = (fontFamily: string, fontSize: number, lineHeight: number, letterSpacing = 0): TextStyle => ({ fontFamily, fontSize, lineHeight, letterSpacing, color: colors.text });

export const type = {
  displayXl: t(fonts.extrabold, 34, 40, -0.8),
  displayLg: t(fonts.bold, 28, 34, -0.6),
  titleLg: t(fonts.bold, 22, 28, -0.3),
  titleMd: t(fonts.bold, 18, 24, -0.2),
  titleSm: t(fonts.semibold, 15, 20),
  body: t(fonts.regular, 15, 22),
  bodyStrong: t(fonts.semibold, 15, 22),
  label: t(fonts.semibold, 14, 18),
  caption: t(fonts.regular, 12.5, 17),
  captionStrong: t(fonts.semibold, 12.5, 17),
  micro: t(fonts.bold, 10.5, 14, 0.4),
  price: t(fonts.extrabold, 20, 26, -0.3),
  mono: { ...t(fonts.semibold, 12.5, 16), fontVariant: ['tabular-nums'] } as TextStyle,
} as const;

export const shadow = {
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 8 } },
    default: { elevation: 6 },
  }),
  float: Platform.select({
    ios: { shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 16 } },
    default: { elevation: 12 },
  }),
  glow: Platform.select({
    ios: { shadowColor: colors.primary, shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
    default: { elevation: 8 },
  }),
} as const;

export const motion = { fast: 120, base: 220, slow: 360, pressScale: 0.97 } as const;

export const theme = { colors, spacing, radius, fonts, type, shadow, motion, TAP };
export type Theme = typeof theme;
export default theme;
