# Frontend-Backend Integration Guide

## ✅ Setup Complete

The frontend is now connected to the Hedera-powered backend!

## 📦 What's Been Added

### 1. API Service (`src/services/api.ts`)
Complete API client with all backend endpoints:
- Authentication (register, login, wallet connect)
- Events (CRUD operations)
- Tickets (purchase, verify, list)
- Transactions (blockchain tracking)
- Notifications
- Analytics

### 2. Token Management
- Automatic token storage with AsyncStorage
- Token injection in all authenticated requests
- Token persistence across app restarts

### 3. Error Handling
- Centralized error handling
- Automatic error logging
- User-friendly error messages

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Update API URL (if needed)
Edit `src/services/api.ts`:
```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Local development
  : 'https://your-api.com/api';  // Production
```

For Android emulator, use: `http://10.0.2.2:5000/api`
For physical device, use your computer's IP: `http://192.168.1.X:5000/api`

### 3. Start Frontend
```bash
npm start
```

## 📝 Usage Examples

### Authentication

```typescript
import apiService from '@/services/api';

// Register
const response = await apiService.register(
  'user@example.com',
  'password123',
  'John Doe',
  'attendee'  // or 'host'
);

// Login
const response = await apiService.login(
  'user@example.com',
  'password123'
);

// Logout
await apiService.logout();
```

### Events

```typescript
// Get all events
const response = await apiService.getEvents({
  category: 'Technology',
  city: 'San Francisco',
  page: 1,
  limit: 10
});
const events = response.data.events;

// Get single event
const response = await apiService.getEvent(eventId);
const event = response.data.event;

// Create event (host only)
const response = await apiService.createEvent({
  title: 'Summer Festival 2025',
  description: 'Amazing summer event',
  category: 'Music',
  venue: 'City Park',
  location: {
    address: '123 Main St',
    city: 'San Francisco',
    country: 'USA'
  },
  startDate: '2025-07-01T10:00:00Z',
  endDate: '2025-07-01T22:00:00Z',
  ticketTypes: [
    {
      name: 'General Admission',
      price: 50,
      quantity: 1000,
      description: 'Standard entry'
    },
    {
      name: 'VIP',
      price: 150,
      quantity: 100,
      description: 'VIP access with lounge'
    }
  ],
  host: userId
});
```

### Tickets

```typescript
// Purchase ticket
const response = await apiService.purchaseTicket({
  eventId: 'event_id_here',
  userId: 'user_id_here',
  ticketType: 'General Admission',
  quantity: 2,
  transactionHash: 'hedera_transaction_id',  // From Hedera SDK
  contractAddress: 'hedera_token_id'
});

// Get user's tickets
const response = await apiService.getUserTickets(userId);
const tickets = response.data.tickets;

// Get single ticket
const response = await apiService.getTicket(ticketId);
const ticket = response.data.ticket;

// Verify ticket (at event entrance)
const response = await apiService.verifyTicket(ticketId, qrCode);
```

### Analytics (Host)

```typescript
// Get event analytics
const response = await apiService.getEventAnalytics(eventId);
const analytics = response.data;
// Returns: ticket sales, revenue, demographics, etc.

// Get host analytics (all events)
const response = await apiService.getHostAnalytics(hostId);
const analytics = response.data;
// Returns: total revenue, ticket sales, top events, etc.
```

### Notifications

```typescript
// Get user notifications
const response = await apiService.getUserNotifications(userId);
const notifications = response.data.notifications;

// Mark as read
await apiService.markNotificationAsRead(notificationId);

// Mark all as read
await apiService.markAllNotificationsAsRead(userId);
```

## 🔐 Authentication Flow

### 1. App Initialization
```typescript
// In App.tsx - Already added
useEffect(() => {
  apiService.initialize();  // Loads saved token
}, []);
```

### 2. Login/Register
```typescript
const handleLogin = async () => {
  try {
    const response = await apiService.login(email, password);
    if (response.success) {
      // Token is automatically saved
      const user = response.data.user;
      // Update app state with user data
      setUser(user);
      setIsAuthenticated(true);
    }
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};
```

### 3. Making Authenticated Requests
```typescript
// Token is automatically included in all requests
const response = await apiService.getUserTickets(userId);
// No need to manually add Authorization header
```

### 4. Logout
```typescript
const handleLogout = async () => {
  await apiService.logout();  // Clears token
  setUser(null);
  setIsAuthenticated(false);
};
```

## 🎫 Ticket Purchase Flow with Hedera

### Full Integration Example:

```typescript
const purchaseTicketWithHedera = async (
  event: any,
  ticketType: string,
  quantity: number
) => {
  try {
    // 1. Show loading
    setLoading(true);

    // 2. (Optional) Mint NFT on Hedera
    // You can use Hedera SDK here or let backend handle it
    // For now, backend will mint when you call purchaseTicket
    
    // 3. Create transaction record
    const mockTransactionHash = `hedera-tx-${Date.now()}`;
    
    // 4. Call backend to create ticket
    const response = await apiService.purchaseTicket({
      eventId: event._id,
      userId: currentUser.id,
      ticketType: ticketType,
      quantity: quantity,
      transactionHash: mockTransactionHash,
    });

    if (response.success) {
      // 5. Show success screen
      navigation.navigate('transactionSuccess', {
        eventTitle: event.title,
        quantity: quantity,
        ticketId: response.data.ticket._id
      });
    }
  } catch (error: any) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
  }
};
```

