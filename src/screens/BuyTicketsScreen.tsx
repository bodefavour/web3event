import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder, TabKey } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

type TicketTier = {
    id: string;
    label: string;
    price: string;
};

type Props = {
    onClose: () => void;
    onConnectWallet: () => void;
    onTabSelect?: (tab: TabKey) => void;
    ticketTier: TicketTier;
    eventTitle?: string;
};

export const BuyTicketsScreen = ({ onClose, onConnectWallet, onTabSelect, ticketTier, eventTitle }: Props) => {
    const { palette } = useThemePalette();
    const [quantity, setQuantity] = useState(1);

    const ticketPrice = parseFloat(ticketTier.price.replace('$', ''));
    const subtotal = ticketPrice * quantity;
    const fees = subtotal * 0.1;
    const total = subtotal + fees;

    const handleIncrement = () => {
        if (quantity < 10) setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Buy tickets"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
                        <Feather name="x" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={[styles.content, { paddingBottom: spacing['2xl'] }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        {ticketTier.label}
                    </ThemedText>

                    <View style={[styles.quantityRow, { backgroundColor: palette.surface, borderColor: palette.border }]}>
                        <View>
                            <ThemedText variant="body" tone="primary">
                                {ticketTier.label}
                            </ThemedText>
                            <ThemedText variant="body" tone="muted">
                                {ticketTier.price}
                            </ThemedText>
                        </View>

                        <View style={styles.quantityControls}>
                            <Pressable
                                onPress={handleDecrement}
                                style={({ pressed }) => [
                                    styles.quantityButton,
                                    { backgroundColor: palette.card, opacity: pressed ? 0.7 : 1 }
                                ]}
                            >
                                <Feather name="minus" size={20} color={palette.textPrimary} />
                            </Pressable>
                            <ThemedText variant="title" tone="primary" style={styles.quantityText}>
                                {quantity}
                            </ThemedText>
                            <Pressable
                                onPress={handleIncrement}
                                style={({ pressed }) => [
                                    styles.quantityButton,
                                    { backgroundColor: palette.card, opacity: pressed ? 0.7 : 1 }
                                ]}
                            >
                                <Feather name="plus" size={20} color={palette.textPrimary} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="title" tone="primary" style={styles.sectionTitle}>
                        Order Summary
                    </ThemedText>

                    <View style={styles.summaryRow}>
                        <ThemedText variant="body" tone="muted">
                            {quantity} x {ticketTier.label}
                        </ThemedText>
                        <ThemedText variant="body" tone="primary">
                            ${subtotal.toFixed(2)}
                        </ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText variant="body" tone="muted">
                            Subtotal
                        </ThemedText>
                        <ThemedText variant="body" tone="primary">
                            ${subtotal.toFixed(2)}
                        </ThemedText>
                    </View>

                    <View style={styles.summaryRow}>
                        <ThemedText variant="body" tone="muted">
                            Fees
                        </ThemedText>
                        <ThemedText variant="body" tone="primary">
                            ${fees.toFixed(2)}
                        </ThemedText>
                    </View>

                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <ThemedText variant="title" tone="primary">
                            Total
                        </ThemedText>
                        <ThemedText variant="title" tone="primary">
                            ${total.toFixed(2)}
                        </ThemedText>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.ctaContainer}>
                <AppButton label="Connect Wallet" onPress={onConnectWallet} />
            </View>

            <TabBarPlaceholder activeTab="Profile" onTabSelect={onTabSelect} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    closeButton: {
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
    sectionTitle: {
        marginBottom: spacing.lg
    },
    quantityRow: {
        borderRadius: radii.lg,
        borderWidth: 1,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    quantityText: {
        minWidth: 32,
        textAlign: 'center'
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    totalRow: {
        marginTop: spacing.md,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)'
    },
    ctaContainer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg
    }
});
