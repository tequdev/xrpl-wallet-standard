import type { XRPLWallet } from '@xrpl-wallet-standard/app'
import type { WalletConnectionStatus } from '../store'
import { useWalletStore } from './useWalletStore'

type UseWalletResult = {
  wallet: XRPLWallet
  status: WalletConnectionStatus
}

export const useWallet = (): UseWalletResult => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const status = useWalletStore((state) => state.connectionStatus)

  if (status === 'connecting') {
    return {
      wallet: null,
      status,
    }
  }
  if (status === 'connected') {
    if (!wallet) throw new Error('Wallet is connected but no wallet is set')
    return {
      wallet,
      status,
    }
  }
  if (status === 'disconnected') {
    return {
      wallet: null,
      status,
    }
  }
  throw new Error(`Unexpected connection status: ${status}`)
}
