import {
  type RequiredFetures,
  type Wallet,
  type WalletWithFeatures,
  getWallets,
  isWalletWithRequiredFeatureSet,
} from '@xrpl-wallet-standard/core'

export function getRegisterdWallets<AdditionalFeatures extends Wallet['features']>() {
  const wallets = getWallets().get()
  const xrplWallets = wallets.filter((wallet): wallet is WalletWithFeatures<RequiredFetures & AdditionalFeatures> =>
    isWalletWithRequiredFeatureSet(wallet),
  )
  return xrplWallets
}
