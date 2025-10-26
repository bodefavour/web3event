import { Text, TextProps, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useThemePalette } from '@/hooks/useThemePalette';

type ThemedTextVariant = 'title' | 'subtitle' | 'body' | 'caption';

type Props = TextProps & {
    variant?: ThemedTextVariant;
    children: ReactNode;
};

const variantStyles: Record<ThemedTextVariant, { fontSize: number; fontWeight: '400' | '600' | '700'; }> = {
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { fontSize: 20, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 13, fontWeight: '400' }
};

export const ThemedText = ({ variant, style, children, ...textProps }: Props) => {
    const { palette } = useThemePalette();
    const resolvedVariant: ThemedTextVariant = variant ?? 'body';

    return (
        <Text
            {...textProps}
            style={[
                styles.base,
                { color: palette.textPrimary },
                variantStyles[resolvedVariant],
                style
            ]}
        >
            {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    base: {
        fontFamily: 'System'
    }
});
