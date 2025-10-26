import { Pressable, PressableProps, StyleSheet, View } from 'react-native';
import { ReactNode } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { radii, spacing } from '@/theme';

type Props = PressableProps & {
    icon: ReactNode;
    title: string;
    subtitle?: string;
};

export const ListRow = ({ icon, title, subtitle, style, ...pressableProps }: Props) => {
    const { palette } = useThemePalette();

    return (
        <Pressable
            {...pressableProps}
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    opacity: pressed ? 0.9 : 1
                },
                typeof style === 'function' ? style({ pressed }) : style
            ]}
        >
            <View style={[styles.iconContainer, { backgroundColor: palette.glass, borderColor: palette.border }]}>
                {icon}
            </View>
            <View style={styles.textContainer}>
                <ThemedText variant="body" tone="primary">
                    {title}
                </ThemedText>
                {subtitle ? (
                    <ThemedText variant="caption" tone="muted" style={styles.subtitle}>
                        {subtitle}
                    </ThemedText>
                ) : null}
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    },
    textContainer: {
        flex: 1,
        marginLeft: spacing.md
    },
    subtitle: {
        marginTop: 4
    }
});
