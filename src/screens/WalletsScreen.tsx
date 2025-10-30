import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type Wallet = {
    id: string;
    name: string;
    address: string;
};

type SecurityOption = {
    id: string;
    title: string;
    icon: keyof typeof Feather.glyphMap;
};

type Props = {
    onBack: () => void;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    onWalletPress?: (walletId: string) => void;
    onSecurityPress?: (optionId: string) => void;
    userRole?: 'host' | 'attendee';
};

const CONNECTED_WALLETS: Wallet[] = [
    { id: 'metamask', name: 'MetaMask', address: '0x123...456' },
    { id: 'coinbase', name: 'Coinbase Wallet', address: '0x789...012' }
];

const SECURITY_OPTIONS: SecurityOption[] = [
    { id: 'history', title: 'Transaction History', icon: 'clock' },
    { id: 'mfa', title: 'Multi-Factor Authentication', icon: 'shield' },
    { id: 'alerts', title: 'Unusual Activity Alerts', icon: 'bell' }
];

export const WalletsScreen = ({ onBack, onTabSelect, onWalletPress, onSecurityPress, userRole = 'host' }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Wallets"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.content, { paddingBottom: spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Connected Wallets */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Connected Wallets
                    </ThemedText>
                    {CONNECTED_WALLETS.map((wallet) => (
                        <Pressable
                            key={wallet.id}
                            onPress={() => onWalletPress?.(wallet.id)}
                            style={[styles.walletCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <View style={[styles.walletIcon, { backgroundColor: palette.card }]}>
                                <Feather name="credit-card" size={24} color={palette.textPrimary} />
                            </View>
                            <View style={styles.walletInfo}>
                                <ThemedText variant="body" tone="primary" style={styles.walletName}>
                                    {wallet.name}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {wallet.address}
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Security */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Security
                    </ThemedText>
                    {SECURITY_OPTIONS.map((option) => (
                        <Pressable
                            key={option.id}
                            onPress={() => onSecurityPress?.(option.id)}
                            style={[styles.securityCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <View style={[styles.securityIcon, { backgroundColor: palette.card }]}>
                                <Feather name={option.icon} size={24} color={palette.textPrimary} />
                            </View>
                            <ThemedText variant="body" tone="primary" style={styles.securityTitle}>
                                {option.title}
                            </ThemedText>
                            <Feather name="chevron-right" size={20} color={palette.textMuted} />
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            <SmartTabBar
                userRole={userRole}
                activeTab={userRole === 'host' ? 'Profile' : 'Profile'}
                onTabSelect={onTabSelect}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    backButton: {
        padding: spacing.xs
    },
    scrollContainer: {
        flex: 1
    },
    content: {
        paddingHorizontal: spacing.lg
    },
    section: {
        marginBottom: spacing.xl
    },
    sectionTitle: {
        marginBottom: spacing.md
    },
    walletCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.md
    },
    walletIcon: {
        width: 56,
        height: 56,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    walletInfo: {
        flex: 1
    },
    walletName: {
        marginBottom: spacing.xs / 2
    },
    securityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.md
    },
    securityIcon: {
        width: 56,
        height: 56,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    securityTitle: {
        flex: 1
    }
});
