import { type StandardDisconnectFeature, isWalletWithRequiredFeatureSet } from '@xrpl-wallet-standard/app'
import { useWalletStore } from './useWalletStore'

export const useDisconnect = () => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const setWalletDisconnected = useWalletStore((state) => state.setWalletDisconnected)

  const handleDisconnect = async () => {
    if (!wallet) throw new Error('Wallet is not connected')

    if (isWalletWithRequiredFeatureSet<StandardDisconnectFeature>(wallet, ['standard:disconnect']))
      await wallet.features['standard:disconnect'].disconnect()

    setWalletDisconnected()
  }
  return handleDisconnect
}
