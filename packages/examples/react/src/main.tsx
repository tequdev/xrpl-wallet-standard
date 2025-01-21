import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CrossmarkWallet } from '@xrpl-wallet-adapter/crossmark'
import { LocalWallet_TESTONLY } from '@xrpl-wallet-adapter/local-testonly'
import { MetaMaskWallet } from '@xrpl-wallet-adapter/metamask'
import { WalletConnectWallet } from '@xrpl-wallet-adapter/walletconnect'
import { XamanWallet } from '@xrpl-wallet-adapter/xaman'
import { WalletProvider } from '@xrpl-wallet-standard/react'

const additionalWallets = [
  new XamanWallet('8f1280ed-374c-4b49-86ee-6dfbcdd4563f'),
  new CrossmarkWallet(),
  new WalletConnectWallet({
    projectId: '85ad846d8aa771cd56c2bbbf30f7a183',
    metadata: {
      name: 'React App',
      description: 'React App for WalletConnect',
      url: 'https://walletconnect.com/',
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    },
    networks: ['xrpl:mainnet'],
    desktopWallets: [
      {
        id: '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
        name: 'Ledger Live',
        links: {
          native: 'ledgerlive://',
          universal: 'https://www.ledger.com/ledger-live',
        },
      },
    ],
    mobileWallets: [
      {
        id: '37a686ab6223cd42e2886ed6e5477fce100a4fb565dcd57ed4f81f7c12e93053',
        name: 'Bifrost Wallet',
        links: {
          native: 'bifrostwallet://',
          universal: 'https://bifrostwallet.com',
        },
      },
    ],
  }),
  new LocalWallet_TESTONLY(),
  new MetaMaskWallet(),
]

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WalletProvider registerWallets={additionalWallets}>
      <App />
    </WalletProvider>
  </React.StrictMode>,
)
