import { type XRPLWallet, getRegisterdXRPLWallets, registerWallet } from '@xrpl-wallet-standard/app'
import React from 'react'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { WalletContext } from '../contexts/walletContext.js'
import { useAutoConnect } from '../hooks/useAutoConnect.js'
import { createWalletStore } from '../store'

export type WalletProviderProps = {
  preferredWallets?: string[]
  autoConnect?: boolean
  registerWallets?: XRPLWallet[]
  children: ReactNode
}

export function WalletProvider({ autoConnect = true, registerWallets, children }: WalletProviderProps) {
  if (typeof window !== 'undefined' && registerWallets)
    registerWallets
      .filter((wallet) => !getRegisterdXRPLWallets().find((rw) => rw.name === wallet.name))
      .forEach((wallet) => {
        registerWallet(wallet)
      })

  const storeRef = useRef(
    createWalletStore({
      autoConnectEnabled: autoConnect,
      wallets: getRegisterdXRPLWallets(),
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
  useAutoConnect()
  return children
}
