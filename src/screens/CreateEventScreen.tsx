import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { InputField } from '@/components/InputField';
import { AppButton } from '@/components/AppButton';
import { TabBarPlaceholder } from '@/components/TabBarPlaceholder';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

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
};

export const CreateEventScreen = ({ onBack, onSubmit }: Props) => {
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

            <TabBarPlaceholder activeTab="Events" />
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
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing['2xl']
    },
    fieldStack: {
        marginTop: spacing.lg,
        gap: spacing.md
    },
    field: {
        borderRadius: 16
    },
    aboutField: {
        height: 140
    },
    submitButton: {
        marginTop: spacing['2xl']
    }
});