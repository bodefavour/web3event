import { View, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

export type ScreenHeaderProps = {
  title: string;
  leftSlot?: ReactNode;
};

export const ScreenHeader = ({ title, leftSlot }: ScreenHeaderProps) => {
  const { palette } = useThemePalette();

  return (
    <View style={styles.container}>
      <View style={styles.leftSlot}>{leftSlot}</View>
      <ThemedText variant="heading" tone="primary" style={[styles.title, { color: palette.textPrimary }]}>
        {title}
      </ThemedText>
      <View style={styles.rightSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg
  },
  leftSlot: {
    width: 48,
    height: 48,
    justifyContent: 'center'
  },
  rightSpacer: {
    width: 48
  },
  title: {
    textAlign: 'center'
  }
});
