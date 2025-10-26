import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
} from '@expo-google-fonts/inter';
import { useThemePalette } from '@/hooks/useThemePalette';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

export default function App() {
    const { palette } = useThemePalette();
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: palette.background }]}> 
                <ActivityIndicator size="small" color={palette.primary} />
            </SafeAreaView>
        );
    }

    return <OnboardingScreen />;
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
