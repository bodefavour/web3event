# Web3 Event Backend - Hedera Hashgraph Edition

Backend API for the Web3 Event Management Platform built with Node.js, Express, MongoDB, and **Hedera Hashgraph SDK**.

## Features

- 🔐 JWT Authentication
- 📊 Event Management (CRUD)
- 🎫 NFT Ticket System (Hedera Token Service)
- 💳 Transaction Tracking on Hedera
- 📈 Analytics Dashboard
- 🔔 Real-time Notifications
- 🌐 Hedera Hashgraph Integration
- 🔒 Security Best Practices

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Blockchain:** Hedera Hashgraph (Testnet/Mainnet)
- **Hedera SDK:** @hashgraph/sdk
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator
- **Security:** helmet, cors, rate-limiting

## Why Hedera?

This project uses **Hedera Hashgraph** instead of traditional blockchains for several key advantages:

- ⚡ **Fast**: 3-5 second transaction finality
- 💰 **Low Cost**: Predictable, low fees (~$0.0001 per transaction)
- 🌱 **Carbon Negative**: Most sustainable DLT platform
- 🔒 **Secure**: aBFT consensus algorithm
- 📊 **Scalable**: 10,000+ TPS
- 🎫 **Native NFT Support**: Hedera Token Service (HTS) for NFT tickets

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- **Hedera testnet account** ([Create one here](https://portal.hedera.com))
- Hedera Account ID and Private Key

### Installation

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/web3event
JWT_SECRET=your_super_secret_jwt_key

# Hedera Configuration
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
```

4. Get Hedera testnet credentials:
   - Visit [Hedera Portal](https://portal.hedera.com)
   - Create a testnet account
   - Get free test HBAR from the faucet
   - Copy your Account ID and Private Key to `.env`

5. Start development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/wallet` - Connect wallet

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/host/:hostId` - Get host's events

### Tickets
- `GET /api/tickets/user/:userId` - Get user's tickets
- `GET /api/tickets/:id` - Get ticket details
- `POST /api/tickets` - Purchase ticket (mint NFT)
- `PUT /api/tickets/:id/verify` - Verify ticket
- `GET /api/tickets/event/:eventId` - Get event tickets

### Transactions
- `GET /api/transactions/user/:userId` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id/status` - Update transaction status
- `GET /api/transactions/event/:eventId` - Get event transactions

### Notifications
- `GET /api/notifications/user/:userId` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Analytics
- `GET /api/analytics/event/:eventId` - Get event analytics
- `GET /api/analytics/host/:hostId` - Get host analytics
- `GET /api/analytics/dashboard` - Get platform analytics

## Database Models

### User
- Email, password, name, role (host/attendee)
- Wallet address
- Profile image, bio

### Event
- Title, description, category
- Location (address, city, country, coordinates)
- Start/end dates
- Ticket types (name, price, quantity, sold)
- Blockchain data (contract address, network)
- Analytics (views, favorites)

### Ticket
- Event reference, owner, ticket type
- Price, quantity, QR code
- NFT metadata (token URI, image)
- Status (active, used, transferred, cancelled)
- Blockchain data (transaction hash, token ID)

### Transaction
- User, event, ticket references
- Type (purchase, refund, transfer)
- Amount, currency, payment method
- Status (pending, completed, failed, refunded)
- Blockchain data (transaction hash, gas info)

### Notification
- User reference, type, title, message
- Read status
- Associated data (event/ticket/transaction IDs)

## Hedera Integration

The backend integrates with **Hedera Hashgraph** for:

- **NFT Ticket Minting**: Using Hedera Token Service (HTS)
- **Smart Contract Execution**: Event creation and management
- **Transaction Verification**: Fast, low-cost transactions
- **Account Management**: Hedera account integration

### Hedera Token Service (HTS) vs Smart Contracts

This project uses **Hedera Token Service** for NFT tickets, which provides:

✅ **Native Token Support**: No smart contract needed
✅ **Lower Costs**: ~$0.0001 per mint vs $0.001+ with contracts
✅ **Better Performance**: Built into Hedera consensus
✅ **Automatic Royalties**: Native royalty support
✅ **Easier Integration**: Simple SDK methods

### Available Hedera Methods

See `src/utils/web3.ts` for the `HederaService` class:

```typescript
// Create NFT token for tickets
await hederaService.createTicketNFT(tokenName, symbol, treasuryId);

// Mint ticket NFTs
await hederaService.mintTicket(tokenId, [metadataURI]);

// Transfer ticket to buyer
await hederaService.transferTicket(tokenId, fromId, toId, serialNumber);

// Get account balance
await hederaService.getAccountBalance(accountId);

// Execute smart contract
await hederaService.executeContract(contractId, functionName, params);
```

### Smart Contract Deployment (Optional)

If you prefer using smart contracts instead of HTS:

1. Compile Solidity contracts:
```bash
# Install Solidity compiler
npm install -g solc

# Compile contracts
solcjs --bin --abi contracts/EventFactory.sol -o contracts/compiled
solcjs --bin --abi contracts/TicketNFT.sol -o contracts/compiled
```

2. Deploy to Hedera:
```bash
npm run deploy
```

3. Update contract IDs in `.env`:
```env
TICKET_NFT_CONTRACT_ID=0.0.xxxxx
EVENT_FACTORY_CONTRACT_ID=0.0.xxxxx
```

### Hedera Network Explorer

- **Testnet**: https://hashscan.io/testnet
- **Mainnet**: https://hashscan.io/mainnet

View all transactions, tokens, and contracts on HashScan.

## Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## Security

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator

## Error Handling

All endpoints return consistent JSON responses:

```json
{
  "success": true|false,
  "message": "Description",
  "data": { ... },
  "errors": [ ... ]
}
```

## Connecting Frontend

Update your React Native frontend to use this backend:

1. Set API base URL: `http://localhost:5000/api` (development)
2. Include JWT token in headers: `Authorization: Bearer <token>`
3. Handle response format and error messages

Example fetch:
```typescript
const response = await fetch('http://localhost:5000/api/events', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
```

## Production Deployment

1. Build TypeScript:
```bash
npm run build
```

2. Set production environment variables
3. Use process manager (PM2):
```bash
pm2 start dist/server.js
```

4. Configure reverse proxy (nginx)
5. Enable SSL/TLS certificates
6. Set up MongoDB replica set
7. Deploy smart contracts to mainnet

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License
