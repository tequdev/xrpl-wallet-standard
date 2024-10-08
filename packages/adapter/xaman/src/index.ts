import { type XRPLBaseWallet, XRPLWalletAccount } from '@xrpl-wallet-adapter/base'
import {
  type StandardConnectFeature,
  type StandardConnectMethod,
  type StandardDisconnectFeature,
  type StandardDisconnectMethod,
  type StandardEventsFeature,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
  XAHAU_MAINNET,
  XAHAU_TESTNET,
  type XRPLIdentifierString,
  type XRPLSignAndSubmitTransactionFeature,
  type XRPLSignAndSubmitTransactionMethod,
  type XRPLSignTransactionFeature,
  type XRPLSignTransactionMethod,
  XRPL_DEVNET,
  XRPL_MAINNET,
  XRPL_TESTNET,
} from '@xrpl-wallet-standard/core'
import { Client, type TxV1Response } from 'xrpl'
import { type ResolvedFlow, XummPkce } from 'xumm-oauth2-pkce'

export class XamanWallet implements XRPLBaseWallet {
  #name = 'Xaman'
  #icon =
    'data:image/png;base64,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' as const

  #accounts: XRPLWalletAccount[] = []

  #client: XummPkce
  #sdk: ResolvedFlow['sdk']

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
    return [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET, XAHAU_MAINNET, XAHAU_TESTNET]
  }

  get features(): StandardConnectFeature &
    StandardEventsFeature &
    StandardDisconnectFeature &
    XRPLSignTransactionFeature &
    XRPLSignAndSubmitTransactionFeature {
    return {
      'standard:connect': {
        version: '1.0.0',
        connect: this.#connect,
      },
      'standard:disconnect': {
        version: '1.0.0',
        disconnect: this.#disconnect,
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

  constructor(apiKey: string) {
    if (new.target === XamanWallet) {
      Object.freeze(this)
    }
    this.#client = new XummPkce(apiKey)
  }

  #connect: StandardConnectMethod = async ({ silent = false } = {}) => {
    if (!silent) {
      await this.#client.authorize()
    }
    const state = this.#client.state()
    if (!state) return { accounts: [] }

    const resolvedState = await state
    if (!resolvedState) return { accounts: [] }

    this.#accounts = [new XRPLWalletAccount(resolvedState.me.account)]
    this.#sdk = resolvedState.sdk
    this.#emit('change', { accounts: this.accounts })

    return {
      accounts: this.accounts,
    }
  }

  #disconnect: StandardDisconnectMethod = async () => {
    this.#client.logout()
  }

  #signTransaction: XRPLSignTransactionMethod = async ({ tx_json, account, network }) => {
    const createdPayload = await this.#sdk.payload.create({
      txjson: tx_json as any,
      options: { submit: false, force_network: this.#getXamanNetworkNameFromChain(network) },
    })
    if (!createdPayload) throw new Error('Invalid Payload Parameter')
    const uuid = createdPayload.uuid
    const subscription = await this.#sdk.payload.subscribe(uuid)
    subscription.websocket.onmessage = (message) => {
      // resolve promise when receive signed message
      if (message.data.toString().match(/signed/)) {
        const json = JSON.parse(message.data.toString())
        subscription.resolve(json.signed)
      }
    }
    await subscription.resolved

    const result = await this.#sdk.payload.get(uuid)
    if (!result || !result.response.hex) throw new Error('Invalid Payload Parameter')

    return {
      signed_tx_blob: result.response.hex,
    }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async ({ tx_json, account, network }) => {
    const createdPayload = await this.#sdk.payload.create({
      txjson: tx_json as any,
      options: { submit: true, force_network: this.#getXamanNetworkNameFromChain(network) },
    })
    if (!createdPayload) throw new Error('Invalid Payload Parameter')
    const uuid = createdPayload.uuid
    const subscription = await this.#sdk.payload.subscribe(uuid)
    subscription.websocket.onmessage = (message) => {
      // resolve promise when receive signed message
      if (message.data.toString().match(/"signed"/)) {
        const json = JSON.parse(message.data.toString())
        subscription.resolve(json.payload_uuidv4)
      }
    }
    const payloadId = (await subscription.resolved) as string
    const payload = await this.#sdk.payload.get(payloadId)
    if (!payload || !payload.response.txid || !payload.response.dispatched_to) throw new Error('Invalid Payload')

    const client = new Client(payload.response.dispatched_to)
    await client.connect()
    const transactionResponse = await client.request({
      command: 'tx',
      transaction: payload.response.txid,
      api_version: 1,
    })
    await client.disconnect()

    return {
      tx_json: (transactionResponse as unknown as TxV1Response).result,
      tx_hash: payload.response.txid,
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

  #getXamanNetworkNameFromChain(chain: XRPLIdentifierString) {
    switch (chain) {
      case XRPL_MAINNET:
      case 'xrpl:mainnet':
        return 'MAINNET'
      case XRPL_TESTNET:
      case 'xrpl:testnet':
        return 'TESTNET'
      case XRPL_DEVNET:
      case 'xrpl:devnet':
        return 'DEVNET'
      case XAHAU_MAINNET:
      case 'xrpl:xahau-mainnet':
        return 'XAHAUMAINNET'
      case XAHAU_TESTNET:
      case 'xrpl:xahau-testnet':
        return 'XAHAUTESTNET'
      default:
        throw new Error('Invalid Chain')
    }
  }
}
