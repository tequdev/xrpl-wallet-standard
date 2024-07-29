import { useWallet as useStandardWallet, useWallets as useStandardWallets } from '@wallet-standard/react'
import { type XRPLWallet, isWalletWithRequiredFeatureSet } from '@xrpl-wallet-standard/core'

export { useConnect, useDisconnect, useWalletAccount } from '@wallet-standard/react'

export function useWallets() {
  const { wallets } = useStandardWallets()
  return wallets.filter((wallet): wallet is XRPLWallet => isWalletWithRequiredFeatureSet(wallet))
}

export function useWallet() {
  const { accounts, chains, features, icon, name, version, wallet, setWallet } = useStandardWallet()

  if (wallet && !isWalletWithRequiredFeatureSet(wallet)) {
    throw new Error('Wallet does not have required features')
  }

  return {
    accounts,
    chains: chains as XRPLWallet['chains'],
    features: features as XRPLWallet['features'],
    icon,
    name,
    version,
    wallet: wallet as XRPLWallet | null,
    setWallet: setWallet as (wallet: XRPLWallet | null) => void,
  }
}
