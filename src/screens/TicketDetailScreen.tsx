import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type TicketDetail = {
    id: string;
    eventTitle: string;
    eventImage: string;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
    ticketType: string;
    ticketNumber: string;
    purchaseDate: string;
    price: string;
    transferable: boolean;
    organizerName: string;
    eventDescription: string;
};

type Props = {
    onBack: () => void;
    onTabSelect?: (tab: TabKey) => void;
    ticket: TicketDetail;
};

export const TicketDetailScreen = ({ onBack, onTabSelect, ticket }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Ticket Details"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.content, { paddingBottom: spacing['2xl'] }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Image */}
                <Image source={{ uri: ticket.eventImage }} style={styles.heroImage} resizeMode="cover" />

                {/* Ticket Card */}
                <View style={[styles.ticketCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                    <View style={styles.ticketHeader}>
                        <View style={[styles.qrPlaceholder, { backgroundColor: palette.card, borderColor: palette.border }]}>
                            <Feather name="maximize" size={48} color={palette.textMuted} />
                        </View>
                    </View>

                    <View style={styles.ticketInfo}>
                        <View style={styles.infoRow}>
                            <ThemedText variant="caption" tone="muted">
                                Ticket Type
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.infoValue}>
                                {ticket.ticketType}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText variant="caption" tone="muted">
                                Ticket Number
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.infoValue}>
                                {ticket.ticketNumber}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText variant="caption" tone="muted">
                                Purchase Date
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.infoValue}>
                                {ticket.purchaseDate}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText variant="caption" tone="muted">
                                Price Paid
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.infoValue}>
                                {ticket.price}
                            </ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText variant="caption" tone="muted">
                                Transferable
                            </ThemedText>
                            <ThemedText variant="body" tone="primary" style={styles.infoValue}>
                                {ticket.transferable ? 'Yes' : 'No'}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Event Details */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Event Details
                    </ThemedText>

                    <View style={[styles.detailCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <Feather name="calendar" size={20} color={palette.primary} />
                        <View style={styles.detailContent}>
                            <ThemedText variant="caption" tone="muted">
                                Date & Time
                            </ThemedText>
                            <ThemedText variant="body" tone="primary">
                                {ticket.eventDate} at {ticket.eventTime}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={[styles.detailCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <Feather name="map-pin" size={20} color={palette.primary} />
                        <View style={styles.detailContent}>
                            <ThemedText variant="caption" tone="muted">
                                Location
                            </ThemedText>
                            <ThemedText variant="body" tone="primary">
                                {ticket.eventLocation}
                            </ThemedText>
                        </View>
                    </View>

                    <View style={[styles.detailCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <Feather name="user" size={20} color={palette.primary} />
                        <View style={styles.detailContent}>
                            <ThemedText variant="caption" tone="muted">
                                Organizer
                            </ThemedText>
                            <ThemedText variant="body" tone="primary">
                                {ticket.organizerName}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* About Event */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        About Event
                    </ThemedText>
                    <ThemedText variant="body" tone="muted" style={styles.description}>
                        {ticket.eventDescription}
                    </ThemedText>
                </View>

                {/* Blockchain Info */}
                <View style={[styles.blockchainCard, { backgroundColor: palette.card, borderColor: palette.border }]}>
                    <Feather name="shield" size={20} color={palette.success} />
                    <View style={styles.blockchainContent}>
                        <ThemedText variant="body" tone="primary" style={styles.blockchainTitle}>
                            Verified on Blockchain
                        </ThemedText>
                        <ThemedText variant="caption" tone="muted">
                            This ticket is secured and verified on the blockchain. View transaction details on explorer.
                        </ThemedText>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.ctaContainer}>
                {ticket.transferable && (
                    <AppButton label="Transfer Ticket" onPress={() => console.log('Transfer ticket')} variant="secondary" />
                )}
                <AppButton label="Add to Wallet" onPress={() => console.log('Add to wallet')} style={styles.addButton} />
            </View>

            <TabBarPlaceholder activeTab="Tickets" onTabSelect={onTabSelect} />
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
        paddingHorizontal: spacing.xl
    },
    heroImage: {
        width: '100%',
        height: 200,
        borderRadius: radii.lg,
        marginBottom: spacing.xl
    },
    ticketCard: {
        borderRadius: radii.lg,
        borderWidth: 1,
        padding: spacing.xl,
        marginBottom: spacing.xl
    },
    ticketHeader: {
        alignItems: 'center',
        marginBottom: spacing.xl,
        paddingBottom: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
        borderStyle: 'dashed'
    },
    qrPlaceholder: {
        width: 160,
        height: 160,
        borderRadius: radii.md,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ticketInfo: {
        gap: spacing.md
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    infoValue: {
        fontWeight: '600'
    },
    section: {
        marginBottom: spacing.xl
    },
    sectionTitle: {
        marginBottom: spacing.lg
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.lg,
        borderRadius: radii.md,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.md
    },
    detailContent: {
        flex: 1
    },
    description: {
        lineHeight: 24
    },
    blockchainCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: spacing.lg,
        borderRadius: radii.md,
        borderWidth: 1,
        gap: spacing.md
    },
    blockchainContent: {
        flex: 1
    },
    blockchainTitle: {
        marginBottom: spacing.xs
    },
    ctaContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        gap: spacing.md
    },
    addButton: {
        marginTop: 0
    }
});
