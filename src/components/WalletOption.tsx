import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { radii, spacing } from '@/theme';

export type WalletOptionProps = {
  label: string;
  accentColor: string;
  onPress: () => void;
};

export const WalletOption = ({ label, accentColor, onPress }: WalletOptionProps) => {
  const { palette } = useThemePalette();
  const initials = label.charAt(0).toUpperCase();

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
          opacity: pressed ? 0.9 : 1
        }
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: accentColor }]}>
        <ThemedText variant="subtitle" tone="inverse">
          {initials}
        </ThemedText>
      </View>
      <ThemedText variant="body" tone="primary" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginLeft: spacing.md
  }
});
