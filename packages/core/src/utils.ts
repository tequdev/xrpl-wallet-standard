import type { StandardConnectFeature, StandardEventsFeature, Wallet, WalletWithFeatures } from '@wallet-standard/core'

const REQUIRED_FEATURES = ['standard:connect', 'standard:events']

export type RequiredFetures = StandardConnectFeature & StandardEventsFeature

export function isWalletWithRequiredFeatureSet<AdditionalFeatures extends Wallet['features']>(
  wallet: Wallet,
  additionalFeatures: (keyof AdditionalFeatures)[] = [],
): wallet is WalletWithFeatures<RequiredFetures & AdditionalFeatures> {
  return [...REQUIRED_FEATURES, ...additionalFeatures].every((feature) => feature in wallet.features)
}
