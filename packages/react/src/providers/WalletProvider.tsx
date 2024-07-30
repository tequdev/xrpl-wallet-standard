import { getRegisterdXRPLWallets } from '@xrpl-wallet-standard/app'
import React from 'react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { WalletContext } from '../contexts/walletContext.js'
import { createWalletStore } from '../store'

export type WalletProviderProps = {
  preferredWallets?: string[]
  autoConnect?: boolean
  children: ReactNode
}

export function WalletProvider({ autoConnect = true, children }: WalletProviderProps) {
  const storeRef = useRef(
    createWalletStore({
      autoConnectEnabled: autoConnect,
      wallets: getRegisterdXRPLWallets(),
      storage: localStorage,
      storageKey: '@xrpl-wallet-standard/app/react',
    }),
  )

  return (
    <WalletContext.Provider value={storeRef.current}>
      <WalletAutoConnect>{children}</WalletAutoConnect>
    </WalletContext.Provider>
  )
}

type WalletAutoConnectProps = Pick<WalletProviderProps, 'children'>

function WalletAutoConnect({ children }: WalletAutoConnectProps) {
  return children
}
