import type { StandardConnectInput, XRPLWallet } from '@xrpl-wallet-standard/app'
import { useWalletStore } from './useWalletStore'

export const useConnect = () => {
  const connectionStatus = useWalletStore((state) => state.connectionStatus)
  const setConnectionStatus = useWalletStore((state) => state.setConnectionStatus)
  const setWallet = useWalletStore((state) => state.setWallet)

  const handleConnect = async (wallet: XRPLWallet, input?: StandardConnectInput) => {
    setConnectionStatus('connecting')
    try {
      const { accounts } = await wallet.features['standard:connect'].connect(input)
      const account = accounts.length > 0 ? accounts[0] : null

      setWallet(wallet, accounts, account)
      setConnectionStatus('connected')
    } catch (e) {
      console.error(e)
      setConnectionStatus('disconnected')
    }
  }

  return { connect: handleConnect, status: connectionStatus }
}
