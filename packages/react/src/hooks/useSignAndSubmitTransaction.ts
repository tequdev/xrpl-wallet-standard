import type { PrepearedTransaction, XRPLProtorcolNetwork } from '@xrpl-wallet-standard/app'
import { useWalletStore } from './useWalletStore'

export const useSignAndSubmitTransaction = () => {
  const wallet = useWalletStore((state) => state.currentWallet)
  const account = useWalletStore((state) => state.currentAccount)

  const handleSignAndSubmitTransaction = async (transaction: PrepearedTransaction, network: XRPLProtorcolNetwork) => {
    if (!wallet) throw new Error('Wallet is not connected')
    if (!account) throw new Error('Account is not connected')

    const signAndSubmitTransaction = wallet.features['xrpl:signAndSubmitTransaction'].signAndSubmitTransaction
    return await signAndSubmitTransaction({ tx_json: transaction, account, network })
  }

  return handleSignAndSubmitTransaction
}
