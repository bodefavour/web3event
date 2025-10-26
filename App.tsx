import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useCallback, useState } from 'react';
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold
} from '@expo-google-fonts/inter';
import { useThemePalette } from '@/hooks/useThemePalette';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { ConnectWalletScreen } from '@/screens/ConnectWalletScreen';
import { ProfileSetupScreen } from '@/screens/ProfileSetupScreen';

export default function App() {
    const { palette } = useThemePalette();
    const [route, setRoute] = useState<'onboarding' | 'connectWallet' | 'profileSetup'>('onboarding');
    const [connectedWallet, setConnectedWallet] = useState<string | undefined>(undefined);
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold
    });

    const handleConnectWallet = useCallback(() => {
        setRoute('connectWallet');
    }, []);

    const handleExploreEvents = useCallback(() => {
        console.log('Explore events tapped');
    }, []);

    const handleBackToOnboarding = useCallback(() => {
        setRoute('onboarding');
    }, []);

    const handleBackToWallet = useCallback(() => {
        setRoute('connectWallet');
    }, []);

    const handleSelectWallet = useCallback((wallet: string) => {
        console.log('Wallet selected:', wallet);
        setConnectedWallet('0x123...456P');
        setRoute('profileSetup');
    }, []);

    const handleCompleteProfile = useCallback(() => {
        console.log('Profile completed');
    }, []);

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: palette.background }]}>
                <ActivityIndicator size="small" color={palette.primary} />
            </SafeAreaView>
        );
    }

    if (route === 'profileSetup') {
        return (
            <ProfileSetupScreen
                onBack={handleBackToWallet}
                onComplete={handleCompleteProfile}
                walletAddress={connectedWallet}
            />
        );
    }

    if (route === 'connectWallet') {
        return (
            <ConnectWalletScreen onBack={handleBackToOnboarding} onSelectWallet={handleSelectWallet} />
        );
    }

    return (
        <OnboardingScreen
            onConnectWallet={handleConnectWallet}
            onExploreEvents={handleExploreEvents}
        />
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
