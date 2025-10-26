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
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { CreateEventScreen, CreateEventForm } from '@/screens/CreateEventScreen';
import { TicketTypesScreen, TicketTypeForm } from '@/screens/TicketTypesScreen';
import { DeployingScreen } from '@/screens/DeployingScreen';
import { ReviewScreen } from '@/screens/ReviewScreen';
import { EventDetailsScreen } from '@/screens/EventDetailsScreen';

export default function App() {
    const { palette } = useThemePalette();
    const [route, setRoute] = useState<
        | 'onboarding'
        | 'connectWallet'
        | 'profileSetup'
        | 'welcome'
        | 'createEvent'
        | 'ticketTypes'
        | 'deploying'
        | 'review'
        | 'eventDetails'
    >('onboarding');
    const [connectedWallet, setConnectedWallet] = useState<string | undefined>(undefined);
    const [eventDraft, setEventDraft] = useState<CreateEventForm | null>(null);
    const [ticketDraft, setTicketDraft] = useState<TicketTypeForm[] | null>(null);
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
        setRoute('welcome');
    }, []);

    const handleHostEvent = useCallback(() => {
        console.log('Host event selected');
        setRoute('createEvent');
    }, []);

    const handleAttendEvent = useCallback(() => {
        console.log('Attend event selected');
        setRoute('eventDetails');
    }, []);

    const handleBackToWelcome = useCallback(() => {
        setRoute('welcome');
    }, []);

    const handleCreateEvent = useCallback((form: CreateEventForm) => {
        console.log('Event draft saved:', form);
        setEventDraft(form);
        setRoute('ticketTypes');
    }, []);

    const handleTicketTypesBack = useCallback(() => {
        setRoute('createEvent');
    }, []);

    const handleSaveTicketTypes = useCallback((types: TicketTypeForm[]) => {
        console.log('Ticket types saved:', types);
        setTicketDraft(types);
        setRoute('deploying');
    }, []);

    const handleDeployingContinue = useCallback(() => {
        setRoute('review');
    }, []);

    const handleReviewBack = useCallback(() => {
        setRoute('ticketTypes');
    }, []);

    const handlePublishEvent = useCallback(() => {
        console.log('Event published:', { eventDraft, ticketDraft });
        setRoute('welcome');
    }, [eventDraft, ticketDraft]);

    const handleBuyTickets = useCallback(() => {
        console.log('Buy tickets tapped');
    }, []);

    const totalTickets = ticketDraft?.reduce((sum, ticket) => sum + (parseInt(ticket.quantity, 10) || 0), 0) ?? 0;
    const rawPrimaryPrice = ticketDraft?.[0]?.price?.trim();
    const primaryTicketPrice = rawPrimaryPrice
        ? rawPrimaryPrice.startsWith('$')
            ? rawPrimaryPrice
            : `$${rawPrimaryPrice}`
        : '$50';

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: palette.background }]}>
                <ActivityIndicator size="small" color={palette.primary} />
            </SafeAreaView>
        );
    }

    if (route === 'eventDetails') {
        return (
            <EventDetailsScreen onBack={handleBackToWelcome} onBuyTickets={handleBuyTickets} />
        );
    }

    if (route === 'review') {
        return (
            <ReviewScreen
                onBack={handleReviewBack}
                onPublish={handlePublishEvent}
                eventDetails={[
                    { label: 'Event Type', value: eventDraft?.about || 'Tech Conference' },
                    { label: 'Location', value: eventDraft?.location || 'San Francisco, CA' },
                    { label: 'Date', value: eventDraft?.date || 'Oct 26, 2025' },
                    { label: 'Time', value: eventDraft?.time || '10:00 AM - 6:00 PM' }
                ]}
                ticketConfiguration={[
                    { label: 'Total Tickets', value: totalTickets ? `${totalTickets}` : '100' },
                    { label: 'Price', value: primaryTicketPrice },
                    { label: 'Tickets Per User', value: '10' }
                ]}
            />
        );
    }

    if (route === 'deploying') {
        return (
            <DeployingScreen
                totalTickets={totalTickets || 100}
                onContinue={handleDeployingContinue}
            />
        );
    }

    if (route === 'ticketTypes') {
        return (
            <TicketTypesScreen
                onBack={handleTicketTypesBack}
                onSave={handleSaveTicketTypes}
                initialTypes={ticketDraft ?? undefined}
            />
        );
    }

    if (route === 'createEvent') {
        return (
            <CreateEventScreen onBack={handleBackToWelcome} onSubmit={handleCreateEvent} />
        );
    }

    if (route === 'welcome') {
        return (
            <WelcomeScreen
                onHostEvent={handleHostEvent}
                onAttendEvent={handleAttendEvent}
            />
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
