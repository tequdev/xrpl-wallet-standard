import type { WalletAccount } from '@wallet-standard/core'
import type { XRPLIdentifierString } from '../networks'

export type XRPLSignTransactionVersion = '1.0.0'

export type XRPLSignTransactionFeature = {
  'xrpl:signTransaction': {
    version: XRPLSignTransactionVersion
    signTransaction: XRPLSignTransactionMethod
  }
}

export type XRPLSignTransactionMethod = (...input: XRPLSignTransactionInput[]) => Promise<SignTransactionOutput>

export interface XRPLSignTransactionInput {
  transaction: Uint8Array
  account: WalletAccount
  network: XRPLIdentifierString
  options?: SignTransactionOption
}

export interface SignTransactionOutput {
  signed_tx: Uint8Array
  signature: Uint8Array
}

export interface SignTransactionOption {
  autofill?: boolean
  multisig?: boolean
}
