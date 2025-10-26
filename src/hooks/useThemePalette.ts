import { useColorScheme } from 'react-native';
import { palette } from '@/theme/palette';

export const useThemePalette = () => {
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    return {
        palette: isDark ? palette.dark : palette.light,
        isDark
    };
};
