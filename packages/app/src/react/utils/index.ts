import type {
  Wallet,
  XRPLSignAndSubmitTransactionFeature,
  XRPLSignTransactionFeature,
} from '@xrpl-wallet-standard/core'

export { hasConnectFeature, hasDisconnectFeature, hasEventsFeature } from '@wallet-standard/react'

export function hasSignTransactionFeature(features: Wallet['features']): features is XRPLSignTransactionFeature {
  return 'xrpl:signTransaction' in features
}

export function hasSignAndSubmitTransactionFeature(
  features: Wallet['features'],
): features is XRPLSignAndSubmitTransactionFeature {
  return 'xrpl:signAndSubmitTransaction' in features
}
