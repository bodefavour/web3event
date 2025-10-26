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
import { EventsScreen } from '@/screens/EventsScreen';
import { EventDetailsScreen, EventDetail, EventTicketTier } from '@/screens/EventDetailsScreen';

const EVENTS: EventDetail[] = [
    {
        id: 'web3-summit',
        title: 'Web3 Tech Innovators Summit',
        description:
            'Immerse yourself in the latest trends in web3 with keynote speakers, hands-on workshops, and curated networking sessions.',
        date: 'Oct 26, 2025',
        time: '9:00 AM - 5:00 PM',
        location: 'Innovation Hub, San Francisco, CA',
        heroImage: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
        organizerName: 'Organized by',
        organizerCompany: 'Tech Events Co.',
        organizerAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=240&q=80',
        category: 'Tech Conference',
        ticketTiers: [
            {
                id: 'summit-general',
                label: 'General Admission',
                description: 'Access to all sessions and workshops',
                price: '$199'
            },
            {
                id: 'summit-vip',
                label: 'VIP Pass',
                description: 'VIP lounge access and exclusive networking',
                price: '$399'
            }
        ]
    },
    {
        id: 'dao-builders',
        title: 'DAO Builders Retreat',
        description:
            'A three-day retreat for DAO operators covering governance tooling, treasury strategy, and community growth playbooks.',
        date: 'Nov 14, 2025',
        time: '10:00 AM - 6:00 PM',
        location: 'Calistoga Ranch, Napa Valley, CA',
        heroImage: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        organizerName: 'Hosted by',
        organizerCompany: 'DAO Collective',
        organizerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
        category: 'Leadership',
        ticketTiers: [
            {
                id: 'dao-standard',
                label: 'Retreat Pass',
                description: 'Workshops, meals, and resort access',
                price: '$599'
            },
            {
                id: 'dao-suite',
                label: 'Executive Suite',
                description: 'Includes private suite and concierge onboarding',
                price: '$899'
            }
        ]
    },
    {
        id: 'nft-art-night',
        title: 'NFT Art Night: Metaverse Edition',
        description:
            'An immersive gallery experience featuring generative artists, live performances, and VR showcases of upcoming drops.',
        date: 'Dec 02, 2025',
        time: '7:00 PM - 11:00 PM',
        location: 'Aurora Loft, Brooklyn, NY',
        heroImage: 'https://images.unsplash.com/photo-1526481280695-3c4697e2e81b?auto=format&fit=crop&w=1200&q=80',
        organizerName: 'Curated by',
        organizerCompany: 'Metaverse Arts Guild',
        organizerAvatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=240&q=80',
        category: 'Experience',
        ticketTiers: [
            {
                id: 'nft-general',
                label: 'General Admission',
                description: 'Gallery access and performances',
                price: '$75'
            },
            {
                id: 'nft-collector',
                label: 'Collector Pass',
                description: 'Includes artist meet-and-greet and limited print',
                price: '$150'
            }
        ]
    }
];

export default function App() {
    const { palette } = useThemePalette();
    const [route, setRoute] = useState<
        | 'onboarding'
        | 'connectWallet'
        | 'profileSetup'
        | 'welcome'
        | 'createEvent'
        | 'events'
        | 'ticketTypes'
        | 'deploying'
        | 'review'
        | 'ticketReview'
        | 'eventDetails'
    >('onboarding');
    const [connectedWallet, setConnectedWallet] = useState<string | undefined>(undefined);
    const [eventDraft, setEventDraft] = useState<CreateEventForm | null>(null);
    const [ticketDraft, setTicketDraft] = useState<TicketTypeForm[] | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(EVENTS[0]);
    const [selectedTicketTier, setSelectedTicketTier] = useState<EventTicketTier | null>(EVENTS[0].ticketTiers[0]);
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
        setRoute('events');
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
        setSelectedEvent(EVENTS[0]);
        setSelectedTicketTier(EVENTS[0].ticketTiers[0]);
        setRoute('events');
    }, []);

    const handleBackToWelcome = useCallback(() => {
        setRoute('welcome');
    }, []);

    const handleBackToEvents = useCallback(() => {
        setRoute('events');
    }, []);

    const handleSelectEvent = useCallback((event: EventDetail) => {
        setSelectedEvent(event);
        setSelectedTicketTier(event.ticketTiers[0]);
        setRoute('eventDetails');
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

    const handleBuyTickets = useCallback(
        (tier?: EventTicketTier) => {
            const resolvedTier = tier ?? selectedEvent?.ticketTiers[0] ?? null;
            if (resolvedTier) {
                setSelectedTicketTier(resolvedTier);
            }
            console.log('Buy tickets tapped', resolvedTier);
            setRoute('ticketReview');
        },
        [selectedEvent]
    );

    const handleTicketReviewBack = useCallback(() => {
        setRoute('eventDetails');
    }, []);

    const handleCompletePurchase = useCallback(() => {
        console.log('Ticket purchased:', {
            event: selectedEvent,
            ticket: selectedTicketTier
        });
        setRoute('events');
    }, [selectedEvent, selectedTicketTier]);

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

    if (route === 'events') {
        return (
            <EventsScreen
                events={EVENTS}
                onSelectEvent={handleSelectEvent}
                onBack={handleBackToWelcome}
            />
        );
    }

    if (route === 'ticketReview') {
        const eventForSummary = selectedEvent ?? EVENTS[0];
        const ticketForSummary = selectedTicketTier ?? eventForSummary.ticketTiers[0];

        return (
            <ReviewScreen
                title="Review"
                ctaLabel="Buy Tickets"
                activeTab="Tickets"
                onBack={handleTicketReviewBack}
                onPrimaryAction={handleCompletePurchase}
                eventDetails={[
                    { label: 'Event', value: eventForSummary.title },
                    { label: 'Location', value: eventForSummary.location },
                    { label: 'Date', value: eventForSummary.date },
                    { label: 'Time', value: eventForSummary.time }
                ]}
                ticketConfiguration={[
                    { label: 'Ticket Type', value: ticketForSummary.label },
                    { label: 'Price', value: ticketForSummary.price },
                    { label: 'Quantity', value: '1' }
                ]}
            />
        );
    }

    if (route === 'eventDetails') {
        return (
            <EventDetailsScreen
                event={selectedEvent ?? EVENTS[0]}
                onBack={handleBackToEvents}
                onBuyTickets={handleBuyTickets}
            />
        );
    }

    if (route === 'review') {
        return (
            <ReviewScreen
                title="Review"
                ctaLabel="Publish Event"
                activeTab="Events"
                onBack={handleReviewBack}
                onPrimaryAction={handlePublishEvent}
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
