# Hedera Hashgraph Integration Guide

Complete guide for integrating Hedera Hashgraph with the Web3 Event Management Platform.

## Table of Contents

1. [Getting Started with Hedera](#getting-started)
2. [Account Setup](#account-setup)
3. [Hedera Token Service (HTS)](#hedera-token-service)
4. [Smart Contracts](#smart-contracts)
5. [API Integration](#api-integration)
6. [Testing](#testing)
7. [Production Deployment](#production)

## Getting Started with Hedera

### What is Hedera?

Hedera Hashgraph is a distributed ledger technology that offers:
- **3-5 second finality** (vs 12+ seconds on Ethereum)
- **10,000+ TPS** capacity
- **$0.0001 average transaction cost**
- **Carbon negative** operation
- **aBFT consensus** (highest security)

### Key Concepts

**Account IDs**: Format `0.0.xxxxx` (e.g., `0.0.12345`)
**Token IDs**: Format `0.0.xxxxx` for HTS tokens
**Contract IDs**: Format `0.0.xxxxx` for smart contracts
**Transaction IDs**: Format `0.0.xxxxx@1234567890.123456789`

## Account Setup

### 1. Create Hedera Testnet Account

Visit [Hedera Portal](https://portal.hedera.com) and:

1. Sign up for a free account
2. Create a testnet account
3. Get **1,000 free test HBAR** from the faucet
4. Copy your:
   - Account ID (e.g., `0.0.12345`)
   - Private Key (e.g., `302e020100300506032b657004220420...`)

### 2. Configure Environment

Update `.env` file:

```env
HEDERA_NETWORK=testnet
HEDERA_ACCOUNT_ID=0.0.12345
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_OPERATOR_KEY=302e020100300506032b657004220420...
```

### 3. Verify Connection

```typescript
import { HederaService } from './utils/web3';

const hedera = new HederaService();
const balance = await hedera.getAccountBalance('0.0.12345');
console.log(`Balance: ${balance.hbars} HBAR`);
```

## Hedera Token Service (HTS)

### Why Use HTS?

HTS is **recommended** over smart contracts for NFT tickets:

| Feature | HTS | Smart Contract |
|---------|-----|----------------|
| Cost | ~$0.0001/mint | ~$0.001+/mint |
| Speed | 3-5 seconds | 3-5 seconds |
| Complexity | Low | High |
| Royalties | Native support | Custom code |
| Integration | Simple SDK | ABI + bytecode |

### Creating NFT Token

```typescript
// Create NFT token for event tickets
const result = await hederaService.createTicketNFT(
  'Summer Festival Tickets',  // Token name
  'SUMFEST',                   // Token symbol
  '0.0.12345'                  // Treasury account
);

console.log(`Token ID: ${result.tokenId}`);
// Output: Token ID: 0.0.67890
```

Update `.env`:
```env
TICKET_NFT_CONTRACT_ID=0.0.67890
```

### Minting Tickets

```typescript
// Mint 5 tickets with metadata
const metadata = [
  'ipfs://QmXxx1',  // Ticket 1 metadata
  'ipfs://QmXxx2',  // Ticket 2 metadata
  'ipfs://QmXxx3',  // Ticket 3 metadata
  'ipfs://QmXxx4',  // Ticket 4 metadata
  'ipfs://QmXxx5',  // Ticket 5 metadata
];

const mintResult = await hederaService.mintTicket(
  '0.0.67890',  // Token ID
  metadata
);

console.log(`Minted serial numbers: ${mintResult.serialNumbers}`);
// Output: [1, 2, 3, 4, 5]
```

### Associating Token

Users must associate the token before receiving it:

```typescript
// User associates token with their account
await hederaService.associateToken(
  '0.0.67890',  // Token ID
  '0.0.99999',  // User account ID
  'user_private_key'
);
```

### Transferring Tickets

```typescript
// Transfer ticket to buyer
await hederaService.transferTicket(
  '0.0.67890',  // Token ID
  '0.0.12345',  // From (treasury)
  '0.0.99999',  // To (buyer)
  1             // Serial number
);
```

## Smart Contracts

### Option 1: Use HTS (Recommended)

For most use cases, **use HTS** as shown above. Skip smart contracts.

### Option 2: Deploy Smart Contracts

If you need custom logic:

#### 1. Compile Contracts

```bash
# Install Solidity compiler
npm install -g solc

# Compile EventFactory
solcjs --bin --abi contracts/EventFactory.sol -o contracts/compiled

# Compile TicketNFT (optional, use HTS instead)
solcjs --bin --abi contracts/TicketNFT.sol -o contracts/compiled
```

#### 2. Deploy to Hedera

```bash
npm run deploy
```

#### 3. Update Configuration

```env
EVENT_FACTORY_CONTRACT_ID=0.0.xxxxx
```

### Using Smart Contracts

```typescript
import { ContractFunctionParameters } from '@hashgraph/sdk';

// Create event on chain
const params = new ContractFunctionParameters()
  .addString('Summer Festival 2025')
  .addUint256(1735689600)  // Start timestamp
  .addUint256(1735776000)  // End timestamp
  .addUint256(1000)        // Total tickets
  .addUint256(50);         // Price (in tinybar)

const result = await hederaService.executeContract(
  '0.0.xxxxx',      // Contract ID
  'createEvent',    // Function name
  params,
  150000            // Gas limit
);
```

## API Integration

### Ticket Purchase Flow

```typescript
// 1. User purchases ticket via API
POST /api/tickets
{
  "eventId": "event_mongo_id",
  "userId": "user_mongo_id",
  "ticketType": "VIP",
  "quantity": 2,
  "userAccountId": "0.0.99999"
}

// 2. Backend mints NFT on Hedera
const mintResult = await hederaService.mintTicket(
  process.env.TICKET_NFT_CONTRACT_ID,
  [metadataURI1, metadataURI2]
);

// 3. Transfer to user
for (let serial of mintResult.serialNumbers) {
  await hederaService.transferTicket(
    process.env.TICKET_NFT_CONTRACT_ID,
    process.env.HEDERA_ACCOUNT_ID,
    userAccountId,
    parseInt(serial)
  );
}

// 4. Save to database
const ticket = await Ticket.create({
  event: eventId,
  owner: userId,
  blockchain: {
    transactionHash: mintResult.transactionId,
    tokenId: mintResult.serialNumbers,
    network: 'hedera-testnet'
  }
});
```

### Event Creation Flow

```typescript
// 1. Host creates event via API
POST /api/events
{
  "title": "Summer Festival 2025",
  "startDate": "2025-01-01T00:00:00Z",
  "ticketTypes": [
    { "name": "General", "price": 50, "quantity": 500 },
    { "name": "VIP", "price": 150, "quantity": 100 }
  ]
}

// 2. Backend creates NFT token for event
const tokenResult = await hederaService.createTicketNFT(
  `${event.title} Tickets`,
  event.title.substring(0, 4).toUpperCase(),
  process.env.HEDERA_ACCOUNT_ID
);

// 3. Save to database
const event = await Event.create({
  title: req.body.title,
  blockchain: {
    network: 'hedera-testnet',
    contractAddress: tokenResult.tokenId
  }
});
```

## Testing

### Testnet Testing

```bash
# Start development server
npm run dev

# Test ticket purchase
curl -X POST http://localhost:5000/api/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event_id",
    "userId": "user_id",
    "ticketType": "General",
    "quantity": 1,
    "userAccountId": "0.0.99999"
  }'
```

### View on HashScan

All transactions visible at: https://hashscan.io/testnet

Search by:
- Account ID
- Token ID
- Transaction ID
- Contract ID

## Production Deployment

### 1. Mainnet Account

1. Create mainnet account at [Hedera Portal](https://portal.hedera.com)
2. Fund with real HBAR
3. Update `.env`:

```env
HEDERA_NETWORK=mainnet
HEDERA_ACCOUNT_ID=0.0.xxxxx
HEDERA_PRIVATE_KEY=your_mainnet_private_key
```

### 2. Deploy Tokens/Contracts

```bash
# Deploy to mainnet
HEDERA_NETWORK=mainnet npm run deploy
```

### 3. Security Checklist

- ✅ Use environment variables for keys
- ✅ Never commit private keys
- ✅ Use separate accounts for dev/prod
- ✅ Implement rate limiting
- ✅ Validate all user inputs
- ✅ Monitor transaction costs
- ✅ Set up alerts for failed transactions

### 4. Cost Estimation

**Hedera Testnet**: Free
**Hedera Mainnet**:
- Create NFT token: ~$1 (one-time)
- Mint NFT: ~$0.0001 per ticket
- Transfer NFT: ~$0.0001 per transfer
- Contract execution: ~$0.001 per call

**Example**: 1,000 ticket sales = ~$0.20 in fees

## Resources

### Official Documentation
- [Hedera Docs](https://docs.hedera.com)
- [Hedera SDK for JavaScript](https://github.com/hashgraph/hedera-sdk-js)
- [Token Service Guide](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service)
- [Smart Contract Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts)

### Tools
- [Hedera Portal](https://portal.hedera.com) - Account management
- [HashScan Explorer](https://hashscan.io) - Transaction explorer
- [Hedera Faucet](https://portal.hedera.com) - Free testnet HBAR
- [SDKs](https://docs.hedera.com/hedera/sdks-and-apis) - Multiple language support

### Community
- [Discord](https://hedera.com/discord)
- [GitHub](https://github.com/hashgraph)
- [YouTube](https://www.youtube.com/hedera)
- [Twitter](https://twitter.com/hedera)

## Troubleshooting

### "INSUFFICIENT_TX_FEE"
**Solution**: Account needs more HBAR. Get testnet HBAR from faucet.

### "INVALID_ACCOUNT_ID"
**Solution**: Check account ID format is `0.0.xxxxx`

### "TOKEN_NOT_ASSOCIATED_TO_ACCOUNT"
**Solution**: User must associate token before receiving it:
```typescript
await hederaService.associateToken(tokenId, userAccountId, userPrivateKey);
```

### "INSUFFICIENT_TOKEN_BALANCE"
**Solution**: Treasury account needs to own tokens before transferring.

### Connection Issues
**Solution**: Check network setting matches account (testnet vs mainnet)

## Next Steps

1. ✅ Set up Hedera testnet account
2. ✅ Install dependencies (`npm install`)
3. ✅ Configure `.env` file
4. ✅ Create NFT token for tickets
5. ✅ Test ticket minting and transfer
6. ✅ Integrate with frontend
7. ✅ Deploy to production

## License

MIT
