import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';
import { Feather } from '@expo/vector-icons';

type Props = {
    onContinue: () => void;
    step?: number;
    totalSteps?: number;
    blockchain?: string;
    contractAddress?: string;
    totalTickets?: number;
    onTabSelect?: (tab: TabKey) => void;
};

export const DeployingScreen = ({
    onContinue,
    step = 3,
    totalSteps = 4,
    blockchain = 'Ethereum',
    contractAddress = '0x1a2b3c4d5e6f7890',
    totalTickets = 100,
    onTabSelect
}: Props) => {
    const { palette } = useThemePalette();
    const progress = Math.min(step / totalSteps, 1);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <View style={styles.contentWrapper}>
                <View>
                    <View style={styles.headerRow}>
                        <ThemedText variant="body" tone="muted">
                            Step {step} of {totalSteps}
                        </ThemedText>
                        <ThemedText variant="body" tone="primary">
                            event verse
                        </ThemedText>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: palette.glass }]}>
                        <View
                            style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: palette.primary }]}
                        />
                    </View>

                    <View style={styles.heroBlock}>
                        <ThemedText variant="title" tone="primary" style={styles.heroTitle}>
                            Deploying to Blockchain
                        </ThemedText>
                        <ThemedText variant="body" tone="muted">
                            Your NFT tickets are being deployed to the blockchain. This process may take a few minutes.
                        </ThemedText>
                    </View>

                    <View style={styles.cardGroup}>
                        <View style={[styles.cardRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <View style={[styles.iconBadge, { backgroundColor: palette.glass }]}>
                                <Feather name="hexagon" size={20} color={palette.primary} />
                            </View>
                            <View style={styles.cardText}>
                                <ThemedText variant="body" tone="primary">
                                    Blockchain
                                </ThemedText>
                                <ThemedText variant="body" tone="muted">
                                    {blockchain}
                                </ThemedText>
                            </View>
                        </View>
                        <View style={[styles.cardRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <View style={[styles.iconBadge, { backgroundColor: palette.glass }]}>
                                <Feather name="hash" size={20} color={palette.primary} />
                            </View>
                            <View style={styles.cardText}>
                                <ThemedText variant="body" tone="primary">
                                    Contract Address
                                </ThemedText>
                                <ThemedText variant="body" tone="muted">
                                    {contractAddress}
                                </ThemedText>
                            </View>
                        </View>
                        <View style={[styles.cardRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <View style={[styles.iconBadge, { backgroundColor: palette.glass }]}>
                                <Feather name="tag" size={20} color={palette.primary} />
                            </View>
                            <View style={styles.cardText}>
                                <ThemedText variant="body" tone="primary">
                                    Total Tickets
                                </ThemedText>
                                <ThemedText variant="body" tone="muted">
                                    {totalTickets}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </View>

                <AppButton label="View Transaction" onPress={onContinue} />
            </View>

            <TabBarPlaceholder activeTab="Tickets" onTabSelect={onTabSelect} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing['2xl'],
        justifyContent: 'space-between'
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    progressTrack: {
        height: 8,
        borderRadius: radii.pill,
        marginTop: spacing.md,
        marginBottom: spacing['2xl']
    },
    progressFill: {
        height: '100%',
        borderRadius: radii.pill
    },
    heroBlock: {
        gap: spacing.md
    },
    heroTitle: {
        maxWidth: 280
    },
    cardGroup: {
        marginTop: spacing['2xl'],
        gap: spacing.md
    },
    cardRow: {
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardText: {
        marginLeft: spacing.md
    }
});