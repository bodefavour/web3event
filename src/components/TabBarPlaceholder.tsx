import { Pressable, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabKey = 'Home' | 'Explore' | 'Events' | 'Tickets' | 'Profile';

type TabItem = {
    key: TabKey;
    icon: keyof typeof Feather.glyphMap;
};

const TAB_ITEMS: TabItem[] = [
    { key: 'Home', icon: 'home' },
    { key: 'Explore', icon: 'search' },
    { key: 'Events', icon: 'calendar' },
    { key: 'Tickets', icon: 'tag' },
    { key: 'Profile', icon: 'user' }
];

type Props = {
    activeTab: TabKey;
    onTabSelect?: (tab: TabKey) => void;
};

export const TabBarPlaceholder = ({ activeTab, onTabSelect }: Props) => {
    const { palette } = useThemePalette();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: palette.surface, borderColor: palette.border, paddingBottom: insets.bottom }]}>
            {TAB_ITEMS.map(({ key, icon }) => {
                const isActive = key === activeTab;
                return (
                    <Pressable
                        key={key}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isActive }}
                        onPress={() => {
                            if (!isActive) {
                                onTabSelect?.(key);
                            }
                        }}
                        style={({ pressed }) => [styles.item, { opacity: pressed ? 0.8 : 1 }]}
                    >
                        <Feather
                            name={icon}
                            size={20}
                            color={isActive ? palette.primary : palette.textMuted}
                        />
                        <ThemedText
                            variant="caption"
                            tone={isActive ? 'primary' : 'muted'}
                            style={styles.label}
                        >
                            {key}
                        </ThemedText>
                    </Pressable>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: spacing.sm,
        borderTopWidth: 1
    },
    item: {
        alignItems: 'center',
        gap: spacing.xs / 2,
        paddingVertical: spacing.xs,
        flex: 1
    },
    label: {
        fontFamily: 'Inter_500Medium',
        fontSize: 11
    }
});