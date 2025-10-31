// Example: Using the API service in a screen
// This shows how to integrate real API calls with the existing screens

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import apiService from '@/services/api';

export function LoginScreen({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.login(email, password);

            if (response.success) {
                Alert.alert('Success', 'Login successful!');
                onLoginSuccess(response.data.user);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

// Example: Using API in Events Screen
export async function loadEvents(filters?: any) {
    try {
        const response = await apiService.getEvents(filters);

        if (response.success) {
            return response.data.events;
        }
        return [];
    } catch (error) {
        console.error('Failed to load events:', error);
        return [];
    }
}

// Example: Creating an event
export async function createNewEvent(eventData: any, hostId: string) {
    try {
        const response = await apiService.createEvent({
            ...eventData,
            host: hostId,
        });

        if (response.success) {
            Alert.alert('Success', 'Event created successfully!');
            return response.data.event;
        }
    } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to create event');
        throw error;
    }
}

// Example: Purchasing a ticket
export async function purchaseTicket(
    eventId: string,
    userId: string,
    ticketType: string,
    quantity: number
) {
    try {
        // 1. Create transaction on Hedera (you'll implement this with Hedera SDK on frontend)
        const mockTransactionHash = 'hedera-tx-' + Date.now(); // Replace with real Hedera tx

        // 2. Call backend API to create ticket
        const response = await apiService.purchaseTicket({
            eventId,
            userId,
            ticketType,
            quantity,
            transactionHash: mockTransactionHash,
        });

        if (response.success) {
            Alert.alert('Success', 'Ticket purchased successfully!');
            return response.data.ticket;
        }
    } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to purchase ticket');
        throw error;
    }
}

// Example: Getting user's tickets
export async function loadUserTickets(userId: string) {
    try {
        const response = await apiService.getUserTickets(userId);

        if (response.success) {
            return response.data.tickets;
        }
        return [];
    } catch (error) {
        console.error('Failed to load tickets:', error);
        return [];
    }
}

// Example: Getting event analytics
export async function loadEventAnalytics(eventId: string) {
    try {
        const response = await apiService.getEventAnalytics(eventId);

        if (response.success) {
            return response.data;
        }
        return null;
    } catch (error) {
        console.error('Failed to load analytics:', error);
        return null;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
