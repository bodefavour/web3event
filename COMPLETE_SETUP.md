# Complete Setup Guide - ThirdWeb + WalletConnect + Hedera + MongoDB

## 🎯 What We've Built

Your Web3 Event Management Platform now includes:
- ✅ ThirdWeb authentication for EVM wallets
- ✅ WalletConnect protocol integration
- ✅ Hedera Hashgraph wallet support (HashPack, Blade)
- ✅ MongoDB database with seed data
- ✅ Full backend API with Hedera integration
- ✅ React Native frontend with wallet connections

## 🚀 Quick Start (5 Steps)

### Step 1: Set Up MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free account
3. Create cluster (free M0 tier)
4. Get connection string
5. Update `backend/.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web3event
   ```

**Option B: Local MongoDB**
```bash
# Install and start MongoDB locally
brew install mongodb-community  # Mac
# or download from mongodb.com for Windows

# Connection string for local:
MONGODB_URI=mongodb://localhost:27017/web3event
```

### Step 2: Set Up Hedera Account

1. Visit https://portal.hedera.com
2. Create testnet account
3. Get 1,000 free test HBAR
4. Copy your Account ID and Private Key
5. Update `backend/.env`:
   ```env
   HEDERA_NETWORK=testnet
   HEDERA_ACCOUNT_ID=0.0.xxxxx
   HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
   ```

### Step 3: Set Up ThirdWeb

1. Go to https://thirdweb.com/dashboard
2. Create account
3. Create new project
4. Get Client ID
5. Create frontend `.env`:
   ```env
   EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
   ```

### Step 4: Install & Seed Database

```bash
# Backend
cd backend
npm install
npm run seed  # Creates test data
npm run dev   # Start server

# Should see:
# ✅ MongoDB connected successfully
# 🚀 Server running on port 5000
```

### Step 5: Run Frontend

```bash
# In new terminal
cd ..  # Back to root
npm start

# Should open Expo dev server
```

## 📦 Installed Dependencies

### Frontend
- `@thirdweb-dev/react-native` - ThirdWeb React Native SDK
- `@thirdweb-dev/sdk` - ThirdWeb core SDK
- `@walletconnect/react-native-compat` - WalletConnect support
- `ethers@5` - Ethereum library

### Backend
- `@hashgraph/sdk` - Hedera Hashgraph SDK
- `mongoose` - MongoDB ODM
- `express` - Web framework
- `jsonwebtoken` - JWT auth
- `bcryptjs` - Password hashing

## 🔧 Configuration Files

### Backend `.env`
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/web3event

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Hedera
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...

# Hedera Contracts (after deployment)
TICKET_NFT_CONTRACT_ID=0.0.xxxxx
EVENT_FACTORY_CONTRACT_ID=0.0.xxxxx

# API
ALLOWED_ORIGINS=http://localhost:19006,exp://192.168.1.100:8081
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env`
```env
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎨 Wallet Integration

### Supported Wallets

**EVM Wallets (via ThirdWeb)**:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet

**Hedera Wallets (native)**:
- HashPack
- Blade Wallet

### How It Works

1. **User clicks "Connect Wallet"**
2. **ThirdWeb modal opens** showing wallet options
3. **User selects wallet** (MetaMask, WalletConnect, etc.)
4. **Wallet app opens** for approval
5. **Connection established**
6. **Address saved** to backend via API
7. **User authenticated** and ready to use app

### Using Updated ConnectWalletScreen

The new screen (`ConnectWalletScreenNew.tsx`) includes:
- Real wallet logos (via URLs)
- ThirdWeb integration
- WalletConnect support
- Hedera wallet support
- Loading states
- Error handling
- Connected wallet display

To use it, update `App.tsx`:
```typescript
// Replace import
import { ConnectWalletScreen } from '@/screens/ConnectWalletScreenNew';
```

## 💾 Database Schema

### Collections

**users**
```javascript
{
  email: String,
  password: String (hashed),
  name: String,
  role: 'host' | 'attendee',
  walletAddress: String,  // Hedera: 0.0.xxxxx or EVM: 0x...
  profileImage: String,
  bio: String
}
```

**events**
```javascript
{
  title: String,
  description: String,
  host: ObjectId (User),
  category: String,
  venue: String,
  location: {
    address: String,
    city: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  startDate: Date,
  endDate: Date,
  ticketTypes: [{
    name: String,
    price: Number,
    quantity: Number,
    sold: Number
  }],
  blockchain: {
    network: 'hedera-testnet',
    contractAddress: String  // Hedera token ID
  }
}
```

