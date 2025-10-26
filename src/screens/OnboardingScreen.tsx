import { SafeAreaView, StyleSheet, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { radii, spacing } from '@/theme';

type Props = {
    onConnectWallet: () => void;
    onExploreEvents: () => void;
};

export const OnboardingScreen = ({ onConnectWallet, onExploreEvents }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <View style={styles.container}>
                <View>
                    <View style={styles.topRow}>
                        <ThemedText variant="subtitle" tone="primary">
                            event verse
                        </ThemedText>
                        <Pressable
                            accessibilityRole="button"
                            onPress={onConnectWallet}
                            style={({ pressed }) => [
                                styles.walletPill,
                                {
                                    backgroundColor: palette.glass,
                                    borderColor: palette.border,
                                    opacity: pressed ? 0.85 : 1
                                }
                            ]}
                        >
                            <ThemedText variant="caption" tone="primary">
                                Connect Wallet
                            </ThemedText>
                        </Pressable>
                    </View>

                    <View style={styles.heroContainer}>
                        <LinearGradient
                            colors={palette.heroGradient}
                            start={{ x: 0.2, y: 0.1 }}
                            end={{ x: 0.8, y: 0.9 }}
                            style={styles.heroBlob}
                        />
                        <View style={[styles.heroShadow, { backgroundColor: palette.heroShadow }]} />
                    </View>

                    <View style={styles.copyBlock}>
                        <ThemedText variant="display" tone="primary">
                            {`Discover & Host\nWeb3 Events`}
                        </ThemedText>
                        <ThemedText variant="body" tone="muted" style={styles.subheading}>
                            Experience decentralized ticketing with NFT ownership.
                        </ThemedText>
                    </View>
                </View>

                <View style={styles.footer}>
                    <AppButton label="Connect wallet" onPress={onConnectWallet} />
                    <AppButton
                        label="Explore Events"
                        variant="secondary"
                        style={styles.secondaryButton}
                        onPress={onExploreEvents}
                    />
                    <View style={[styles.homeIndicator, { backgroundColor: palette.border }]} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        paddingBottom: spacing['2xl']
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    walletPill: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: radii.pill,
        borderWidth: 1
    },
    heroContainer: {
        alignItems: 'center',
        marginTop: spacing['2xl']
    },
    heroBlob: {
        width: 264,
        height: 264,
        borderRadius: 132,
        transform: [{ scale: 1.02 }]
    },
    heroShadow: {
        width: 220,
        height: 40,
        opacity: 0.5,
        borderRadius: radii.pill,
        marginTop: -24
    },
    copyBlock: {
        marginTop: spacing.xl
    },
    subheading: {
        marginTop: spacing.md,
        maxWidth: 280
    },
    footer: {},
    secondaryButton: {
        marginTop: spacing.sm
    },
    homeIndicator: {
        height: 5,
        borderRadius: radii.pill,
        alignSelf: 'center',
        width: 134,
        marginTop: spacing.lg
    }
});
