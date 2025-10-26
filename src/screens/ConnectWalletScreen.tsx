import { SafeAreaView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { WalletOption } from '@/components/WalletOption';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

const walletOptions = [
  { label: 'MetaMask', accentColor: '#FF6A1A' },
  { label: 'WalletConnect', accentColor: '#4050F4' },
  { label: 'Coinbase Wallet', accentColor: '#1652F0' },
  { label: 'Trust Wallet', accentColor: '#2D74FF' },
  { label: 'Phantom', accentColor: '#6E4CFF' }
] as const;

type Props = {
  onBack: () => void;
  onSelectWallet: (wallet: string) => void;
};

export const ConnectWalletScreen = ({ onBack, onSelectWallet }: Props) => {
  const { palette } = useThemePalette();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar style="light" />
      <ScreenHeader
        title="Connect Wallet"
        leftSlot={
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <ThemedText variant="title" tone="primary">
              {'<'}
            </ThemedText>
          </Pressable>
        }
      />

      <View style={styles.content}>
        <ThemedText variant="heading" tone="primary">
          Connect your wallet
        </ThemedText>
        <ThemedText variant="body" tone="muted" style={styles.subheading}>
          Connect your wallet to access your event verse tickets and manage your events.
        </ThemedText>

        <View style={styles.optionsArea}>
          {walletOptions.map(({ label, accentColor }) => (
            <View key={label} style={styles.optionWrapper}>
              <WalletOption
                label={label}
                accentColor={accentColor}
                onPress={() => onSelectWallet(label)}
              />
            </View>
          ))}
        </View>

        <ThemedText variant="caption" tone="muted" style={styles.footnote}>
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  backButton: {
    paddingVertical: spacing.xs
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl
  },
  subheading: {
    marginTop: spacing.sm
  },
  optionsArea: {
    marginTop: spacing['2xl']
  },
  optionWrapper: {
    marginTop: spacing.md
  },
  footnote: {
    textAlign: 'center',
    marginTop: spacing['2xl'],
    paddingHorizontal: spacing.lg
  }
});
