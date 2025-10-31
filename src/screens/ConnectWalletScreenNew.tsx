import { StyleSheet, View, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { useThemePalette } from '@/hooks/useThemePalette';
import { spacing } from '@/theme';
import { Feather } from '@expo/vector-icons';
import { ConnectWallet, useAddress, useDisconnect, useSDK } from '@thirdweb-dev/react-native';
import apiService from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Wallet configurations with actual logos
const walletOptions = [
    {
        id: 'metamask',
        label: 'MetaMask',
        accentColor: '#FF6A1A',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
        type: 'evm'
    },
    {
        id: 'walletconnect',
        label: 'WalletConnect',
        accentColor: '#3B99FC',
        logo: 'https://walletconnect.com/walletconnect-logo.svg',
        type: 'evm'
    },
    {
        id: 'coinbase',
        label: 'Coinbase Wallet',
        accentColor: '#0052FF',
        logo: 'https://www.coinbase.com/img/favicon/favicon-32x32.png',
        type: 'evm'
    },
    {
        id: 'trust',
        label: 'Trust Wallet',
        accentColor: '#3375BB',
        logo: 'https://trustwallet.com/assets/images/trust_platform.svg',
        type: 'evm'
    },
    {
        id: 'hashpack',
        label: 'HashPack (Hedera)',
        accentColor: '#6366F1',
        logo: 'https://www.hashpack.app/img/logo.svg',
        type: 'hedera'
    },
    {
        id: 'blade',
        label: 'Blade Wallet (Hedera)',
        accentColor: '#00D4AA',
        logo: 'https://www.bladewallet.io/static/media/blade-logo.svg',
        type: 'hedera'
    },
] as const;

type Props = {
    onBack: () => void;
    onSelectWallet: (walletAddress: string, walletType: string) => void;
};

export const ConnectWalletScreen = ({ onBack, onSelectWallet }: Props) => {
    const { palette } = useThemePalette();
    const [connecting, setConnecting] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    const address = useAddress();
    const disconnect = useDisconnect();
    const sdk = useSDK();

    const handleWalletConnect = async (walletId: string, walletType: string) => {
        if (walletType === 'hedera') {
            // Handle Hedera wallets (HashPack, Blade)
            setConnecting(true);
            setSelectedWallet(walletId);
            try {
                await handleHederaWalletConnect(walletId);
            } catch (error: any) {
                console.error('Wallet connection error:', error);
                Alert.alert('Connection Failed', error.message || 'Failed to connect wallet');
            } finally {
                setConnecting(false);
                setSelectedWallet(null);
            }
        } else {
            // For EVM wallets, scroll user down to ThirdWeb button
            Alert.alert(
                'Connect EVM Wallet',
                'Please scroll down and use the "Connect Wallet" button to connect your wallet with ThirdWeb.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleHederaWalletConnect = async (walletId: string) => {
        try {
            // For Hedera wallets, prompt user to enter their account ID
            if (walletId === 'hashpack' || walletId === 'blade') {
                Alert.prompt(
                    `Connect ${walletId === 'hashpack' ? 'HashPack' : 'Blade'} Wallet`,
                    'Enter your Hedera account ID (e.g., 0.0.12345)',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel'
                        },
                        {
                            text: 'Connect',
                            onPress: async (accountId?: string) => {
                                if (accountId && accountId.match(/^0\.0\.\d+$/)) {
                                    await handleWalletConnected(accountId, walletId);
                                } else {
                                    Alert.alert('Invalid Format', 'Please enter a valid Hedera account ID (e.g., 0.0.12345)');
                                }
                            }
                        }
                    ],
                    'plain-text',
                    '0.0.'
                );
            }

        } catch (error: any) {
            throw new Error(`Failed to connect ${walletId}: ${error.message}`);
        }
    };

    const createHashPackPairing = async (): Promise<string> => {
        // In production, generate proper pairing string
        // For now, return mock pairing data
        return 'mock_pairing_data';
    };

    const handleWalletConnected = async (walletAddress: string, walletType: string) => {
        try {
            // Get user data from AsyncStorage
            const userData = await AsyncStorage.getItem('@user_data');
            if (!userData) {
                Alert.alert('Error', 'User not logged in. Please login first.');
                return;
            }

            const user = JSON.parse(userData);

            // Save wallet to backend
            await apiService.connectWallet(walletAddress, user.id);

            // Pass the actual wallet address and type to parent
            onSelectWallet(walletAddress, walletType);
        } catch (error: any) {
            console.error('Failed to save wallet:', error);
            Alert.alert('Error', 'Wallet connected but failed to save');
        }
    };

    // Handle ThirdWeb wallet connection
    const handleThirdWebConnect = async () => {
        if (address) {
            await handleWalletConnected(address, 'metamask');
        }
    };
    // Watch for ThirdWeb wallet connection
    useEffect(() => {
        console.log('ThirdWeb address changed:', address);
        if (address) {
            console.log('Connecting wallet with address:', address);
            handleWalletConnected(address, 'evm-wallet');
        }
    }, [address]);

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
            <StatusBar style="light" />
            <ScreenHeader
                title="Connect Wallet"
                leftSlot={
                    <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color={palette.text} />
                    </Pressable>
                }
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.section}>
                    <ThemedText style={styles.subtitle}>
                        Choose your preferred wallet to continue
                    </ThemedText>
                </View>

                {/* EVM Wallets Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Ethereum Wallets</ThemedText>
                    <ThemedText style={[styles.helperText, { color: palette.textSecondary, marginBottom: spacing.md }]}>
                        Scroll down to use the "Connect Wallet" button below
                    </ThemedText>
                    {walletOptions
                        .filter(w => w.type === 'evm')
                        .map((wallet) => (
                            <Pressable
                                key={wallet.id}
                                style={[
                                    styles.walletButton,
                                    { backgroundColor: palette.surface, borderColor: palette.border }
                                ]}
                                onPress={() => handleWalletConnect(wallet.id, wallet.type)}
                                disabled={connecting && selectedWallet === wallet.id}
                            >
                                <View style={styles.walletContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: wallet.accentColor }]}>
                                        <View style={styles.iconPlaceholder}>
                                            <ThemedText style={styles.iconText}>
                                                {wallet.label.charAt(0)}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.walletInfo}>
                                        <ThemedText style={styles.walletLabel}>{wallet.label}</ThemedText>
                                        <ThemedText style={[styles.walletDescription, { color: palette.textSecondary }]}>
                                            {wallet.type === 'evm' ? 'Ethereum Compatible' : 'Hedera Network'}
                                        </ThemedText>
                                    </View>
                                    {connecting && selectedWallet === wallet.id ? (
                                        <ActivityIndicator color={wallet.accentColor} />
                                    ) : (
                                        <Feather name="chevron-right" size={20} color={palette.textSecondary} />
                                    )}
                                </View>
                            </Pressable>
                        ))}
                </View>

                {/* Hedera Wallets Section */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Hedera Wallets</ThemedText>
                    <ThemedText style={[styles.helperText, { color: palette.textSecondary }]}>
                        For native Hedera Hashgraph support
                    </ThemedText>
                    {walletOptions
                        .filter(w => w.type === 'hedera')
                        .map((wallet) => (
                            <Pressable
                                key={wallet.id}
                                style={[
                                    styles.walletButton,
                                    { backgroundColor: palette.surface, borderColor: palette.border }
                                ]}
                                onPress={() => handleWalletConnect(wallet.id, wallet.type)}
                                disabled={connecting && selectedWallet === wallet.id}
                            >
                                <View style={styles.walletContent}>
                                    <View style={[styles.iconContainer, { backgroundColor: wallet.accentColor }]}>
                                        <View style={styles.iconPlaceholder}>
                                            <ThemedText style={styles.iconText}>
                                                {wallet.label.charAt(0)}
                                            </ThemedText>
                                        </View>
                                    </View>
                                    <View style={styles.walletInfo}>
                                        <ThemedText style={styles.walletLabel}>{wallet.label}</ThemedText>
                                        <ThemedText style={[styles.walletDescription, { color: palette.textSecondary }]}>
                                            Hedera Hashgraph Network
                                        </ThemedText>
                                    </View>
                                    {connecting && selectedWallet === wallet.id ? (
                                        <ActivityIndicator color={wallet.accentColor} />
                                    ) : (
                                        <Feather name="chevron-right" size={20} color={palette.textSecondary} />
                                    )}
                                </View>
                            </Pressable>
                        ))}
                </View>

                {/* ThirdWeb Connect Wallet Button */}
                <View style={styles.section}>
                    <ThemedText style={styles.sectionTitle}>Connect Your Wallet</ThemedText>
                    <ThemedText style={[styles.helperText, { color: palette.textSecondary, marginBottom: spacing.md }]}>
                        Use this button to connect MetaMask, WalletConnect, Coinbase, or other EVM wallets:
                    </ThemedText>
                    <ConnectWallet
                        theme="dark"
                        modalTitle="Select Wallet"
                        switchToActiveChain={true}
                    />
                </View>

                {/* Connected Wallet Info */}
                {address && (
                    <View style={[styles.connectedCard, { backgroundColor: palette.surface, borderColor: palette.success }]}>
                        <Feather name="check-circle" size={24} color={palette.success} />
                        <View style={styles.connectedInfo}>
                            <ThemedText style={styles.connectedLabel}>Connected</ThemedText>
                            <ThemedText style={[styles.connectedAddress, { color: palette.textSecondary }]}>
                                {address.slice(0, 6)}...{address.slice(-4)}
                            </ThemedText>
                        </View>
                        <Pressable onPress={disconnect} style={styles.disconnectButton}>
                            <ThemedText style={[styles.disconnectText, { color: palette.error }]}>
                                Disconnect
                            </ThemedText>
                        </Pressable>
                    </View>
                )}

                <View style={styles.infoBox}>
                    <Feather name="info" size={20} color={palette.primary} />
                    <ThemedText style={[styles.infoText, { color: palette.textSecondary }]}>
                        Your wallet will be used for secure authentication and NFT ticket management
                    </ThemedText>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    backButton: {
        padding: spacing.sm,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2,
    },
    section: {
        marginBottom: spacing.xl,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    helperText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: spacing.sm,
    },
    walletButton: {
        borderRadius: 12,
        borderWidth: 1,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    walletContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    iconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    walletInfo: {
        flex: 1,
    },
    walletLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    walletDescription: {
        fontSize: 13,
    },
    connectedCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 2,
        marginBottom: spacing.lg,
    },
    connectedInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    connectedLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    connectedAddress: {
        fontSize: 12,
        fontFamily: 'monospace',
    },
    disconnectButton: {
        padding: spacing.sm,
    },
    disconnectText: {
        fontSize: 14,
        fontWeight: '600',
    },
    infoBox: {
        flexDirection: 'row',
        padding: spacing.md,
        borderRadius: 8,
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        marginTop: spacing.lg,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
        marginLeft: spacing.sm,
    },
});