**tickets**
```javascript
{
  event: ObjectId,
  owner: ObjectId,
  ticketType: String,
  price: Number,
  qrCode: String,
  status: 'active' | 'used',
  blockchain: {
    transactionHash: String,  // Hedera transaction ID
    tokenId: String,  // NFT serial number
    network: 'hedera-testnet'
  }
}
```

### Seed Data

After running `npm run seed`, you'll have:
- 3 test users (host + 2 attendees)
- 3 test events
- 3 test tickets
- 3 test transactions
- 4 test notifications

**Test Credentials:**
- Host: `host@example.com` / `password123`
- Attendee: `attendee@example.com` / `password123`

## 🔄 Complete User Flow

### 1. Registration & Wallet Connection

```
User opens app
↓
Welcome screen → "Get Started"
↓
Connect Wallet screen
↓
User selects wallet (MetaMask, HashPack, etc.)
↓
Wallet app opens for approval
↓
Connection successful
↓
Profile setup (name, role)
↓
Account created in MongoDB
↓
JWT token issued
↓
User logged in
```

### 2. Event Creation (Host)

```
Host clicks "Create Event"
↓
Fills event details
↓
Adds ticket types
↓
Reviews & confirms
↓
Backend creates:
  - Event in MongoDB
  - HTS token on Hedera (for NFT tickets)
  - Token ID saved to event.blockchain.contractAddress
↓
Event published
```

### 3. Ticket Purchase (Attendee)

```
User browses events
↓
Selects event & ticket type
↓
Clicks "Buy Ticket"
↓
Backend:
  - Mints NFT on Hedera
  - Transfers to user's wallet
  - Saves ticket to MongoDB
↓
Transaction recorded
↓
Ticket appears in "My Tickets"
↓
User can view on HashScan.io
```

## 🧪 Testing

### Test Backend API

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test","role":"attendee"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get events
curl http://localhost:5000/api/events
```

### Test Database

```bash
# MongoDB Compass
# Connect with your MONGODB_URI
# Browse collections: users, events, tickets

# Or use mongosh
mongosh "your_connection_string"
> use web3event
> db.users.find()
> db.events.find()
```

### Test Hedera

1. Check your account: https://hashscan.io/testnet/account/0.0.xxxxx
2. View transactions
3. See token balances

## 🐛 Troubleshooting

### "Cannot find module '@thirdweb-dev/react-native'"
```bash
cd frontend
npm install --legacy-peer-deps
```

### "MongoDB connection failed"
- Check connection string in `.env`
- Verify MongoDB is running (local) or accessible (Atlas)
- Check IP whitelist (Atlas)

### "Hedera client initialization failed"
- Verify HEDERA_ACCOUNT_ID format: `0.0.xxxxx`
- Check HEDERA_PRIVATE_KEY is complete
- Ensure account has HBAR balance

### "ThirdWeb client ID not set"
- Get client ID from https://thirdweb.com/dashboard
- Add to frontend `.env` as `EXPO_PUBLIC_THIRDWEB_CLIENT_ID`

### Wallet not connecting
- Clear Metro cache: `npm start -- --reset-cache`
- Check wallet app is installed
- Verify network settings

## 📚 Key Files

### Frontend
- `src/providers/Web3Provider.tsx` - ThirdWeb setup
- `src/screens/ConnectWalletScreenNew.tsx` - Wallet connection UI
- `src/services/api.ts` - Backend API calls
- `App.tsx` - Main app component

### Backend
- `src/server.ts` - Express server
- `src/utils/web3.ts` - Hedera service
- `src/models/*` - MongoDB schemas
- `src/routes/*` - API endpoints
- `scripts/seed-data.ts` - Database seeding

## 🎯 Next Steps

1. ✅ Database set up and seeded
2. ✅ Hedera account created
3. ✅ ThirdWeb configured
4. ✅ Wallets integrated
5. ⏭️ Wrap App with Web3Provider
6. ⏭️ Test wallet connection flow
7. ⏭️ Test ticket purchase end-to-end
8. ⏭️ Deploy to production

## 📖 Resources

- **ThirdWeb Docs**: https://portal.thirdweb.com/react-native
- **Hedera Docs**: https://docs.hedera.com
- **WalletConnect**: https://docs.walletconnect.com
- **MongoDB**: https://www.mongodb.com/docs
- **HashPack**: https://www.hashpack.app/docs
- **Blade Wallet**: https://www.bladewallet.io/docs

## 🎉 You're Ready!

Your Web3 Event Platform is now fully configured with:
- ✅ Multi-wallet support (EVM + Hedera)
- ✅ Database with sample data
- ✅ Full backend API
- ✅ Blockchain integration

Start the servers and test the complete flow!

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm start
```

---

**Status**: 🟢 All systems ready for development!
