# Hedera Smart Contracts for Web3Event

This directory contains Solidity smart contracts designed for deployment on Hedera Hashgraph network.

## Contracts

### 1. EventFactory.sol
Factory contract for creating and managing events on Hedera.

**Features:**
- Create events with metadata
- Track ticket sales
- Manage event status
- Get event information

### 2. TicketNFT.sol
ERC-721 compatible NFT contract for event tickets on Hedera.

**Features:**
- Mint unique ticket NFTs
- Store ticket metadata
- Track ticket usage
- Transfer tickets between accounts

## Hedera vs Ethereum Differences

Hedera uses the Hedera Smart Contract Service (HSCS) which supports Solidity contracts but with some key differences:

1. **Gas Model**: Hedera uses a predictable fee structure
2. **Speed**: 3-5 second finality vs 12+ seconds on Ethereum
3. **Cost**: Significantly lower transaction costs
4. **Account Model**: Uses `0.0.xxxxx` format instead of `0x...` addresses
5. **Native Tokens**: Can create native Hedera Token Service (HTS) tokens

## Deployment Guide

### Prerequisites
- Hedera testnet account with HBAR
- Hedera SDK installed
- Node.js and npm

### Deploy Using Hedera SDK

```bash
# Install dependencies
npm install @hashgraph/sdk

# Set environment variables
export HEDERA_ACCOUNT_ID="0.0.xxxxx"
export HEDERA_PRIVATE_KEY="302e020100300506032b657004220420..."
export HEDERA_NETWORK="testnet"
```

### Deployment Script

See `scripts/deploy-hedera.ts` for the deployment script.

```bash
npm run deploy
```

### Using Hedera Token Service (HTS) Instead

For better performance and lower costs, consider using Hedera Token Service (HTS) for NFT tickets:

**Advantages:**
- Native to Hedera (no smart contract needed)
- Lower fees
- Built-in token management
- Automatic royalty support
- Easier integration

**Implementation:**
Use the HTS methods in `src/utils/web3.ts`:
- `createTicketNFT()` - Create NFT token
- `mintTicket()` - Mint ticket NFTs
- `transferTicket()` - Transfer tickets

## Testing

### Hedera Testnet
- Faucet: https://portal.hedera.com
- Explorer: https://hashscan.io/testnet
- Free test HBAR available

### Test Accounts
Create test accounts at: https://portal.hedera.com

## Contract Addresses

After deployment, update these in `.env`:

```
TICKET_NFT_CONTRACT_ID=0.0.xxxxx
EVENT_FACTORY_CONTRACT_ID=0.0.xxxxx
```

## Resources

- [Hedera Documentation](https://docs.hedera.com)
- [Hedera SDK](https://github.com/hashgraph/hedera-sdk-js)
- [Smart Contract Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/smart-contracts)
- [Token Service](https://docs.hedera.com/hedera/sdks-and-apis/sdks/token-service)
- [Hedera Portal](https://portal.hedera.com)

## License

MIT
