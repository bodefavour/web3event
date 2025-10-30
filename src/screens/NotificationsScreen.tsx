import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type Notification = {
    id: string;
    title: string;
    time: string;
    icon: keyof typeof Feather.glyphMap;
    section: 'today' | 'yesterday';
};

type Props = {
    onBack: () => void;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    onNotificationPress?: (id: string) => void;
    userRole?: 'host' | 'attendee';
};

const NOTIFICATIONS: Notification[] = [
    {
        id: 'notif-1',
        title: 'New Ticket Sold',
        time: '10:30 AM',
        icon: 'tag',
        section: 'today'
    },
    {
        id: 'notif-2',
        title: 'Attendee Message',
        time: '9:15 AM',
        icon: 'message-circle',
        section: 'today'
    },
    {
        id: 'notif-3',
        title: 'Event Update',
        time: '6:45 PM',
        icon: 'alert-circle',
        section: 'yesterday'
    },
    {
        id: 'notif-4',
        title: 'Platform Announcement',
        time: '2:00 PM',
        icon: 'bell',
        section: 'yesterday'
    }
];

export const NotificationsScreen = ({ onBack, onTabSelect, onNotificationPress, userRole = 'attendee' }: Props) => {
    const { palette } = useThemePalette();

    const todayNotifications = NOTIFICATIONS.filter((n) => n.section === 'today');
    const yesterdayNotifications = NOTIFICATIONS.filter((n) => n.section === 'yesterday');

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Notifications"
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
                {/* Today Section */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Today
                    </ThemedText>
                    {todayNotifications.map((notification) => (
                        <Pressable
                            key={notification.id}
                            onPress={() => onNotificationPress?.(notification.id)}
                            style={[styles.notificationCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: palette.card }]}>
                                <Feather name={notification.icon} size={24} color={palette.textPrimary} />
                            </View>
                            <View style={styles.notificationContent}>
                                <ThemedText variant="body" tone="primary" style={styles.notificationTitle}>
                                    {notification.title}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {notification.time}
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Yesterday Section */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Yesterday
                    </ThemedText>
                    {yesterdayNotifications.map((notification) => (
                        <Pressable
                            key={notification.id}
                            onPress={() => onNotificationPress?.(notification.id)}
                            style={[styles.notificationCard, { backgroundColor: palette.surface, borderColor: palette.border }]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: palette.card }]}>
                                <Feather name={notification.icon} size={24} color={palette.textPrimary} />
                            </View>
                            <View style={styles.notificationContent}>
                                <ThemedText variant="body" tone="primary" style={styles.notificationTitle}>
                                    {notification.title}
                                </ThemedText>
                                <ThemedText variant="caption" tone="muted">
                                    {notification.time}
                                </ThemedText>
                            </View>
                        </Pressable>
                    ))}
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
    section: {
        marginBottom: spacing.xl
    },
    sectionTitle: {
        marginBottom: spacing.md
    },
    notificationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md,
        gap: spacing.md
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: radii.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    notificationContent: {
        flex: 1
    },
    notificationTitle: {
        marginBottom: spacing.xs / 2
    }
});
