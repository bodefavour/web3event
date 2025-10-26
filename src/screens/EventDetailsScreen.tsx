import { SafeAreaView, ScrollView, StyleSheet, View, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

export type EventTicketTier = {
    id: string;
    label: string;
    description: string;
    price: string;
};

export type EventDetail = {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    heroImage: string;
    organizerName: string;
    organizerCompany: string;
    organizerAvatar: string;
    ticketTiers: EventTicketTier[];
    category?: string;
};

type Props = {
    onBack: () => void;
    onBuyTickets: (tier?: EventTicketTier) => void;
    event?: EventDetail;
    onTabSelect?: (tab: TabKey) => void;
};

const DEFAULT_EVENT: EventDetail = {
    id: 'default',
    title: 'Web3 Tech Innovators Summit',
    description:
        'Join us for an immersive summit exploring the latest trends in technology and web3, featuring keynote speakers, workshops, and networking opportunities.',
    date: 'October 26, 2024',
    time: '9:00 AM - 5:00 PM',
    location: 'Innovation Hub, 123 Tech Drive, San Francisco, CA',
    heroImage: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    organizerName: 'Organized by',
    organizerCompany: 'Tech Events Co.',
    organizerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80',
    ticketTiers: [
        {
            id: 'general',
            label: 'General Admission',
            description: 'Access to all sessions and workshops',
            price: '$199'
        },
        {
            id: 'vip',
            label: 'VIP Pass',
            description: 'Includes VIP lounge access and exclusive networking',
            price: '$399'
        }
    ],
    category: 'Tech Conference'
};

export const EventDetailsScreen = ({ onBack, onBuyTickets, event, onTabSelect }: Props) => {
    const { palette } = useThemePalette();
    const currentEvent = event ?? DEFAULT_EVENT;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Event Details"
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
                <Image
                    source={{ uri: currentEvent.heroImage }}
                    style={[styles.heroImage, { borderColor: palette.border }]}
                />

                <View style={styles.sectionSpacing}>
                    <ThemedText variant="title" tone="primary">
                        {currentEvent.title}
                    </ThemedText>
                    <ThemedText variant="body" tone="muted" style={styles.bodySpacing}>
                        {currentEvent.description}
                    </ThemedText>
                </View>

                <View style={styles.sectionSpacing}>
                    <ThemedText variant="subtitle" tone="primary" style={styles.sectionHeading}>
                        Date and Time
                    </ThemedText>
                    <ThemedText variant="body" tone="primary">
                        {currentEvent.date} · {currentEvent.time}
                    </ThemedText>
                </View>

                <View style={styles.sectionSpacing}>
                    <ThemedText variant="subtitle" tone="primary" style={styles.sectionHeading}>
                        Location
                    </ThemedText>
                    <ThemedText variant="body" tone="primary">
                        {currentEvent.location}
                    </ThemedText>
                </View>

                <View style={styles.sectionSpacing}>
                    <ThemedText variant="subtitle" tone="primary" style={styles.sectionHeading}>
                        Organizer
                    </ThemedText>
                    <View style={styles.organizerRow}>
                        <Image
                            source={{ uri: currentEvent.organizerAvatar }}
                            style={[styles.organizerAvatar, { borderColor: palette.border }]}
                        />
                        <View>
                            <ThemedText variant="body" tone="primary">
                                {currentEvent.organizerName}
                            </ThemedText>
                            <ThemedText variant="body" tone="muted">
                                {currentEvent.organizerCompany}
                            </ThemedText>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionSpacing}>
                    <ThemedText variant="subtitle" tone="primary" style={styles.sectionHeading}>
                        Tickets
                    </ThemedText>
                    {currentEvent.ticketTiers.map((tier) => (
                        <View key={tier.id} style={[styles.ticketCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <View style={styles.ticketText}>
                                <ThemedText variant="body" tone="primary">
                                    {tier.label}
                                </ThemedText>
                                <ThemedText variant="body" tone="muted">
                                    {tier.description}
                                </ThemedText>
                            </View>
                            <ThemedText variant="body" tone="primary">
                                {tier.price}
                            </ThemedText>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.ctaContainer}>
                <AppButton label="Buy Tickets" onPress={() => onBuyTickets(currentEvent.ticketTiers[0])} />
            </View>

            <TabBarPlaceholder activeTab="Events" onTabSelect={onTabSelect} />
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
        height: 220,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.lg
    },
    sectionSpacing: {
        marginBottom: spacing['2xl']
    },
    bodySpacing: {
        marginTop: spacing.sm
    },
    sectionHeading: {
        marginBottom: spacing.xs
    },
    organizerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md
    },
    organizerAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1
    },
    ticketCard: {
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    ticketText: {
        flex: 1,
        marginRight: spacing.md
    },
    ctaContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg
    }
});