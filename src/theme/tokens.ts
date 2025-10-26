export const spacing = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48
} as const;

export type SpacingToken = keyof typeof spacing;

export const radii = {
    sm: 8,
    md: 12,
    lg: 24,
    pill: 999
} as const;

export type RadiusToken = keyof typeof radii;
