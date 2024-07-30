import { useContext } from 'react'
import { useStore } from 'zustand'

import { WalletContext } from '../contexts/walletContext'
import type { Action, State } from '../store'

export function useWalletStore<T>(selector: (state: Action & State) => T): T {
  const store = useContext(WalletContext)
  if (!store)
    throw new Error(
      'useWalletStore must be used within a WalletProvider. Did you forget to wrap your component in a WalletProvider?',
    )
  return useStore(store, selector)
}
