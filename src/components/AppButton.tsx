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
  style,
  ...pressableProps
}: Props) => {
  const { palette } = useThemePalette();

  const containerStyles = [
    styles.base,
    fullWidth && styles.fullWidth,
    variant === 'primary'
      ? { backgroundColor: palette.primary }
      : {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: palette.border
        },
    style
  ];

  const textTone = variant === 'primary' ? 'inverse' : 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        ...containerStyles,
        pressed &&
          (variant === 'primary'
            ? { backgroundColor: palette.primaryHover }
            : { opacity: 0.85 })
      ]}
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
