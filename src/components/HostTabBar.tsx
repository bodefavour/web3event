import { StyleSheet, View, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type HostTabKey = 'Dashboard' | 'My Events' | 'Create Event' | 'Analytics' | 'Profile';

type Props = {
    activeTab: HostTabKey;
    onTabSelect?: (tab: HostTabKey) => void;
};

export const HostTabBar = ({ activeTab, onTabSelect }: Props) => {
    const { palette } = useThemePalette();
    const insets = useSafeAreaInsets();

    const tabs: Array<{ key: HostTabKey; icon: keyof typeof Feather.glyphMap; label: string }> = [
        { key: 'Dashboard', icon: 'home', label: 'Dashboard' },
        { key: 'My Events', icon: 'calendar', label: 'My Events' },
        { key: 'Create Event', icon: 'plus-square', label: 'Create' },
        { key: 'Analytics', icon: 'bar-chart-2', label: 'Analytics' },
        { key: 'Profile', icon: 'user', label: 'Profile' }
    ];

    return (
        <View style={[styles.container, { backgroundColor: palette.surface, borderTopColor: palette.border, paddingBottom: insets.bottom }]}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                    <Pressable
                        key={tab.key}
                        onPress={() => onTabSelect?.(tab.key)}
                        style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.8 : 1 }]}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                    >
                        <Feather
                            name={tab.icon}
                            size={20}
                            color={isActive ? palette.primary : palette.textMuted}
                        />
                        <ThemedText
                            variant="caption"
                            style={[
                                styles.label,
                                {
                                    color: isActive ? palette.primary : palette.textMuted
                                }
                            ]}
                        >
                            {tab.label}
                        </ThemedText>
                        {isActive && (
                            <View style={[styles.activeIndicator, { backgroundColor: palette.primary }]} />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingTop: spacing.sm,
        borderTopWidth: 1
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
        position: 'relative'
    },
    label: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11,
        marginTop: spacing.xs / 2
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        width: 40,
        height: 3,
        borderRadius: 2
    }
});
