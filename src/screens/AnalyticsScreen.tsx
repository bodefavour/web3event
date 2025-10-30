import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';
import { LineChart } from 'react-native-chart-kit';

type Props = {
    onBack: () => void;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
};

export const AnalyticsScreen = ({ onBack, onTabSelect }: Props) => {
    const { palette } = useThemePalette();
    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        backgroundColor: palette.surface,
        backgroundGradientFrom: palette.surface,
        backgroundGradientTo: palette.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(63, 92, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.64})`,
        style: {
            borderRadius: radii.lg
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: palette.primary
        }
    };

    const salesData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
            {
                data: [45, 28, 50, 40, 65, 48, 70, 55]
            }
        ]
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Analytics"
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
                {/* Event Overview */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Event Overview
                    </ThemedText>
                    <View style={styles.statsGrid}>
                        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <ThemedText variant="body" tone="muted" style={styles.statLabel}>
                                Total Tickets Sold
                            </ThemedText>
                            <ThemedText variant="display" tone="primary" style={styles.statValue}>
                                250
                            </ThemedText>
                        </View>
                        <View style={[styles.statCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                            <ThemedText variant="body" tone="muted" style={styles.statLabel}>
                                Revenue Generated
                            </ThemedText>
                            <ThemedText variant="display" tone="primary" style={styles.statValue}>
                                $7,500
                            </ThemedText>
                        </View>
                    </View>
                    <View style={[styles.statCardFull, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <ThemedText variant="body" tone="muted" style={styles.statLabel}>
                            Average Ticket Price
                        </ThemedText>
                        <ThemedText variant="display" tone="primary" style={styles.statValue}>
                            $30
                        </ThemedText>
                    </View>
                </View>

                {/* Attendee Demographics */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Attendee Demographics
                    </ThemedText>
                    <View style={[styles.chartCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <ThemedText variant="body" tone="primary" style={styles.chartTitle}>
                            Age Distribution
                        </ThemedText>
                        <View style={styles.ageChart}>
                            {[
                                { range: '28-34', height: 80 },
                                { range: '18-24', height: 60 },
                                { range: '35-44', height: 75 },
                                { range: '45+', height: 70 }
                            ].map((item) => (
                                <View key={item.range} style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            { height: item.height, backgroundColor: palette.card }
                                        ]}
                                    />
                                    <ThemedText variant="caption" tone="muted" style={styles.barLabel}>
                                        {item.range}
                                    </ThemedText>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={[styles.chartCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <ThemedText variant="body" tone="primary" style={styles.chartTitle}>
                            Location
                        </ThemedText>
                        <View style={styles.locationList}>
                            {[
                                { city: 'New York', width: 20 },
                                { city: 'Los Angeles', width: 60 },
                                { city: 'Chicago', width: 25 },
                                { city: 'Other', width: 55 }
                            ].map((item) => (
                                <View key={item.city} style={styles.locationRow}>
                                    <ThemedText variant="body" tone="muted" style={styles.locationLabel}>
                                        {item.city}
                                    </ThemedText>
                                    <View
                                        style={[
                                            styles.locationBar,
                                            { width: `${item.width}%`, backgroundColor: palette.card }
                                        ]}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Event Popularity */}
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Event Popularity
                    </ThemedText>
                    <View style={[styles.chartCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <ThemedText variant="body" tone="primary" style={styles.chartTitle}>
                            Ticket Sales Over Time
                        </ThemedText>
                        <LineChart
                            data={salesData}
                            width={screenWidth - spacing.lg * 4}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.lineChart}
                            withInnerLines={false}
                            withOuterLines={false}
                        />
                    </View>
                </View>
            </ScrollView>

            <SmartTabBar userRole="host" activeTab="Analytics" onTabSelect={onTabSelect} />
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
    statsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md
    },
    statCard: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1
    },
    statCardFull: {
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
    chartCard: {
        padding: spacing.lg,
        borderRadius: radii.lg,
        borderWidth: 1,
        marginBottom: spacing.md
    },
    chartTitle: {
        marginBottom: spacing.md
    },
    ageChart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        height: 120,
        paddingTop: spacing.md
    },
    barWrapper: {
        alignItems: 'center',
        gap: spacing.sm
    },
    bar: {
        width: 40,
        borderRadius: radii.sm
    },
    barLabel: {
        fontSize: 11
    },
    locationList: {
        gap: spacing.md
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md
    },
    locationLabel: {
        width: 100
    },
    locationBar: {
        height: 24,
        borderRadius: radii.sm
    },
    lineChart: {
        marginVertical: spacing.sm,
        borderRadius: radii.md
    }
});
