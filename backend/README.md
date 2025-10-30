# Web3 Event Backend

Backend API for the Web3 Event Management Platform built with Node.js, Express, MongoDB, and Ethers.js.

## Features

- 🔐 JWT Authentication
- 📊 Event Management (CRUD)
- 🎫 NFT Ticket System
- 💳 Transaction Tracking
- 📈 Analytics Dashboard
- 🔔 Real-time Notifications
- 🌐 Web3 Integration (Ethereum/Sepolia)
- 🔒 Security Best Practices

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Blockchain:** Ethers.js (Sepolia testnet)
- **Authentication:** JWT + bcrypt
- **Validation:** express-validator
- **Security:** helmet, cors, rate-limiting

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- Ethereum wallet with Sepolia testnet ETH
- Infura project ID (for blockchain connection)

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
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_wallet_private_key
```

4. Start development server:
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

## Web3 Integration

The backend integrates with Ethereum blockchain (Sepolia testnet) for:

- **NFT Ticket Minting:** Each ticket is an NFT
- **Smart Contract Interaction:** Event creation and management
- **Transaction Verification:** Blockchain transaction validation
- **Wallet Management:** Connect and manage user wallets

### Smart Contracts (Required)

Deploy these contracts to Sepolia testnet:

1. **TicketNFT Contract:** ERC-721 for ticket NFTs
2. **EventFactory Contract:** Create and manage events

Update contract addresses in `.env` file.

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
