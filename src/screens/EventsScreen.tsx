import { SafeAreaView, StyleSheet, FlatList, Pressable, Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { TabBarPlaceholder } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';
import type { EventDetail } from '@/screens/EventDetailsScreen';

type Props = {
    events: EventDetail[];
    onSelectEvent: (event: EventDetail) => void;
    onBack: () => void;
};

export const EventsScreen = ({ events, onSelectEvent, onBack }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
            <StatusBar style="light" />
            <ScreenHeader
                title="Events"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <FlatList
                data={events}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.listContent, { paddingBottom: spacing['2xl'] }]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => onSelectEvent(item)}
                        style={({ pressed }) => [
                            styles.card,
                            {
                                backgroundColor: palette.surface,
                                borderColor: palette.border,
                                opacity: pressed ? 0.95 : 1
                            }
                        ]}
                    >
                        <Image
                            source={{ uri: item.heroImage }}
                            style={[styles.cardImage, { borderColor: palette.border }]}
                        />
                        <View style={styles.cardBody}>
                            <ThemedText variant="overline" tone="muted" style={styles.cardOverline}>
                                {item.category ?? 'Featured'}
                            </ThemedText>
                            <ThemedText variant="title" tone="primary">
                                {item.title}
                            </ThemedText>
                            <ThemedText variant="body" tone="muted" style={styles.cardDescription}>
                                {item.description}
                            </ThemedText>
                            <View style={styles.metaRow}>
                                <Feather name="calendar" size={16} color={palette.textMuted} />
                                <ThemedText variant="caption" tone="muted" style={styles.metaText}>
                                    {item.date} · {item.time}
                                </ThemedText>
                            </View>
                            <View style={styles.metaRow}>
                                <Feather name="map-pin" size={16} color={palette.textMuted} />
                                <ThemedText variant="caption" tone="muted" style={styles.metaText}>
                                    {item.location}
                                </ThemedText>
                            </View>
                        </View>
                    </Pressable>
                )}
            />

            <TabBarPlaceholder activeTab="Events" />
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
    listContent: {
        paddingHorizontal: spacing.xl,
        gap: spacing.lg
    },
    card: {
        borderRadius: radii.lg,
        borderWidth: 1,
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%',
        height: 164,
        borderBottomWidth: 1
    },
    cardBody: {
        padding: spacing.lg,
        gap: spacing.sm
    },
    cardOverline: {
        textTransform: 'uppercase'
    },
    cardDescription: {
        lineHeight: 22
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    metaText: {
        marginLeft: spacing.xs
    }
});