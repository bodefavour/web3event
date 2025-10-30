export type ThemePalette = {
    background: string;
    surface: string;
    card: string;
    textPrimary: string;
    textMuted: string;
    textOnPrimary: string;
    primary: string;
    primaryHover: string;
    border: string;
    glass: string;
    heroGradient: readonly [string, string];
    heroShadow: string;
    success: string;
};

const light: ThemePalette = {
    background: '#F8FAFF',
    surface: '#FFFFFF',
    card: '#F1F5FF',
    textPrimary: '#101828',
    textMuted: '#475467',
    textOnPrimary: '#FFFFFF',
    primary: '#3F5CFF',
    primaryHover: '#536EFF',
    border: 'rgba(16, 24, 40, 0.12)',
    glass: 'rgba(16, 24, 40, 0.04)',
    heroGradient: ['rgba(137, 108, 255, 0.95)', 'rgba(137, 108, 255, 0.45)'] as const,
    heroShadow: 'rgba(137, 108, 255, 0.32)',
    success: '#10B981'
};

const dark: ThemePalette = {
    background: '#05020E',
    surface: '#080418',
    card: '#101024',
    textPrimary: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.64)',
    textOnPrimary: '#FFFFFF',
    primary: '#3F5CFF',
    primaryHover: '#536EFF',
    border: 'rgba(255, 255, 255, 0.16)',
    glass: 'rgba(255, 255, 255, 0.06)',
    heroGradient: ['rgba(123, 92, 255, 0.9)', 'rgba(123, 92, 255, 0.35)'] as const,
    heroShadow: 'rgba(46, 17, 120, 0.55)',
    success: '#10B981'
};

export const palette = {
    light,
    dark
};
