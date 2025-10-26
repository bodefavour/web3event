import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type SummaryItem = {
    label: string;
    value: string;
};

type Props = {
    onBack: () => void;
    onPublish: () => void;
    onEditItem?: (section: 'event' | 'ticket', item: SummaryItem) => void;
    eventDetails: SummaryItem[];
    ticketConfiguration: SummaryItem[];
};

export const ReviewScreen = ({
    onBack,
    onPublish,
    onEditItem,
    eventDetails,
    ticketConfiguration
}: Props) => {
    const { palette } = useThemePalette();

    const renderRow = (section: 'event' | 'ticket', item: SummaryItem) => (
        <Pressable
            key={`${section}-${item.label}`}
            onPress={() => onEditItem?.(section, item)}
            style={({ pressed }) => [
                styles.row,
                {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    opacity: pressed ? 0.92 : 1
                }
            ]}
        >
            <View>
                <ThemedText variant="body" tone="primary">
                    {item.label}
                </ThemedText>
                <ThemedText variant="body" tone="muted" style={styles.valueText}>
                    {item.value}
                </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={palette.textMuted} />
        </Pressable>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
            <StatusBar style="light" />
            <ScreenHeader
                title="Review"
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
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionHeading}>
                        Event Details
                    </ThemedText>
                    {eventDetails.map((item) => renderRow('event', item))}
                </View>

                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionHeading}>
                        Ticket Configuration
                    </ThemedText>
                    {ticketConfiguration.map((item) => renderRow('ticket', item))}
                </View>

                <AppButton label="Publish Event" onPress={onPublish} />
            </ScrollView>

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
    scrollContainer: {
        flex: 1
    },
    content: {
        paddingHorizontal: spacing.xl
    },
    section: {
        marginBottom: spacing['2xl']
    },
    sectionHeading: {
        marginBottom: spacing.md
    },
    row: {
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    valueText: {
        marginTop: spacing.xs
    }
});