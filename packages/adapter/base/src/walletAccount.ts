import { type WalletAccount, XRPL_MAINNET } from '@xrpl-wallet-standard/core'
import { bytesToHex } from '@xrplf/isomorphic/utils'
import { deriveAddress } from 'ripple-keypairs'

export class XRPLWalletAccount implements WalletAccount {
  readonly #publicKey: Uint8Array
  readonly #address: string

  get address() {
    return this.#address
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

  constructor(address: string) {
    if (new.target === XRPLWalletAccount) {
      Object.freeze(this)
    }
    this.#address = address

  }
}
