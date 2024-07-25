import { type XRPLBaseWallet, XRPLWalletAccount, hexToBytes } from '@xrpl-wallet-adapter/base'
import {
  type StandardConnectFeature,
  type StandardConnectMethod,
  type StandardEventsFeature,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
  type XRPLSignAndSubmitTransactionFeature,
  type XRPLSignAndSubmitTransactionMethod,
  type XRPLSignTransactionFeature,
  type XRPLSignTransactionMethod,
  XRPL_MAINNET,
} from '@xrpl-wallet-standard/core'

interface CrossmarkWindow extends Window {
  xrpl: {
    crossmark: {
      async: {
        signInAndWait: (hex?: string) => Promise<{
          request: any
          response: {
            app: string
            id: string
            type: string
            data: {
              address: string
              publicKey: string
              user: {
                id: string
                username: string
                type: string
                developer: boolean
              }
              network: {
                label: string
                protocol: string
                wss: string
                rpc: string
                type: string
              }
              meta: Record<
                | 'isError'
                | 'isExpired'
                | 'isFail'
                | 'isPending'
                | 'isRejected'
                | 'isSigned'
                | 'isSuccess'
                | 'isVerified',
                boolean
              >
            }
          }
        }>
        signAndWait: (
          tx: Record<string, any>,
          opt?: { description?: string },
        ) => Promise<{
          request: any
          response: {
            data: {
              txBlob: string
              meta: Record<
                | 'isError'
                | 'isExpired'
                | 'isFail'
                | 'isPending'
                | 'isRejected'
                | 'isSigned'
                | 'isSuccess'
                | 'isVerified',
                boolean
              >
            }
          }
        }>
        signAndSubmitAndWait: (
          tx: Record<string, any>,
          opt?: { description?: string },
        ) => Promise<{
          request: any
          response: {
            data: {
              resp: {
                result: {
                  hash: string
                } & any
              }
              meta: Record<
                | 'isError'
                | 'isExpired'
                | 'isFail'
                | 'isPending'
                | 'isRejected'
                | 'isSigned'
                | 'isSuccess'
                | 'isVerified',
                boolean
              >
            }
          }
        }>
      }
    }
  }
}

declare const window: CrossmarkWindow

export class CrossmarkWallet implements XRPLBaseWallet {
  #name = 'Crossmark Wallet'
  // TODO: Add image.
  #icon = 'data:image/svg+xml;base64,' as const

  #accounts: XRPLWalletAccount[] = []

  readonly #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {}

  get version() {
    return '1.0.0' as const
  }

  get name() {
    return this.#name
  }

  get icon() {
    return this.#icon
  }

  get chains() {
    return [XRPL_MAINNET]
  }

  get features(): StandardConnectFeature &
    StandardEventsFeature &
    XRPLSignTransactionFeature &
    XRPLSignAndSubmitTransactionFeature {
    return {
      'standard:connect': {
        version: '1.0.0',
        connect: this.#connect,
      },
      'standard:events': {
        version: '1.0.0',
        on: this.#on,
      },
      'xrpl:signTransaction': {
        version: '1.0.0',
        signTransaction: this.#signTransaction,
      },
      'xrpl:signAndSubmitTransaction': {
        version: '1.0.0',
        signAndSubmitTransaction: this.#signAndSubmitTransaction,
      },
    }
  }

  get accounts() {
    return this.#accounts
  }

  constructor() {
    if (new.target === CrossmarkWallet) {
      Object.freeze(this)
    }
  }

  #connect: StandardConnectMethod = async ({ silent } = {}) => {
    const { response } = await window.xrpl.crossmark.async.signInAndWait()
    this.#accounts = [new XRPLWalletAccount(hexToBytes(response.data.publicKey))]
    this.#emit('change', { accounts: this.accounts })
    return {
      accounts: this.accounts,
    }
  }

  #signTransaction: XRPLSignTransactionMethod = async (transaction, account, network) => {
    const { response } = await window.xrpl.crossmark.async.signAndWait(transaction)
    return {
      signed_tx: Uint8Array.from(hexToBytes(response.data.txBlob)),
      // TODO
      signature: Uint8Array.from([]),
    }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async (transaction, account, network) => {
    const { response } = await window.xrpl.crossmark.async.signAndSubmitAndWait(transaction)
    return {
      // TODO
      tx_blob: Uint8Array.from([]),
      tx_hash: Uint8Array.from(hexToBytes(response.data.resp.result.hash)),
    }
  }

  #on: StandardEventsOnMethod = (event, listener) => {
    this.#listeners[event]?.push(listener) || (this.#listeners[event] = [listener])
    return (): void => this.#off(event, listener)
  }

  #emit<E extends StandardEventsNames>(event: E, ...args: Parameters<StandardEventsListeners[E]>): void {
    this.#listeners[event]?.forEach((listener) => listener.apply(null, args))
  }

  #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
    this.#listeners[event] = this.#listeners[event]?.filter((existingListener) => listener !== existingListener)
  }
}
