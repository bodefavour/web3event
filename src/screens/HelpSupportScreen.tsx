import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';
import { useState } from 'react';

type TopicCard = {
    id: string;
    title: string;
    icon: keyof typeof Feather.glyphMap;
};

type Props = {
    onBack: () => void;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    onTopicPress?: (topicId: string) => void;
    onChatSupport?: () => void;
    onEmailSupport?: () => void;
    userRole?: 'host' | 'attendee';
};

const POPULAR_TOPICS: TopicCard[] = [
    { id: 'ticketing', title: 'Ticketing', icon: 'tag' },
    { id: 'event-setup', title: 'Event Setup', icon: 'calendar' },
    { id: 'attendee-mgmt', title: 'Attendee Management', icon: 'users' },
    { id: 'payments', title: 'Payments', icon: 'credit-card' }
];

export const HelpSupportScreen = ({ onBack, onTabSelect, onTopicPress, onChatSupport, onEmailSupport, userRole = 'host' }: Props) => {
    const { palette } = useThemePalette();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Help & Support"
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
                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                    <Feather name="search" size={20} color={palette.textMuted} />
                    <TextInput
                        style={[styles.searchInput, { color: palette.textPrimary }]}
                        placeholder="Search FAQs"
                        placeholderTextColor={palette.textMuted}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Popular Topics */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Popular Topics
                    </ThemedText>
                    <View style={styles.topicsGrid}>
                        {POPULAR_TOPICS.map((topic) => (
                            <Pressable
                                key={topic.id}
                                onPress={() => onTopicPress?.(topic.id)}
                                style={[styles.topicCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                            >
                                <Feather name={topic.icon} size={28} color={palette.textPrimary} />
                                <ThemedText variant="body" tone="primary" style={styles.topicTitle}>
                                    {topic.title}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Contact Us */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Contact Us
                    </ThemedText>
                    <Pressable
                        onPress={onChatSupport}
                        style={[styles.contactCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: palette.card }]}>
                            <Feather name="message-circle" size={24} color={palette.textPrimary} />
                        </View>
                        <ThemedText variant="body" tone="primary">
                            Chat with Support
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={onEmailSupport}
                        style={[styles.contactCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                    >
                        <View style={[styles.contactIcon, { backgroundColor: palette.card }]}>
                            <Feather name="mail" size={24} color={palette.textPrimary} />
                        </View>
                        <ThemedText variant="body" tone="primary">
                            Email Support
                        </ThemedText>
                    </Pressable>
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.xl,
        gap: spacing.sm
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Inter_400Regular'
    },
    section: {
        marginBottom: spacing.xl
    },
    sectionTitle: {
        marginBottom: spacing.md
    },
    topicsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md
    },
    topicCard: {
        width: '48%',
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        alignItems: 'center',
        gap: spacing.md
    },
    topicTitle: {
        textAlign: 'center'
    },
    contactCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.md
    },
    contactIcon: {
        width: 56,
        height: 56,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
