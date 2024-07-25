import type { WalletAccount } from '@wallet-standard/core'
import type { XRPLIdentifierString } from '../networks'

export type XRPLSignAndSubmitTransactionVersion = '1.0.0'

export type XRPLSignAndSubmitTransactionFeature = {
  'xrpl:signAndSubmitTransaction': {
    version: XRPLSignAndSubmitTransactionVersion
    signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod
  }
}

export type XRPLSignAndSubmitTransactionMethod = (
  input: XRPLSignAndSubmitTransactionInput
) => Promise<SignAndSubmitTransactionOutput>

export interface XRPLSignAndSubmitTransactionInput {
  transaction: Uint8Array
  account: WalletAccount
  chain: XRPLIdentifierString
  option?: SignAndSubmitTransactionOption
}

export interface SignAndSubmitTransactionOutput {
  tx_hash: Uint8Array
  tx_blob: Uint8Array
}

export interface SignAndSubmitTransactionOption {
  autofill?: boolean
  multisig?: boolean
}
