import React from 'react';
import { ThirdwebProvider } from '@thirdweb-dev/react-native';
import { Ethereum, Polygon, BinanceSmartChainMainnet } from '@thirdweb-dev/chains';

const activeChain = Ethereum;

// Your ThirdWeb Client ID (get from https://thirdweb.com/dashboard)
const CLIENT_ID = process.env.EXPO_PUBLIC_THIRDWEB_CLIENT_ID || 'your_client_id_here';

type Props = {
  children: React.ReactNode;
};

export const Web3Provider = ({ children }: Props) => {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      supportedChains={[Ethereum, Polygon, BinanceSmartChainMainnet]}
      clientId={CLIENT_ID}
      dAppMeta={{
        name: 'Web3 Event',
        description: 'Decentralized Event Management Platform',
        logoUrl: 'https://your-logo-url.com/logo.png',
        url: 'https://your-website.com',
        isDarkMode: true,
      }}
    >
      {children}
    </ThirdwebProvider>
  );
};
