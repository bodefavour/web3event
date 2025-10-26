import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { ScreenHeader } from '@/components/ScreenHeader';
import { InputField } from '@/components/InputField';
import { ListRow } from '@/components/ListRow';
import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';

type Props = {
  onBack: () => void;
  onComplete: () => void;
  walletAddress?: string;
};

export const ProfileSetupScreen = ({ onBack, onComplete, walletAddress }: Props) => {
  const { palette } = useThemePalette();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}> 
      <StatusBar style="light" />
      <ScreenHeader
        title="Profile Setup"
        leftSlot={
          <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-left" size={28} color={palette.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing['2xl'] }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.fieldStack}>
          <InputField
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
          />
          <InputField
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            returnKeyType="next"
            style={styles.inputSpacing}
          />
        </View>

        <ListRow
          onPress={() => {}}
          icon={<Feather name="image" size={20} color={palette.textPrimary} />}
          title="Upload Avatar"
          style={styles.rowSpacing}
        />

        <View style={styles.sectionHeading}>
          <ThemedText variant="subtitle" tone="primary">
            Social Media
          </ThemedText>
        </View>

        <ListRow
          onPress={() => {}}
          icon={<Feather name="twitter" size={20} color={palette.textPrimary} />}
          title="Link Twitter"
        />
        <ListRow
          onPress={() => {}}
          icon={<Feather name="instagram" size={20} color={palette.textPrimary} />}
          title="Link Instagram"
          style={styles.rowSpacing}
        />

        <View style={styles.sectionHeading}>
          <ThemedText variant="subtitle" tone="primary">
            Wallet
          </ThemedText>
        </View>

        <ListRow
          icon={<Feather name="credit-card" size={20} color={palette.textPrimary} />}
          title={walletAddress ?? '0x123...456P'}
          subtitle="Connected"
        />

        <AppButton
          label="Complete Profile"
          onPress={onComplete}
          style={styles.completeButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs
  },
  content: {
    paddingHorizontal: spacing.xl
  },
  fieldStack: {
    marginTop: spacing.lg
  },
  inputSpacing: {
    marginTop: spacing.md
  },
  rowSpacing: {
    marginTop: spacing.lg
  },
  sectionHeading: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md
  },
  completeButton: {
    marginTop: spacing['2xl']
  }
});
