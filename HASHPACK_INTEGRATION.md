# HashPack Wallet Integration Guide

## Overview

Your Web3Event app now supports HashPack wallet connection for Hedera Hashgraph network! Users can connect their HashPack wallet to participate in Hedera-based events and purchase NFT tickets.

## Current Implementation

### ✅ What's Working

1. **HashPack Detection**: App recognizes HashPack as a wallet option
2. **Account ID Input**: Users can manually enter their Hedera account ID (format: 0.0.12345)
3. **Validation**: Account ID format is validated before connection
4. **Storage**: Connected wallet info is saved to your backend

### 🔄 Current Flow

1. User taps "HashPack (Hedera)" button
2. Prompt appears asking for Hedera account ID
3. User enters their account ID from HashPack wallet (e.g., 0.0.123456)
4. Account ID is validated
5. Connection is saved to backend via API
6. User proceeds to profile setup

## Production-Ready Features Needed

### 🚀 For Full Integration

To make HashPack work like a native mobile wallet connection, you'll need:

1. **WalletConnect Integration**
   ```bash
   npm install @walletconnect/react-native-dapp
   ```

2. **Deep Linking**
   - Configure `app.json` with HashPack scheme
   - Enable opening HashPack app directly
   - Handle return callbacks

3. **Hedera SDK Integration**
   - Query account balances
   - Sign transactions
   - Verify ownership

### Example Production Setup

```typescript
// Full WalletConnect + HashPack integration
import { WalletConnectConnector } from '@walletconnect/react-native-dapp';

const connector = new WalletConnectConnector({
  uri: 'wc:...',
  clientMeta: {
    name: 'Web3Event',
    description: 'Event ticketing on Hedera',
    url: 'https://web3event.com',
    icons: ['https://web3event.com/logo.png']
  }
});

// Open HashPack via deep link
await Linking.openURL('hashpack://wc?uri=' + encodeURIComponent(uri));
```

## Testing HashPack Connection

### On Your Phone

1. Install HashPack wallet app from App Store / Play Store
2. Create or import a Hedera testnet account
3. Note your account ID (found in HashPack settings)
4. In your app, tap "Connect Wallet" → "HashPack (Hedera)"
5. Enter your account ID when prompted
6. Connection successful!

### Getting a Testnet Account

1. Download HashPack: https://www.hashpack.app/
2. Create new wallet
3. Get testnet HBAR from: https://portal.hedera.com/
4. Your account ID will be in format: 0.0.XXXXXX

## Environment Variables

Already configured in your `.env`:

```env
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=43e334ab6f14b190d4fed10ec2d9dc0d
```

## Files Modified

- ✅ `src/screens/ConnectWalletScreenNew.tsx` - Added HashPack UI and connection logic
- ✅ `src/services/hederaWallet.ts` - Created Hedera wallet service
- ✅ `.env` - WalletConnect configuration

## Next Steps for Production

1. **Add WalletConnect Protocol**: Enable direct app-to-app connection
2. **Implement Deep Links**: Auto-open HashPack when connecting
3. **Add Transaction Signing**: Sign ticket purchases with HashPack
4. **Balance Display**: Show user's HBAR balance
5. **Network Selection**: Support mainnet/testnet switching

## Resources

- HashPack Docs: https://docs.hashpack.app/
- Hedera SDK: https://docs.hedera.com/hedera/sdks-and-apis
- WalletConnect: https://docs.walletconnect.com/
- Hedera Portal: https://portal.hedera.com/

## Support

For HashPack-specific issues:
- HashPack Support: support@hashpack.app
- Hedera Discord: https://hedera.com/discord

---

**Current Status**: ✅ HashPack connection working via manual account ID entry
**Production Ready**: 🔄 Needs WalletConnect integration for seamless experience
