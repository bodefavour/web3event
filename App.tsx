import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import apiService from '@/services/api';
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
import { HomeScreen } from '@/screens/HomeScreen';
import { CreateEventScreen, CreateEventForm } from '@/screens/CreateEventScreen';
import { TicketTypesScreen, TicketTypeForm } from '@/screens/TicketTypesScreen';
import { DeployingScreen } from '@/screens/DeployingScreen';
import { ReviewScreen } from '@/screens/ReviewScreen';
import { EventsScreen } from '@/screens/EventsScreen';
import { EventDetailsScreen, EventDetail, EventTicketTier } from '@/screens/EventDetailsScreen';
import { MyTicketsScreen, TicketItem } from '@/screens/MyTicketsScreen';
import { BuyTicketsScreen } from '@/screens/BuyTicketsScreen';
import { TransactionSuccessScreen } from '@/screens/TransactionSuccessScreen';
import { TicketDetailScreen } from '@/screens/TicketDetailScreen';
import { HostDashboardScreen } from '@/screens/HostDashboardScreen';
import { AnalyticsScreen } from '@/screens/AnalyticsScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { HelpSupportScreen } from '@/screens/HelpSupportScreen';
import { WalletsScreen } from '@/screens/WalletsScreen';
import type { TabKey } from '@/components/TabBarPlaceholder';
import type { HostTabKey } from '@/components/HostTabBar';

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

const MY_TICKETS: TicketItem[] = [
    {
        id: 'ticket-tech-summit',
        title: 'Tech Summit 2024',
        location: 'San Francisco, CA',
        date: 'Oct 15, 2024',
        typeLabel: 'NFT Ticket',
        thumbnail: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ticket-music-festival',
        title: 'Music Festival',
        location: 'Los Angeles, CA',
        date: 'Nov 20, 2024',
        typeLabel: 'NFT Ticket',
        thumbnail: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?auto=format&fit=crop&w=600&q=80'
    },
    {
        id: 'ticket-art-exhibition',
        title: 'Art Exhibition',
        location: 'New York, NY',
        date: 'Sep 5, 2024',
        typeLabel: 'NFT Ticket',
        thumbnail: 'https://images.unsplash.com/photo-1529429617124-aee02c022350?auto=format&fit=crop&w=600&q=80'
    }
];

