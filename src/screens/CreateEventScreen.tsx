import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { InputField } from '@/components/InputField';
import { AppButton } from '@/components/AppButton';
import { SmartTabBar } from '@/components/SmartTabBar';
import { TabKey } from '@/components/TabBarPlaceholder';
import { HostTabKey } from '@/components/HostTabBar';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing, radii } from '@/theme';

export type CreateEventForm = {
    name: string;
    date: string;
    time: string;
    location: string;
    about: string;
};

type Props = {
    onBack: () => void;
    onSubmit: (form: CreateEventForm) => void;
    onTabSelect?: (tab: TabKey | HostTabKey) => void;
    userRole?: 'host' | 'attendee';
};

export const CreateEventScreen = ({ onBack, onSubmit, onTabSelect, userRole = 'host' }: Props) => {
    const { palette } = useThemePalette();
    const [form, setForm] = useState<CreateEventForm>({
        name: '',
        date: '',
        time: '',
        location: '',
        about: ''
    });

    const handleChange = (key: keyof CreateEventForm, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSubmit(form);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Create Event"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.textPrimary} />
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.fieldStack}>
                    <InputField
                        placeholder="Event Name"
                        value={form.name}
                        onChangeText={(value) => handleChange('name', value)}
                        returnKeyType="next"
                        style={styles.field}
                    />
                    <InputField
                        placeholder="Date"
                        value={form.date}
                        onChangeText={(value) => handleChange('date', value)}
                        returnKeyType="next"
                        style={styles.field}
                    />
                    <InputField
                        placeholder="Time"
                        value={form.time}
                        onChangeText={(value) => handleChange('time', value)}
                        returnKeyType="next"
                        style={styles.field}
                    />
                    <InputField
                        placeholder="Location"
                        value={form.location}
                        onChangeText={(value) => handleChange('location', value)}
                        returnKeyType="next"
                        style={styles.field}
                    />
                    <InputField
                        placeholder="About..."
                        value={form.about}
                        onChangeText={(value) => handleChange('about', value)}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        style={[styles.field, styles.aboutField]}
                    />
                </View>

                <AppButton label="Create Event" onPress={handleSubmit} style={styles.submitButton} />
            </ScrollView>

            <SmartTabBar
                userRole={userRole}
                activeTab={userRole === 'host' ? 'Create Event' : 'Events'}
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
    fieldStack: {
        marginTop: spacing.lg,
        gap: spacing.lg
    },
    field: {
        borderRadius: radii.lg
    },
    aboutField: {
        height: 200,
        paddingTop: spacing.lg
    },
    submitButton: {
        marginTop: spacing.xl
    }
});