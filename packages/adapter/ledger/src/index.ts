import Xrp from '@ledgerhq/hw-app-xrp'
import type Transport from '@ledgerhq/hw-transport'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
import TransportWebUSB from '@ledgerhq/hw-transport-webusb'
import { type XRPLBaseWallet, XRPLWalletAccount } from '@xrpl-wallet-adapter/base'
import {
  type StandardConnectFeature,
  type StandardConnectMethod,
  type StandardEventsFeature,
  type StandardEventsListeners,
  type StandardEventsNames,
  type StandardEventsOnMethod,
  type XRPLIdentifierString,
  type XRPLSignAndSubmitTransactionFeature,
  type XRPLSignAndSubmitTransactionMethod,
  type XRPLSignTransactionFeature,
  type XRPLSignTransactionMethod,
  XRPL_DEVNET,
  XRPL_MAINNET,
  XRPL_TESTNET,
  getNetworkWssEndpoint,
} from '@xrpl-wallet-standard/core'
import { convertNetworkToChainId } from '@xrpl-wallet-standard/core/src/networks'
import { Client, encode } from 'xrpl'

const bip32Path = (index = 0) => `44'/144'/${index}'/0/0`

export class LedgerWallet implements XRPLBaseWallet {
  #name = 'Ledger'
  #icon =
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA3NjguOTEgNjY5LjM1IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA3NjguOTEgNjY5LjM1OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGQ9Ik0wLDQ3OS4yOXYxOTAuMDZoMjg5LjIyVjYyNy4ySDQyLjE0VjQ3OS4yOUgweiBNNzI2Ljc3LDQ3OS4yOVY2MjcuMkg0NzkuNjl2NDIuMTRoMjg5LjIyVjQ3OS4yOUg3MjYuNzd6IE0yODkuNjQsMTkwLjA2Cgl2Mjg5LjIyaDE5MC4wNXYtMzguMDFIMzMxLjc4VjE5MC4wNkgyODkuNjR6IE0wLDB2MTkwLjA2aDQyLjE0VjQyLjE0aDI0Ny4wOFYwSDB6IE00NzkuNjksMHY0Mi4xNGgyNDcuMDh2MTQ3LjkyaDQyLjE0VjBINDc5LjY5eiIKCS8+Cjwvc3ZnPgo=' as const

  #accounts: XRPLWalletAccount[] = []
  #transport: Transport | null = null
  #app: Xrp | null = null
  #clients: { [network: string]: Client } = {}

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

  get chains(): `xrpl:${number}`[] {
    return [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET]
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

  #createTransport = async (): Promise<Transport> => {
    try {
      return await TransportWebUSB.create()
    } catch (e) {
      return await TransportWebHID.create()
    }
  }

  #getClient = async (network: XRPLIdentifierString): Promise<Client> => {
    if (!this.#clients[network]) {
      const client = new Client(this.#getNetworkUrl(network))
      await client.connect()
      this.#clients[network] = client
    }
    return this.#clients[network]
  }

  #getNetworkUrl = (network: XRPLIdentifierString): string => {
    const chainId = convertNetworkToChainId(network)
    if (!this.chains.includes(chainId)) {
      throw new Error(`Unsupported network: ${network}`)
    }
    return getNetworkWssEndpoint(chainId)!
  }

  #connect: StandardConnectMethod = async ({ silent = false } = {}) => {
    try {
      if (!this.#transport) {
        this.#transport = await this.#createTransport()
      }

      this.#app = new Xrp(this.#transport)

      // Get the first account from Ledger
      const { address } = await this.#app.getAddress(bip32Path())

      this.#accounts = [new XRPLWalletAccount(address)]
      this.#emit('change', { accounts: this.accounts })

      return {
        accounts: this.#accounts,
      }
    } catch (error) {
      console.error('Failed to connect to Ledger:', error)
      throw error
    }
  }

  #signTransaction: XRPLSignTransactionMethod = async ({ tx_json, account, network }) => {
    if (!this.#app) throw new Error('Ledger not connected')

    if (tx_json.Account !== account.address) {
      throw new Error('Account does not match')
    }
    if (!tx_json.Account) {
      tx_json.Account = account.address
    }
    const chainId = convertNetworkToChainId(network)
    const NetworkID = Number(chainId.split(':')[1])
    if (tx_json.NetworkID != null && tx_json.NetworkID !== NetworkID) {
      throw new Error('Network does not match')
    }
    if (tx_json.NetworkID != null && NetworkID > 1024) {
      tx_json.NetworkID = NetworkID
    }

    tx_json.SigningPubKey = (await this.#app.getAddress(bip32Path())).publicKey.toUpperCase()
    try {
      const signature = await this.#app.signTransaction(bip32Path(), encode(tx_json as any))
      tx_json.TxnSignature = signature

      return {
        signed_tx_blob: encode(tx_json as any) as string,
      }
    } catch (error) {
      console.error('Failed to sign transaction:', error)
      throw error
    }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async ({ tx_json, account, network }) => {
    const { signed_tx_blob } = await this.#signTransaction({ tx_json, account, network })

    try {
      const client = await this.#getClient(network)
      const response = await client.submit(signed_tx_blob)

      return {
        tx_json: response.result.tx_json as any,
        tx_hash: response.result.tx_json.hash!,
      }
    } catch (error) {
      console.error('Failed to submit transaction:', error)
      throw error
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

  async disconnect(): Promise<void> {
    if (this.#transport) {
      await this.#transport.close()
      this.#transport = null
    }
    if (this.#app) {
      await this.#app.transport.close()
      this.#app = null
    }
    this.#accounts = []
    this.#emit('change', { accounts: this.accounts })

    // Close all XRPL clients
    for (const client of Object.values(this.#clients)) {
      await client.disconnect()
    }
    this.#clients = {}
  }
}
