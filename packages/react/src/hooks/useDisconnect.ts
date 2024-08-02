import { useWalletStore } from './useWalletStore'

export const useDisconnect = () => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected)

  const handleDisconnect = async () => {
    if (!wallet) throw new Error('Wallet is not connected')

    const disconnectFeature = wallet.features['standard:disconnect']
    if (disconnectFeature) await disconnectFeature.disconnect()

    setWalletDisconnected()
  }
  return handleDisconnect
}
