import { type XRPLBaseWallet, XRPLWalletAccount } from '@xrpl-wallet-adapter/base'
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
      session: {
        address?: string
      }
    }
  }
}

declare const window: CrossmarkWindow

export class CrossmarkWallet implements XRPLBaseWallet {
  #name = 'Crossmark'
  #icon =
    'data:image/png;base64,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' as const

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

  #connect: StandardConnectMethod = async ({ silent = false } = {}) => {
    let address: string | undefined
    if (silent) {
      address = window.xrpl.crossmark.session.address
    } else {
      const { response } = await window.xrpl.crossmark.async.signInAndWait()
      address = response.data.address
    }
    if (!address) return { accounts: [] }

    this.#accounts = [new XRPLWalletAccount(address)]
    this.#emit('change', { accounts: this.accounts })
    return {
      accounts: this.accounts,
    }
  }

  #signTransaction: XRPLSignTransactionMethod = async ({ tx_json, account, network }) => {
    // Crossmark does not support changing the network when signing a transaction
    const { response } = await window.xrpl.crossmark.async.signAndWait(tx_json)
    return {
      signed_tx_blob: response.data.txBlob as any,
    }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async ({ tx_json, account, network }) => {
    // Crossmark does not support changing the network when signing a transaction
    const { response } = await window.xrpl.crossmark.async.signAndSubmitAndWait(tx_json)
    return {
      tx_json: response.data.resp.result,
      tx_hash: response.data.resp.result.hash,
    }
  }

  #on: StandardEventsOnMethod = (event, listener) => {
    if (this.#listeners[event]) this.#listeners[event]?.push(listener)
    else this.#listeners[event] = [listener]
    return (): void => this.#off(event, listener)
  }

  #emit<E extends StandardEventsNames>(event: E, ...args: Parameters<StandardEventsListeners[E]>): void {
    this.#listeners[event]?.forEach((listener) => listener.apply(null, args))
  }

  #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
    this.#listeners[event] = this.#listeners[event]?.filter((existingListener) => listener !== existingListener)
  }
}
