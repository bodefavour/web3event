const light = {
    background: '#FFFFFF',
    surface: '#F5F7FA',
    textPrimary: '#101828',
    textSecondary: '#475467',
    accent: '#7F56D9'
};

const dark = {
    background: '#070417',
    surface: '#14121F',
    textPrimary: '#F2F4F7',
    textSecondary: '#D0D5DD',
    accent: '#9E77ED'
};

export const palette = {
    light,
    dark
};

export type ThemePalette = typeof palette.light;
