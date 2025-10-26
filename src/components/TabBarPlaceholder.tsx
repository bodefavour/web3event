import { StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

type TabKey = 'Home' | 'Explore' | 'Events' | 'Tickets' | 'Profile';

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
};

export const TabBarPlaceholder = ({ activeTab }: Props) => {
    const { palette } = useThemePalette();

    return (
        <View style={[styles.container, { backgroundColor: palette.surface, borderColor: palette.border }]}> 
            {TAB_ITEMS.map(({ key, icon }) => {
                const isActive = key === activeTab;
                return (
                    <View key={key} style={styles.item}>
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
                    </View>
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
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderTopWidth: 1
    },
    item: {
        alignItems: 'center',
        gap: spacing.xs / 2
    },
    label: {
        fontFamily: 'Inter_500Medium'
    }
});