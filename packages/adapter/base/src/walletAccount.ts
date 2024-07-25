import { type WalletAccount, XRPL_MAINNET } from '@xrpl-wallet-standard/core'
import { bytesToHex } from '@xrplf/isomorphic/utils'
import { deriveAddress } from 'ripple-keypairs'

export class XRPLWalletAccount implements WalletAccount {
  readonly #publicKey: Uint8Array

  get address() {
    return deriveAddress(bytesToHex(this.publicKey))
  }

  get publicKey() {
    return this.#publicKey.slice()
  }

  get chains() {
    return [XRPL_MAINNET] as const
  }

  get features() {
    return ['xrpl:signTransaction', 'xrpl:signAndSubmitTransaction'] as const
  }

  constructor(publicKey: Uint8Array) {
    if (new.target === XRPLWalletAccount) {
      Object.freeze(this)
    }

    this.#publicKey = publicKey
  }
}
