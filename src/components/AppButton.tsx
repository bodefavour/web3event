import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { radii, spacing } from '@/theme';

type ButtonVariant = 'primary' | 'secondary';

type Props = PressableProps & {
    label: string;
    variant?: ButtonVariant;
    fullWidth?: boolean;
};

export const AppButton = ({
    label,
    variant = 'primary',
    fullWidth = true,
    style: styleProp,
    ...pressableProps
}: Props) => {
    const { palette } = useThemePalette();

    const textTone = variant === 'primary' ? 'inverse' : 'primary';

    const resolvedStyle: PressableProps['style'] = ({ pressed }) => {
        const baseStyles = [
            styles.base,
            fullWidth && styles.fullWidth,
            variant === 'primary'
                ? { backgroundColor: pressed ? palette.primaryHover : palette.primary }
                : {
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: palette.border,
                        opacity: pressed ? 0.85 : 1
                    }
        ];

        const customStyle =
            typeof styleProp === 'function' ? styleProp({ pressed }) : styleProp;

        return [...baseStyles, customStyle];
    };

    return (
        <Pressable
            accessibilityRole="button"
            style={resolvedStyle}
            {...pressableProps}
        >
            <ThemedText variant="button" tone={textTone}>
                {label}
            </ThemedText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: radii.pill,
        paddingVertical: 16,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center'
    },
    fullWidth: {
        alignSelf: 'stretch'
    }
});
