import { SafeAreaView, StyleSheet, View, FlatList, Image, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

export type TicketItem = {
    id: string;
    title: string;
    location: string;
    date: string;
    typeLabel: string;
    thumbnail: string;
};

type Props = {
    tickets: TicketItem[];
    onBack: () => void;
    onViewTicket: (ticket: TicketItem) => void;
    onTabSelect?: (tab: TabKey) => void;
};

export const MyTicketsScreen = ({ tickets, onBack, onViewTicket, onTabSelect }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
            <StatusBar style="light" />
            <ScreenHeader
                title="My Tickets"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <View style={styles.sectionHeader}>
                <ThemedText variant="subtitle" tone="primary">
                    Upcoming
                </ThemedText>
            </View>

            <FlatList
                data={tickets}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: spacing['2xl'] }]}
                ItemSeparatorComponent={() => <View style={{ height: spacing.lg }} />}
                renderItem={({ item }) => (
                    <View style={[styles.ticketCard, { backgroundColor: palette.surface, borderColor: palette.border }]}> 
                        <View style={styles.ticketInfo}>
                            <ThemedText variant="caption" tone="muted" style={styles.ticketType}>
                                {item.typeLabel}
                            </ThemedText>
                            <ThemedText variant="title" tone="primary">
                                {item.title}
                            </ThemedText>
                            <ThemedText variant="body" tone="muted" style={styles.ticketMeta}>
                                {item.location} · {item.date}
                            </ThemedText>
                            <Pressable
                                accessibilityRole="button"
                                onPress={() => onViewTicket(item)}
                                style={({ pressed }) => [
                                    styles.ticketButton,
                                    {
                                        backgroundColor: palette.background,
                                        borderColor: palette.border,
                                        opacity: pressed ? 0.85 : 1
                                    }
                                ]}
                            >
                                <ThemedText variant="button" tone="primary">
                                    View Ticket
                                </ThemedText>
                                <Feather name="arrow-right" size={16} color={palette.primary} />
                            </Pressable>
                        </View>
                        <Image source={{ uri: item.thumbnail }} style={[styles.ticketImage, { borderColor: palette.border }]} />
                    </View>
                )}
            />

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
    sectionHeader: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.md
    },
    listContent: {
        paddingHorizontal: spacing.xl
    },
    ticketCard: {
        borderRadius: radii.lg,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: spacing.lg,
        gap: spacing.lg
    },
    ticketInfo: {
        flex: 1,
        justifyContent: 'space-between'
    },
    ticketType: {
        textTransform: 'uppercase'
    },
    ticketMeta: {
        marginTop: spacing.xs,
        marginBottom: spacing.lg
    },
    ticketButton: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        borderWidth: 1
    },
    ticketImage: {
        width: 96,
        height: 96,
        borderRadius: radii.md,
        borderWidth: 1
    }
});