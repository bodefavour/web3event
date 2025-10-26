import { Text, TextProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useThemePalette } from '@/hooks/useThemePalette';
import { typography, TypographyVariant } from '@/theme';

type Tone = 'primary' | 'muted' | 'inverse';

type Props = TextProps & {
    variant?: TypographyVariant;
    tone?: Tone;
    children: ReactNode;
};

export const ThemedText = ({
    variant = 'body',
    tone = 'primary',
    style,
    children,
    ...textProps
}: Props) => {
    const { palette } = useThemePalette();

    const color =
        tone === 'muted'
            ? palette.textMuted
            : tone === 'inverse'
            ? palette.textOnPrimary
            : palette.textPrimary;

    return (
        <Text
            {...textProps}
            style={[
                styles.base,
                typography[variant],
                { color },
                style
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: 'Inter_400Regular'
    }
});
