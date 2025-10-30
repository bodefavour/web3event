import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type HostEvent = {
    id: string;
    title: string;
    date: string;
    image: string;
    status: 'upcoming' | 'past';
};

type Props = {
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    onCreateEvent?: () => void;
    onViewAnalytics?: () => void;
    onManageEvent?: (eventId: string) => void;
};

const MY_EVENTS: HostEvent[] = [
    {
        id: 'tech-summit',
        title: 'Tech Summit 2024',
        date: 'Oct 15 - 17, 2024',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        status: 'upcoming'
    },
    {
        id: 'music-fest',
        title: 'Music Festival 2023',
        date: 'Jul 22 - 24, 2023',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80',
        status: 'past'
    }
];

export const HostDashboardScreen = ({ onTabSelect, onCreateEvent, onViewAnalytics, onManageEvent }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
                <Pressable style={styles.menuButton}>
                    <Feather name="menu" size={24} color={palette.textPrimary} />
                </Pressable>
                <ThemedText variant="heading" tone="primary">
                    Dashboard
                </ThemedText>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.content, { paddingBottom: spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                {/* My Events Section */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        My Events
                    </ThemedText>

                    {/* Upcoming Events */}
                    <ThemedText variant="caption" tone="muted" style={styles.subsectionLabel}>
                        Upcoming
                    </ThemedText>
                    {MY_EVENTS.filter((e) => e.status === 'upcoming').map((event) => (
                        <View
                            key={event.id}
                            style={[styles.eventCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
                            <View style={styles.eventDetails}>
                                <ThemedText variant="body" tone="primary" style={styles.eventTitle}>
                                    {event.title}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {event.date}
                                </ThemedText>
                                <Pressable
                                    onPress={() => onManageEvent?.(event.id)}
                                    style={[styles.manageButton, { backgroundColor: palette.card }]}
                                >
                                    <ThemedText variant="body" tone="primary">
                                        Manage
                                    </ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    ))}

                    {/* Past Events */}
                    <ThemedText variant="caption" tone="muted" style={[styles.subsectionLabel, styles.pastLabel]}>
                        Past
                    </ThemedText>
                    {MY_EVENTS.filter((e) => e.status === 'past').map((event) => (
                        <View
                            key={event.id}
                            style={[styles.eventCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
                            <View style={styles.eventDetails}>
                                <ThemedText variant="body" tone="primary" style={styles.eventTitle}>
                                    {event.title}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {event.date}
                                </ThemedText>
                                <Pressable
                                    onPress={() => onManageEvent?.(event.id)}
                                    style={[styles.manageButton, { backgroundColor: palette.card }]}
                                >
                                    <ThemedText variant="body" tone="primary">
                                        Manage
                                    </ThemedText>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Ticket Sales Section */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Ticket Sales
                    </ThemedText>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <ThemedText variant="body" tone="muted" style={styles.statLabel}>
                                Total Tickets Sold
                            </ThemedText>
                            <ThemedText variant="display" tone="primary" style={styles.statValue}>
                                1,250
                            </ThemedText>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <ThemedText variant="body" tone="muted" style={styles.statLabel}>
                                Revenue
                            </ThemedText>
                            <ThemedText variant="display" tone="primary" style={styles.statValue}>
                                $50,000
                            </ThemedText>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Quick Actions
                    </ThemedText>
                    <View style={styles.actionsRow}>
                        <AppButton label="Create Event" onPress={onCreateEvent} style={styles.actionButton} />
                        <AppButton
                            label="View Analytics"
                            onPress={onViewAnalytics}
                            variant="secondary"
                            style={styles.actionButton}
                        />
                    </View>
                </View>
            </ScrollView>

            <SmartTabBar userRole="host" activeTab="Dashboard" onTabSelect={onTabSelect} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingTop: spacing.sm
    },
    menuButton: {
        padding: spacing.xs
    },
    placeholder: {
        width: 40
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
    subsectionLabel: {
        marginBottom: spacing.sm,
        marginTop: spacing.xs
    },
    pastLabel: {
        marginTop: spacing.lg
    },
    eventCard: {
        flexDirection: 'row',
        borderRadius: radii.lg,
        borderWidth: 1,
        overflow: 'hidden',
        marginBottom: spacing.md
    },
    eventImage: {
        width: 120,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    eventDetails: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between'
    },
    eventTitle: {
        marginBottom: spacing.xs / 2
    },
    manageButton: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.md,
        marginTop: spacing.xs
    },
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md
    },
    statCard: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1
    },
    statLabel: {
        marginBottom: spacing.sm
    },
    statValue: {
        fontSize: 32
    },
    actionsRow: {
        flexDirection: 'row',
        gap: spacing.md
    },
    actionButton: {
        flex: 1
    }
});
