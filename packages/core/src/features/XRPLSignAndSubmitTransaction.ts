import type { WalletAccount } from '@wallet-standard/core'
import type { XRPLIdentifierString } from '../networks'
import type { SubmittableTransaction, BaseTransaction, TxResponse, TxV1Response } from 'xrpl'

type PrepearedTransaction = SubmittableTransaction | BaseTransaction
type SignedTransaction = PrepearedTransaction & Required<Pick<BaseTransaction, 'Fee' | 'Sequence' | 'TxnSignature' | 'SigningPubKey'>>

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
  tx_json: PrepearedTransaction
  account: WalletAccount
  network: XRPLIdentifierString
  option?: SignAndSubmitTransactionOption
}

export interface SignAndSubmitTransactionOutput {
  tx_hash: string
  tx_json: TxV1Response['result']
}

export interface SignAndSubmitTransactionOption {
  autofill?: boolean
  multisig?: boolean
}