function AppContent() {
    const palette = useThemePalette();

    // Initialize API service on mount
    useEffect(() => {
        apiService.initialize();
    }, []);
    const [route, setRoute] = useState<
        | 'onboarding'
        | 'connectWallet'
        | 'profileSetup'
        | 'welcome'
        | 'home'
        | 'hostDashboard'
        | 'analytics'
        | 'notifications'
        | 'helpSupport'
        | 'wallets'
        | 'createEvent'
        | 'events'
        | 'ticketTypes'
        | 'deploying'
        | 'review'
        | 'buyTickets'
        | 'transactionSuccess'
        | 'ticketReview'
        | 'eventDetails'
        | 'myTickets'
        | 'ticketDetail'
    >('onboarding');
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [userRole, setUserRole] = useState<'host' | 'attendee'>('attendee');
    const [connectedWallet, setConnectedWallet] = useState<string | undefined>(undefined);
    const [eventDraft, setEventDraft] = useState<CreateEventForm | null>(null);
    const [ticketDraft, setTicketDraft] = useState<TicketTypeForm[] | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(EVENTS[0]);
    const [selectedTicketTier, setSelectedTicketTier] = useState<EventTicketTier | null>(EVENTS[0].ticketTiers[0]);
    const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
    const [purchaseQuantity, setPurchaseQuantity] = useState(1);
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
        setIsFirstTime(false);
        setRoute('welcome');
    }, []);

    const handleHostEvent = useCallback(() => {
        console.log('Host event selected');
        setUserRole('host');
        setIsFirstTime(false);
        setRoute('hostDashboard');
    }, []);

    const handleAttendEvent = useCallback(() => {
        console.log('Attend event selected');
        setUserRole('attendee');
        setIsFirstTime(false);
        setSelectedEvent(EVENTS[0]);
        setSelectedTicketTier(EVENTS[0].ticketTiers[0]);
        setRoute('home');
    }, []);

    const handleSwitchRole = useCallback(() => {
        setUserRole((prev) => (prev === 'host' ? 'attendee' : 'host'));
    }, []);

    const handleBackToWelcome = useCallback(() => {
        if (isFirstTime) {
            setRoute('welcome');
        } else {
            setRoute(userRole === 'host' ? 'hostDashboard' : 'home');
        }
    }, [isFirstTime, userRole]);

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
            setRoute('buyTickets');
        },
        [selectedEvent]
    );

    const handleBuyTicketsClose = useCallback(() => {
        setRoute('eventDetails');
    }, []);

    const handleBuyTicketsWallet = useCallback(() => {
        console.log('Wallet connected for purchase');
        setRoute('transactionSuccess');
    }, []);

    const handleTransactionSuccess = useCallback(() => {
        setRoute('myTickets');
    }, []);

    const handleTicketReviewBack = useCallback(() => {
        setRoute('eventDetails');
    }, []);

    const handleCompletePurchase = useCallback(() => {
        console.log('Ticket purchased:', {
            event: selectedEvent,
            ticket: selectedTicketTier
        });
        setRoute('myTickets');
    }, [selectedEvent, selectedTicketTier]);

    const handleViewTicket = useCallback((ticket: TicketItem) => {
        console.log('View ticket tapped:', ticket);
        setSelectedTicket(ticket);
        setRoute('ticketDetail');
    }, []);

    const handleTicketDetailBack = useCallback(() => {
        setRoute('myTickets');
    }, []);

    const handleTabSelect = useCallback(
        (tab: TabKey | HostTabKey) => {
            // Handle attendee tabs
            if (tab === 'Home') {
                setRoute('home');
            } else if (tab === 'Events' || tab === 'Explore') {
                setRoute('events');
            } else if (tab === 'Tickets') {
                setRoute('myTickets');
            } else if (tab === 'Profile') {
                console.log('Profile tab selected');
            }
            // Handle host tabs
            else if (tab === 'Dashboard') {
                setRoute('hostDashboard');
            } else if (tab === 'My Events') {
                setRoute('events');
            } else if (tab === 'Create Event') {
                setRoute('createEvent');
            } else if (tab === 'Analytics') {
                setRoute('analytics');
            }
        },
        []
    );

    const totalTickets = ticketDraft?.reduce((sum, ticket) => sum + (parseInt(ticket.quantity, 10) || 0), 0) ?? 0;
    const rawPrimaryPrice = ticketDraft?.[0]?.price?.trim();
    const primaryTicketPrice = rawPrimaryPrice
        ? rawPrimaryPrice.startsWith('$')
            ? rawPrimaryPrice
            : `$${rawPrimaryPrice}`
        : '$50';

    if (!fontsLoaded) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: palette.palette.background }]}>
                <ActivityIndicator size="small" color={palette.palette.primary} />
            </SafeAreaView>
        );
    }

    if (route === 'home') {
        return (
            <HomeScreen
                userRole={userRole}
                onSwitchRole={handleSwitchRole}
                onTabSelect={handleTabSelect}
                onEventSelect={(eventId) => {
                    const event = EVENTS.find((e) => e.id === eventId);
                    if (event) {
                        setSelectedEvent(event);
                        setRoute('eventDetails');
                    }
                }}
                onTicketSelect={(ticketId) => {
                    const ticket = MY_TICKETS.find((t) => t.id === ticketId);
                    if (ticket) {
                        setSelectedTicket(ticket);
                        setRoute('ticketDetail');
                    }
                }}
            />
        );
    }

    if (route === 'hostDashboard') {
        return (
            <HostDashboardScreen
                onTabSelect={handleTabSelect}
                onCreateEvent={() => setRoute('createEvent')}
                onViewAnalytics={() => setRoute('analytics')}
                onManageEvent={(eventId) => {
                    console.log('Manage event:', eventId);
                    setRoute('events');
                }}
            />
        );
    }

    if (route === 'analytics') {
        return (
            <AnalyticsScreen
                onBack={() => setRoute('hostDashboard')}
                onTabSelect={handleTabSelect}
            />
        );
    }

    if (route === 'notifications') {
        return (
            <NotificationsScreen
                onBack={() => setRoute(userRole === 'host' ? 'hostDashboard' : 'home')}
                onTabSelect={handleTabSelect}
                userRole={userRole}
                onNotificationPress={(id) => console.log('Notification pressed:', id)}
            />
        );
    }

    if (route === 'helpSupport') {
        return (
            <HelpSupportScreen
                onBack={() => setRoute(userRole === 'host' ? 'hostDashboard' : 'home')}
                onTabSelect={handleTabSelect}
                userRole={userRole}
                onTopicPress={(id) => console.log('Topic pressed:', id)}
                onChatSupport={() => console.log('Chat support')}
                onEmailSupport={() => console.log('Email support')}
            />
        );
    }

    if (route === 'wallets') {
        return (
            <WalletsScreen
                onBack={() => setRoute(userRole === 'host' ? 'hostDashboard' : 'home')}
                onTabSelect={handleTabSelect}
                userRole={userRole}
                onWalletPress={(id) => console.log('Wallet pressed:', id)}
                onSecurityPress={(id) => console.log('Security option pressed:', id)}
            />
        );
    }

    if (route === 'ticketDetail') {
        const ticket = selectedTicket ?? MY_TICKETS[0];
        const eventForTicket = selectedEvent ?? EVENTS[0];

        const ticketDetail = {
            id: ticket.id,
            eventTitle: ticket.title,
            eventImage: ticket.thumbnail,
            eventDate: ticket.date,
            eventTime: eventForTicket.time,
            eventLocation: ticket.location,
            ticketType: ticket.typeLabel,
            ticketNumber: `#${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
            purchaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            price: selectedTicketTier?.price ?? '$50',
            transferable: true,
            organizerName: eventForTicket.organizerCompany,
            eventDescription: eventForTicket.description
        };

        return (
            <TicketDetailScreen
                ticket={ticketDetail}
                onBack={handleTicketDetailBack}
                onTabSelect={handleTabSelect}
            />
        );
    }

    if (route === 'transactionSuccess') {
        return (
            <TransactionSuccessScreen
                onViewTicket={handleTransactionSuccess}
                onTabSelect={handleTabSelect}
                ticketQuantity={purchaseQuantity}
                eventTitle={selectedEvent?.title}
            />
        );
    }

    if (route === 'buyTickets') {
        const ticketTier = selectedTicketTier ?? selectedEvent?.ticketTiers[0];

        return (
            <BuyTicketsScreen
                ticketTier={ticketTier!}
                eventTitle={selectedEvent?.title}
                onClose={handleBuyTicketsClose}
                onConnectWallet={handleBuyTicketsWallet}
                onTabSelect={handleTabSelect}
            />
        );
    }

    if (route === 'myTickets') {
        return (
            <MyTicketsScreen
                tickets={MY_TICKETS}
                onBack={handleBackToWelcome}
                onViewTicket={handleViewTicket}
                onTabSelect={handleTabSelect}
            />
        );
    }

    if (route === 'events') {
        return (
            <EventsScreen
                events={EVENTS}
                onSelectEvent={handleSelectEvent}
                onBack={handleBackToWelcome}
                onTabSelect={handleTabSelect}
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
                onTabSelect={handleTabSelect}
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
                onTabSelect={handleTabSelect}
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
                onTabSelect={handleTabSelect}
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
                onTabSelect={handleTabSelect}
            />
        );
    }

    if (route === 'ticketTypes') {
        return (
            <TicketTypesScreen
                onBack={handleTicketTypesBack}
                onSave={handleSaveTicketTypes}
                initialTypes={ticketDraft ?? undefined}
                onTabSelect={handleTabSelect}
                userRole={userRole}
            />
        );
    }

    if (route === 'createEvent') {
        return (
            <CreateEventScreen
                onBack={handleBackToWelcome}
                onSubmit={handleCreateEvent}
                onTabSelect={handleTabSelect}
                userRole={userRole}
            />
        );
    }

    if (route === 'welcome') {
        // Only show welcome screen for first-time users
        if (!isFirstTime) {
            return (
                <HomeScreen
                    userRole={userRole}
                    onSwitchRole={handleSwitchRole}
                    onTabSelect={handleTabSelect}
                    onEventSelect={(eventId) => {
                        const event = EVENTS.find((e) => e.id === eventId);
                        if (event) {
                            setSelectedEvent(event);
                            setRoute('eventDetails');
                        }
                    }}
                    onTicketSelect={(ticketId) => {
                        const ticket = MY_TICKETS.find((t) => t.id === ticketId);
                        if (ticket) {
                            setSelectedTicket(ticket);
                            setRoute('ticketDetail');
                        }
                    }}
                />
            );
        }
        return (
            <WelcomeScreen
                onHostEvent={handleHostEvent}
                onAttendEvent={handleAttendEvent}
                onTabSelect={handleTabSelect}
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

export default function App() {
    return (
        <SafeAreaProvider>
            <AppContent />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
