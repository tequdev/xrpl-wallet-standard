import type { XRPLWallet } from '@xrpl-wallet-standard/app'
import { useWalletStore } from './useWalletStore'

export const useConnect = () => {
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus)
  const setWallet = useWalletStore((state) => state.setWallet)

  const handleConnect = async (wallet: XRPLWallet) => {
    setConnectionStatus('connecting')
    try {
      const { accounts } = await wallet.features['standard:connect'].connect()
      const account = accounts.length > 0 ? accounts[0] : null

      setWallet(wallet, accounts, account)
      setConnectionStatus('connected')
    } catch (e) {
      setConnectionStatus('disconnected')
    }
  }

  return handleConnect
}
