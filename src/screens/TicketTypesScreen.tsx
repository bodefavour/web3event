import { useMemo, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Pressable,
    Switch,
    Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { InputField } from '@/components/InputField';
import { AppButton } from '@/components/AppButton';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

export type TicketTypeForm = {
    id: string;
    name: string;
    quantity: string;
    price: string;
    transferable: boolean;
};

type Props = {
    onBack: () => void;
    onSave: (ticketTypes: TicketTypeForm[]) => void;
    initialTypes?: TicketTypeForm[];
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    userRole?: 'host' | 'attendee';
};

export const TicketTypesScreen = ({ onBack, onSave, initialTypes, onTabSelect, userRole = 'host' }: Props) => {
    const { palette } = useThemePalette();
    const defaults = useMemo<TicketTypeForm[]>(
        () =>
            initialTypes && initialTypes.length === 2
                ? initialTypes
                : [
                    { id: 'type1', name: '', quantity: '', price: '', transferable: true },
                    { id: 'type2', name: '', quantity: '', price: '', transferable: false }
                ],
        [initialTypes]
    );

    const [ticketTypes, setTicketTypes] = useState<TicketTypeForm[]>(defaults);

    const handleChange = (index: number, key: keyof TicketTypeForm, value: string | boolean) => {
        setTicketTypes((prev) => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                [key]: value
            } as TicketTypeForm;
            return next;
        });
    };

    const handleSave = () => {
        onSave(ticketTypes);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Ticket Types"
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
                {ticketTypes.map((ticket, index) => (
                    <View key={ticket.id} style={index === 0 ? undefined : styles.ticketSectionSpacing}>
                        <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                            Ticket Type {index + 1}
                        </ThemedText>
                        <View style={styles.fieldGroup}>
                            <ThemedText variant="body" tone="primary" style={styles.label}>
                                Ticket Name
                            </ThemedText>
                            <InputField
                                placeholder=""
                                value={ticket.name}
                                onChangeText={(value) => handleChange(index, 'name', value)}
                                returnKeyType="next"
                                style={styles.field}
                            />
                        </View>
                        <View style={styles.fieldGroup}>
                            <ThemedText variant="body" tone="primary" style={styles.label}>
                                Quantity
                            </ThemedText>
                            <InputField
                                placeholder=""
                                value={ticket.quantity}
                                onChangeText={(value) => handleChange(index, 'quantity', value)}
                                keyboardType="number-pad"
                                returnKeyType="next"
                                style={styles.field}
                            />
                        </View>
                        <View style={styles.fieldGroup}>
                            <ThemedText variant="body" tone="primary" style={styles.label}>
                                Price
                            </ThemedText>
                            <InputField
                                placeholder=""
                                value={ticket.price}
                                onChangeText={(value) => handleChange(index, 'price', value)}
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                                style={styles.field}
                            />
                        </View>
                        <View style={styles.switchRow}>
                            <ThemedText variant="body" tone="primary">
                                Transferable
                            </ThemedText>
                            <Switch
                                value={ticket.transferable}
                                onValueChange={(value) => handleChange(index, 'transferable', value)}
                                thumbColor={ticket.transferable ? palette.textOnPrimary : palette.surface}
                                trackColor={{ false: palette.card, true: palette.primary }}
                            />
                        </View>
                    </View>
                ))}

                <AppButton label="Save Ticket Types" onPress={handleSave} style={styles.saveButton} />
            </ScrollView>

            <SmartTabBar
                userRole={userRole}
                activeTab={userRole === 'host' ? 'Create Event' : 'Tickets'}
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
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg
    },
    sectionTitle: {
        marginBottom: spacing.lg
    },
    ticketSectionSpacing: {
        marginTop: spacing.xl
    },
    fieldGroup: {
        marginBottom: spacing.lg
    },
    label: {
        marginBottom: spacing.sm
    },
    field: {
        borderRadius: radii.lg
    },
    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.sm
    },
    saveButton: {
        marginTop: spacing.xl
    }
});