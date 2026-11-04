import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme';
import { ICON_PATHS, FILLED_BY_DEFAULT, IconName } from './paths';

export type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  /** Fill the shape (e.g. liked heart, rated star). Defaults per icon. */
  filled?: boolean;
  strokeWidth?: number;
  accessibilityLabel?: string;
};

/** Line icon set used across Fit4Stream (24×24 grid, 1.75 stroke, round caps). */
export function Icon({ name, size = 20, color = colors.text, filled, strokeWidth = 1.75, accessibilityLabel }: IconProps) {
  const fill = filled ?? FILLED_BY_DEFAULT[name] ?? false;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : 'none'} stroke={color} strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" accessibilityLabel={accessibilityLabel} accessible={!!accessibilityLabel}>
      {ICON_PATHS[name].map((d, i) => <Path key={i} d={d} />)}
    </Svg>
  );
}

export type { IconName };
