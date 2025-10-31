// API Service for connecting to backend
import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend URL - Update this based on your environment
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-production-api.com/api';  // Production

// Token storage keys
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

// API Service
class APIService {
  private token: string | null = null;

  // Initialize and load token from storage
  async initialize() {
    try {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to load auth token:', error);
    }
  }

  // Set authentication token
  async setToken(token: string) {
    this.token = token;
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Failed to save auth token:', error);
    }
  }

  // Remove authentication token
  async removeToken() {
    this.token = null;
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to remove auth token:', error);
    }
  }

  // Get authentication token
  getToken(): string | null {
    return this.token;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // --- Authentication ---

  async register(email: string, password: string, name: string, role: 'host' | 'attendee') {
    const response = await this.post<any>('/auth/register', {
      email,
      password,
      name,
      role,
    });
    
    if (response.data?.token) {
      await this.setToken(response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async login(email: string, password: string) {
    const response = await this.post<any>('/auth/login', {
      email,
      password,
    });
    
    if (response.data?.token) {
      await this.setToken(response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    
    return response;
  }

  async logout() {
    await this.removeToken();
  }

  async connectWallet(walletAddress: string, userId: string) {
    return this.post<any>('/auth/wallet', {
      walletAddress,
      userId,
    });
  }

  // --- Users ---

  async getUserProfile(userId: string) {
    return this.get<any>(`/users/${userId}`);
  }

  async updateUserProfile(userId: string, data: any) {
    return this.put<any>(`/users/${userId}`, data);
  }

  // --- Events ---

  async getEvents(params?: {
    category?: string;
    city?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.get<any>(`/events${queryString}`);
  }

  async getEvent(eventId: string) {
    return this.get<any>(`/events/${eventId}`);
  }

  async createEvent(eventData: any) {
    return this.post<any>('/events', eventData);
  }

  async updateEvent(eventId: string, eventData: any) {
    return this.put<any>(`/events/${eventId}`, eventData);
  }

  async deleteEvent(eventId: string) {
    return this.delete<any>(`/events/${eventId}`);
  }

  async getHostEvents(hostId: string) {
    return this.get<any>(`/events/host/${hostId}`);
  }

  // --- Tickets ---

  async getUserTickets(userId: string, status?: string) {
    const queryString = status ? `?status=${status}` : '';
    return this.get<any>(`/tickets/user/${userId}${queryString}`);
  }

  async getTicket(ticketId: string) {
    return this.get<any>(`/tickets/${ticketId}`);
  }

  async purchaseTicket(ticketData: {
    eventId: string;
    userId: string;
    ticketType: string;
    quantity: number;
    transactionHash: string;
    contractAddress?: string;
  }) {
    return this.post<any>('/tickets', ticketData);
  }

  async verifyTicket(ticketId: string, qrCode: string) {
    return this.put<any>(`/tickets/${ticketId}/verify`, { qrCode });
  }

  async getEventTickets(eventId: string) {
    return this.get<any>(`/tickets/event/${eventId}`);
  }

  // --- Transactions ---

  async getUserTransactions(userId: string, type?: string, status?: string) {
    const params: any = {};
    if (type) params.type = type;
    if (status) params.status = status;
    const queryString = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.get<any>(`/transactions/user/${userId}${queryString}`);
  }

  async getTransaction(transactionId: string) {
    return this.get<any>(`/transactions/${transactionId}`);
  }

  async createTransaction(transactionData: any) {
    return this.post<any>('/transactions', transactionData);
  }

  async updateTransactionStatus(transactionId: string, status: string) {
    return this.put<any>(`/transactions/${transactionId}/status`, { status });
  }

  async getEventTransactions(eventId: string) {
    return this.get<any>(`/transactions/event/${eventId}`);
  }

  // --- Notifications ---

  async getUserNotifications(userId: string, read?: boolean, type?: string) {
    const params: any = {};
    if (read !== undefined) params.read = read.toString();
    if (type) params.type = type;
    const queryString = Object.keys(params).length
      ? '?' + new URLSearchParams(params).toString()
      : '';
    return this.get<any>(`/notifications/user/${userId}${queryString}`);
  }

  async markNotificationAsRead(notificationId: string) {
    return this.put<any>(`/notifications/${notificationId}/read`, {});
  }

  async markAllNotificationsAsRead(userId: string) {
    return this.put<any>(`/notifications/user/${userId}/read-all`, {});
  }

  async deleteNotification(notificationId: string) {
    return this.delete<any>(`/notifications/${notificationId}`);
  }

  // --- Analytics ---

  async getEventAnalytics(eventId: string) {
    return this.get<any>(`/analytics/event/${eventId}`);
  }

  async getHostAnalytics(hostId: string) {
    return this.get<any>(`/analytics/host/${hostId}`);
  }

  async getDashboardAnalytics() {
    return this.get<any>('/analytics/dashboard');
  }
}

// Export singleton instance
const apiService = new APIService();
export default apiService;
