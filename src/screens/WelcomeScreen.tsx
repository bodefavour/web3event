import { SafeAreaView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type Props = {
    onHostEvent: () => void;
    onAttendEvent: () => void;
    onTabSelect?: (tab: TabKey) => void;
};

export const WelcomeScreen = ({ onHostEvent, onAttendEvent, onTabSelect }: Props) => {
    const { palette } = useThemePalette();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <View style={styles.contentWrapper}>
                <View style={styles.heroStack}>
                    <ThemedText variant="caption" tone="muted" style={styles.welcomeLabel}>
                        Welcome to Event Verse
                    </ThemedText>
                    <ThemedText variant="display" tone="primary">
                        What brings you here?
                    </ThemedText>
                    <ThemedText variant="body" tone="muted" style={styles.subtitle}>
                        Tell us what you're looking for, so we can tailor your experience.
                    </ThemedText>
                </View>

                <View style={styles.actionsStack}>
                    <AppButton label="Host an Event" onPress={onHostEvent} />
                    <AppButton
                        label="Attend an Event"
                        variant="secondary"
                        onPress={onAttendEvent}
                        style={styles.secondaryButton}
                    />
                </View>
            </View>

            <TabBarPlaceholder activeTab="Events" onTabSelect={onTabSelect} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing['2xl'],
        justifyContent: 'space-between'
    },
    heroStack: {
        gap: spacing.lg
    },
    welcomeLabel: {
        textTransform: 'uppercase'
    },
    subtitle: {
        maxWidth: 320
    },
    actionsStack: {
        gap: spacing.md,
        marginBottom: spacing['2xl']
    },
    secondaryButton: {
        borderRadius: radii.pill
    }
});