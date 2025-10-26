import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useMemo } from 'react';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';

export default function App() {
  const { palette, isDark } = useThemePalette();

  const containerStyle = useMemo(
    () => [styles.container, { backgroundColor: palette.background }],
    [palette.background]
  );

  return (
    <SafeAreaView style={containerStyle}>
      <View style={styles.content}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <ThemedText variant="title" style={{ color: palette.textPrimary }}>
            Welcome to Web3Event
          </ThemedText>
          <ThemedText variant="body" style={[styles.bodyText, { color: palette.textSecondary }]}>
            Your Expo + TypeScript foundation is ready. Start mapping your Figma flows into
            reusable screens and components here.
          </ThemedText>
        </ScrollView>
      </View>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 48
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center'
  },
  bodyText: {
    marginTop: 16,
    maxWidth: 360,
    lineHeight: 22
  }
});
