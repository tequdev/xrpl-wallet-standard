'use client'
import { CrossmarkWallet } from '@xrpl-wallet-adapter/crossmark'
import { LedgerWallet } from '@xrpl-wallet-adapter/ledger'
import { WalletConnectWallet } from '@xrpl-wallet-adapter/walletconnect'
import { XamanWallet } from '@xrpl-wallet-adapter/xaman'
import { WalletProvider as StandardWalletProvider } from '@xrpl-wallet-standard/react'

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
    desktopWallets: [],
    mobileWallets: [],
  }),
  new LedgerWallet(),
]

export default function WalletProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <StandardWalletProvider registerWallets={additionalWallets}>{children}</StandardWalletProvider>
}
