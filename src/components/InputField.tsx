import { forwardRef } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { useThemePalette } from '@/hooks/useThemePalette';
import { radii, spacing } from '@/theme';

type Props = TextInputProps;

export const InputField = forwardRef<TextInput, Props>(function InputField(props, ref) {
  const { palette } = useThemePalette();

  return (
    <TextInput
      ref={ref}
      placeholderTextColor={palette.textMuted}
      style={[
        styles.input,
        {
          backgroundColor: palette.card,
          borderColor: palette.border,
          color: palette.textPrimary
        },
        props.style
      ]}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    borderRadius: radii.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 16
  }
});