## 🔄 Real-time Updates

### Polling for Updates (Simple Approach)

```typescript
useEffect(() => {
  const interval = setInterval(async () => {
    // Refresh tickets every 30 seconds
    const response = await apiService.getUserTickets(userId);
    setTickets(response.data.tickets);
  }, 30000);

  return () => clearInterval(interval);
}, [userId]);
```

### Socket.io (Advanced - Backend has socket.io)

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen for ticket updates
socket.on('ticketPurchased', (data) => {
  console.log('New ticket purchased:', data);
  // Refresh ticket list
});

// Listen for notifications
socket.on('notification', (notification) => {
  showNotification(notification);
});
```

## 🐛 Error Handling

### Handling API Errors

```typescript
try {
  const response = await apiService.getEvents();
} catch (error: any) {
  if (error.message.includes('Network')) {
    Alert.alert('Network Error', 'Please check your connection');
  } else if (error.message.includes('401')) {
    // Token expired
    await apiService.logout();
    navigation.navigate('login');
  } else {
    Alert.alert('Error', error.message);
  }
}
```

### Global Error Handler

```typescript
// In App.tsx
useEffect(() => {
  const handleError = (error: any) => {
    console.error('Global error:', error);
    // Log to error tracking service (Sentry, etc.)
  };

  // Add global error listener
  // ErrorUtils.setGlobalHandler(handleError);
}, []);
```

## 📱 Screen Integration Examples

### Update EventsScreen

```typescript
const [events, setEvents] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadEvents();
}, []);

const loadEvents = async () => {
  setLoading(true);
  try {
    const response = await apiService.getEvents({
      status: 'published',
      page: 1,
      limit: 20
    });
    setEvents(response.data.events);
  } catch (error) {
    console.error('Failed to load events:', error);
  } finally {
    setLoading(false);
  }
};
```

### Update MyTicketsScreen

```typescript
const [tickets, setTickets] = useState([]);

useEffect(() => {
  loadTickets();
}, []);

const loadTickets = async () => {
  try {
    const response = await apiService.getUserTickets(currentUser.id);
    setTickets(response.data.tickets);
  } catch (error) {
    console.error('Failed to load tickets:', error);
  }
};
```

### Update AnalyticsScreen

```typescript
const [analytics, setAnalytics] = useState(null);

useEffect(() => {
  loadAnalytics();
}, [eventId]);

const loadAnalytics = async () => {
  try {
    const response = await apiService.getEventAnalytics(eventId);
    setAnalytics(response.data);
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
};
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in root:

```env
API_BASE_URL=http://localhost:5000/api
API_TIMEOUT=30000
```

### Network Configuration

For different environments:

```typescript
// Development (localhost)
const API_URL = 'http://localhost:5000/api';

// Android Emulator
const API_URL = 'http://10.0.2.2:5000/api';

// iOS Simulator
const API_URL = 'http://localhost:5000/api';

// Physical Device (same network)
const API_URL = 'http://192.168.1.100:5000/api';

// Production
const API_URL = 'https://api.yourdomain.com/api';
```

## ✅ Testing

### Test Backend Connection

```typescript
const testConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('Backend status:', data);
  } catch (error) {
    console.error('Backend not reachable:', error);
  }
};
```

### Test API Calls

```typescript
// Add this to any screen for testing
useEffect(() => {
  testAPI();
}, []);

const testAPI = async () => {
  try {
    console.log('Testing API...');
    
    // Test events endpoint
    const events = await apiService.getEvents();
    console.log('Events:', events);
    
    // Test authentication
    const loginResult = await apiService.login('test@example.com', 'password');
    console.log('Login:', loginResult);
    
  } catch (error) {
    console.error('API Test failed:', error);
  }
};
```

## 📚 Next Steps

1. ✅ Backend running with Hedera integration
2. ✅ Frontend API service created
3. ✅ API initialized in App.tsx
4. ⏭️ Update screens to use real API calls
5. ⏭️ Implement Hedera SDK in frontend for wallet operations
6. ⏭️ Add loading states and error handling
7. ⏭️ Test end-to-end ticket purchase flow
8. ⏭️ Deploy backend to cloud (Heroku/Railway/Render)
9. ⏭️ Update API_BASE_URL for production

## 🎯 Priority Integration Tasks

1. **Authentication Screens** - Add login/register with API
2. **Events List** - Load events from backend
3. **Ticket Purchase** - Integrate with backend + Hedera
4. **My Tickets** - Load user's tickets from backend
5. **Event Creation** - Save to backend instead of mock data
6. **Analytics** - Load real analytics from backend

## 📖 Documentation

- **API Service**: `src/services/api.ts`
- **Examples**: `src/services/apiExamples.tsx`
- **Backend README**: `backend/README.md`
- **Hedera Guide**: `backend/HEDERA_GUIDE.md`

## 🚀 You're Ready!

The backend and frontend are now connected. Start integrating the API calls into your screens to replace mock data with real backend data!
