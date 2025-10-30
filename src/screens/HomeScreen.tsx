import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, TextInput, Image, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type EventCard = {
    id: string;
    title: string;
    date: string;
    image: string;
};

type TicketCard = {
    id: string;
    ticketNumber: string;
    eventTitle: string;
    thumbnail: string;
};

type Props = {
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    onEventSelect?: (eventId: string) => void;
    onTicketSelect?: (ticketId: string) => void;
    userRole: 'host' | 'attendee';
    onSwitchRole?: () => void;
};

const UPCOMING_EVENTS: EventCard[] = [
    {
        id: 'live-music',
        title: 'Live Music Festival',
        date: 'Jul 15, 2024',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'modern-art',
        title: 'Modern Art Show',
        date: 'Aug 22, 2024',
        image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01fa0f2?auto=format&fit=crop&w=800&q=80'
    }
];

const MY_TICKETS_DATA: TicketCard[] = [
    {
        id: 'ticket-1234',
        ticketNumber: '#1234',
        eventTitle: 'Live Music Festival',
        thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=200&q=80'
    },
    {
        id: 'ticket-5643',
        ticketNumber: '#5643',
        eventTitle: 'Modern Art Showca',
        thumbnail: 'https://images.unsplash.com/photo-1577083552431-6e5fd01fa0f2?auto=format&fit=crop&w=200&q=80'
    }
];

const RECOMMENDED_EVENTS: EventCard[] = [
    {
        id: 'indie-rock',
        title: 'Indie Rock Night',
        date: 'Jul 20, 2024',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'digital-art',
        title: 'Digital Art Workshop',
        date: 'Aug 5, 2024',
        image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80'
    }
];

export const HomeScreen = ({ onTabSelect, onEventSelect, onTicketSelect, userRole, onSwitchRole }: Props) => {
    const { palette } = useThemePalette();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'today' | 'tomorrow' | 'week'>('today');

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />

            {/* Header */}
            <View style={[styles.header, { paddingHorizontal: spacing.lg }]}>
                <ThemedText variant="heading" tone="primary">
                    My Events
                </ThemedText>
                <Pressable onPress={onSwitchRole} style={styles.switchButton}>
                    <Feather name="repeat" size={20} color={palette.primary} />
                    <ThemedText variant="caption" style={{ color: palette.primary }}>
                        {userRole === 'attendee' ? 'Host' : 'Attend'}
                    </ThemedText>
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.content, { paddingBottom: spacing.lg }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                    <Feather name="search" size={20} color={palette.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: palette.textPrimary }]}
                        placeholder="Search events"
                        placeholderTextColor={palette.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filtersRow}>
                    <Pressable
                        onPress={() => setActiveFilter('today')}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: activeFilter === 'today' ? palette.primary : palette.surface,
                                borderColor: palette.border
                            }
                        ]}
                    >
                        <ThemedText
                            variant="body"
                            style={{
                                color: activeFilter === 'today' ? palette.textOnPrimary : palette.textPrimary
                            }}
                        >
                            Today
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveFilter('tomorrow')}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: activeFilter === 'tomorrow' ? palette.primary : palette.surface,
                                borderColor: palette.border
                            }
                        ]}
                    >
                        <ThemedText
                            variant="body"
                            style={{
                                color: activeFilter === 'tomorrow' ? palette.textOnPrimary : palette.textPrimary
                            }}
                        >
                            Tomorrow
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveFilter('week')}
                        style={[
                            styles.filterChip,
                            {
                                backgroundColor: activeFilter === 'week' ? palette.primary : palette.surface,
                                borderColor: palette.border
                            }
                        ]}
                    >
                        <ThemedText
                            variant="body"
                            style={{
                                color: activeFilter === 'week' ? palette.textOnPrimary : palette.textPrimary
                            }}
                        >
                            This week
                        </ThemedText>
                    </Pressable>
                </View>

                {/* Upcoming Events */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Upcoming Events
                    </ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {UPCOMING_EVENTS.map((event) => (
                            <Pressable
                                key={event.id}
                                onPress={() => onEventSelect?.(event.id)}
                                style={[styles.eventCard, { backgroundColor: palette.card, borderColor: palette.border }]}
                            >
                                <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
                                <View style={styles.eventInfo}>
                                    <ThemedText variant="body" tone="primary" numberOfLines={2}>
                                        {event.title}
                                    </ThemedText>
                                    <ThemedText variant="caption" tone="muted">
                                        {event.date}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* My Tickets */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        My Tickets
                    </ThemedText>
                    {MY_TICKETS_DATA.map((ticket) => (
                        <Pressable
                            key={ticket.id}
                            onPress={() => onTicketSelect?.(ticket.id)}
                            style={[styles.ticketRow, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <Image source={{ uri: ticket.thumbnail }} style={styles.ticketThumbnail} resizeMode="cover" />
                            <View style={styles.ticketInfo}>
                                <ThemedText variant="body" tone="primary" style={styles.ticketNumber}>
                                    NFT Ticket {ticket.ticketNumber}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {ticket.eventTitle}
                                </ThemedText>
                            </View>
                            <Feather name="chevron-right" size={20} color={palette.textMuted} />
                        </Pressable>
                    ))}
                </View>

                {/* Recommended Events */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Recommended Events
                    </ThemedText>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        {RECOMMENDED_EVENTS.map((event) => (
                            <Pressable
                                key={event.id}
                                onPress={() => onEventSelect?.(event.id)}
                                style={[styles.eventCard, { backgroundColor: palette.card, borderColor: palette.border }]}
                            >
                                <Image source={{ uri: event.image }} style={styles.eventImage} resizeMode="cover" />
                                <View style={styles.eventInfo}>
                                    <ThemedText variant="body" tone="primary" numberOfLines={2}>
                                        {event.title}
                                    </ThemedText>
                                    <ThemedText variant="caption" tone="muted">
                                        {event.date}
                                    </ThemedText>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            <SmartTabBar
                userRole={userRole}
                activeTab={userRole === 'host' ? 'Dashboard' : 'Home'}
                onTabSelect={onTabSelect}
            />
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
        paddingTop: Platform.OS === 'android' ? spacing.lg : spacing.sm
    },
    switchButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        padding: spacing.xs
    },
    scrollContainer: {
        flex: 1
    },
    content: {
        paddingHorizontal: spacing.lg
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.sm
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Inter_400Regular'
    },
    filtersRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg
    },
    filterChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: radii.pill,
        borderWidth: 1
    },
    section: {
        marginBottom: spacing.lg
    },
    sectionTitle: {
        marginBottom: spacing.md
    },
    horizontalScroll: {
        marginHorizontal: -spacing.lg,
        paddingHorizontal: spacing.lg
    },
    eventCard: {
        width: 260,
        marginRight: spacing.md,
        borderRadius: radii.lg,
        borderWidth: 1,
        overflow: 'hidden'
    },
    eventImage: {
        width: '100%',
        height: 140,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    eventInfo: {
        padding: spacing.md
    },
    ticketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.sm,
        gap: spacing.md
    },
    ticketThumbnail: {
        width: 48,
        height: 48,
        borderRadius: radii.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.05)'
    },
    ticketInfo: {
        flex: 1
    },
    ticketNumber: {
        marginBottom: spacing.xs / 2
    }
});
