import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

type Props = {
    onViewTicket: () => void;
    onTabSelect?: (tab: TabKey) => void;
    ticketQuantity?: number;
    eventTitle?: string;
};

export const TransactionSuccessScreen = ({ onViewTicket, onTabSelect, ticketQuantity = 1, eventTitle }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: palette.success + '20' }]}>
                        <Feather name="check-circle" size={64} color={palette.success} />
                    </View>
                </View>

                <ThemedText variant="display" tone="primary" style={styles.title}>
                    Transaction Successful!
                </ThemedText>

                <ThemedText variant="body" tone="muted" style={styles.description}>
                    Your {ticketQuantity > 1 ? 'tickets have' : 'ticket has'} been successfully purchased and added to your wallet.
                </ThemedText>

                {eventTitle && (
                    <View style={[styles.eventCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <Feather name="tag" size={24} color={palette.primary} style={styles.eventIcon} />
                        <View style={styles.eventInfo}>
                            <ThemedText variant="caption" tone="muted">
                                Event
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.eventTitle}>
                                {eventTitle}
                            </ThemedText>
                            <ThemedText variant="body" tone="muted">
                                {ticketQuantity} {ticketQuantity > 1 ? 'tickets' : 'ticket'}
                            </ThemedText>
                        </View>
                    </View>
                )}

                <View style={styles.infoBox}>
                    <Feather name="info" size={20} color={palette.textMuted} />
                    <ThemedText variant="caption" tone="muted" style={styles.infoText}>
                        Your tickets are stored securely on the blockchain. You can view and manage them anytime from your Tickets tab.
                    </ThemedText>
                </View>
            </View>

            <View style={styles.ctaContainer}>
                <AppButton label="View Ticket" onPress={onViewTicket} />
            </View>

            <TabBarPlaceholder activeTab="Tickets" onTabSelect={onTabSelect} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing['2xl'] * 1.5,
        alignItems: 'center'
    },
    iconContainer: {
        marginBottom: spacing['2xl']
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.lg
    },
    description: {
        textAlign: 'center',
        marginBottom: spacing['2xl'],
        paddingHorizontal: spacing.lg
    },
    eventCard: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderRadius: 12,
        borderWidth: 1,
        width: '100%',
        marginBottom: spacing.xl
    },
    eventIcon: {
        marginRight: spacing.md
    },
    eventInfo: {
        flex: 1
    },
    eventTitle: {
        marginTop: spacing.xs,
        marginBottom: spacing.xs
    },
    infoBox: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        gap: spacing.md
    },
    infoText: {
        flex: 1,
        lineHeight: 20
    },
    ctaContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg
    }
});
