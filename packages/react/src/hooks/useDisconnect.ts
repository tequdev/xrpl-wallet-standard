import type { XRPLWallet } from '@xrpl-wallet-standard/app'
import { useWalletStore } from './useWalletStore'

export const useDisconnect = () => {
  const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected)

  const handleConnect = async (wallet: XRPLWallet) => {
    try {
      await wallet.features['standard:disconnect']?.disconnect()
    } catch (e) {}
    setWalletDisconnected()
  }
  return handleConnect
}
