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
  type XRPLStandardIdentifier,
  XRPL_MAINNET,
} from '@xrpl-wallet-standard/core'
import { XrplDefinitions, type XrplDefinitionsBase, encode, encodeForSigning } from 'ripple-binary-codec'
import { sign } from 'ripple-keypairs'
import { Client, type LedgerEntryRequest, type LedgerEntryResponse, Wallet } from 'xrpl'
import type { Amendments } from 'xrpl/dist/npm/models/ledger'

const LOCAL_STORAGE_KEY = '@xrpl-wallet-adapter/local-testonly'

interface LocalWalletProps {
  additionalNetworks?: Record<XRPLStandardIdentifier, { server: string; faucet: string }>
  autoFaucetNetwork?: XRPLIdentifierString
}

export class LocalWallet_TESTONLY implements XRPLBaseWallet {
  #name = 'Local'
  #icon =
    'data:image/png;base64,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' as const

  #accounts: XRPLWalletAccount[] = []

  #additionalNetworks: Record<XRPLStandardIdentifier, { server: string; faucet: string }>
  #autoFaucetNetwork: XRPLIdentifierString

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

  constructor({ additionalNetworks = {}, autoFaucetNetwork = 'xrpl:1' }: LocalWalletProps = {}) {
    this.#additionalNetworks = additionalNetworks
    this.#autoFaucetNetwork = autoFaucetNetwork

    if (new.target === LocalWallet_TESTONLY) {
      Object.freeze(this)
    }
  }

  #connect: StandardConnectMethod = async ({ silent = false } = {}) => {
    const secret = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!silent && !secret) {
      const seed = Wallet.generate().seed
      localStorage.setItem('@xrpl-wallet-adapter/local-testonly', seed!)
    }

    const account = this.#getAccount()
    if (!account) {
      this.#emit('change', { accounts: [] })
      return { accounts: [] }
    }

    const server = this.#getWssEndpointFromNetwork(this.#autoFaucetNetwork)
    const client = new Client(server)
    client.apiVersion = 1
    await client.connect()

    const response = await client
      .request({
        command: 'account_info',
        account: account.address,
        ledger_index: 'validated',
      })
      .catch((e) => {
        if (e.message === 'Account not found.') return undefined
        throw e
      })
    await client.disconnect()

    const Sequence = response?.result.account_data.Sequence
    if (!Sequence) {
      // faucet
      const faucetUrl = this.#getFaucetEndpointFromNetwork(this.#autoFaucetNetwork)
      await fetch(faucetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: account.address }),
      })
    }

    this.#accounts = [new XRPLWalletAccount(account.address)]
    this.#emit('change', { accounts: this.accounts })
    return {
      accounts: this.accounts,
    }
  }

  #signTransaction: XRPLSignTransactionMethod = async ({ tx_json, account, network }) => {
    const acc = this.#getAccount()
    if (!acc) throw new Error('Wallet not connected')

    const server = this.#getWssEndpointFromNetwork(network)

    const client = new Client(server)
    client.apiVersion = 1
    await client.connect()

    const { result: rawDefinitions } = await client.request({
      command: 'server_definitions',
    })
    const definitions = new XrplDefinitions(JSON.parse(JSON.stringify(rawDefinitions)))
    const prepared = await this.#autofill(client, tx_json, acc, definitions)
    await client.disconnect()

    const tx_blob = encodeForSigning(prepared, definitions)

    const signedTransaction = sign(tx_blob, acc.privateKey)

    return {
      signed_tx_blob: signedTransaction,
    }
  }

  #signAndSubmitTransaction: XRPLSignAndSubmitTransactionMethod = async ({ tx_json, account, network }) => {
    const acc = this.#getAccount()
    if (!acc) throw new Error('Wallet not connected')

    const server = this.#getWssEndpointFromNetwork(network)

    const client = new Client(server)
    client.apiVersion = 1
    await client.connect()

    const { result: rawDefinitions } = await client.request({
      command: 'server_definitions',
    })
    const definitions = new XrplDefinitions(JSON.parse(JSON.stringify(rawDefinitions)))
    const prepared = await this.#autofill(client, tx_json, acc, definitions)

    prepared.SigningPubKey = acc.publicKey
    const signature = sign(encodeForSigning(prepared, definitions), acc.privateKey)
    prepared.TxnSignature = signature
    const tx_blob = encode(prepared, definitions)

    const response = await client.submitAndWait(tx_blob)

    console.log(response.result)

    return {
      tx_json: response.result as any,
      tx_hash: response.result.hash,
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

  #autofill = async (
    client: Client,
    transaction: Record<string, any>,
    account: Wallet,
    definitions: XrplDefinitionsBase,
  ) => {
    if (transaction.Account && transaction.Account !== account.address) throw new Error('Account does not match')
    if (!transaction.Account) transaction.Account = account.address

    if (!transaction.Sequence) {
      const accountResponse = await client.request({
        command: 'account_info',
        account: account.address,
      })
      if (!transaction.Sequence) transaction.Sequence = accountResponse.result.account_data.Sequence
    }
    if (!transaction.LastLedgerSequence) {
      const response = await client.request({
        command: 'ledger',
        ledger_index: 'validated',
      })
      const ledgerIndex = response.result.ledger_index
      transaction.LastLedgerSequence = ledgerIndex + 5
    }
    const networkID = client.networkID
    if (transaction.NetworkID && transaction.NetworkID !== networkID) throw new Error('NetworkID does not match')
    if (!transaction.NetworkID && networkID !== undefined && networkID > 1024) transaction.NetworkID = networkID

    if (transaction.Fee === undefined) {
      const {
        result: { node: amendments },
      } = await client.request<LedgerEntryRequest, 1, LedgerEntryResponse<Amendments>>({
        command: 'ledger_entry',
        index: '7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4',
        validated: true,
      })
      const hasHookAmendment =
        !!amendments?.Amendments &&
        amendments.Amendments.indexOf('ECE6819DBA5DB528F1A241695F5A9811EF99467CDE22510954FD357780BBD078') > -1
      const tx_blob = hasHookAmendment
        ? encode({ ...transaction, SigningPubKey: '', Fee: '0' }, definitions)
        : undefined

      const response = await client.request({
        command: 'fee',
        tx_blob,
      })
      transaction.Fee = response.result.drops.open_ledger_fee
    }
    return transaction
  }

  #getAccount() {
    const seed = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!seed) return null
    const wallet = Wallet.fromSeed(seed)
    return wallet
  }

  #getWssEndpointFromNetwork(network: XRPLIdentifierString) {
    switch (network) {
      case 'xrpl:mainnet':
      case 'xrpl:0':
        throw new Error('Cannnot use mainnet with this Wallet')
      case 'xrpl:testnet':
      case 'xrpl:1':
        return 'wss://s.altnet.rippletest.net:51233'
      case 'xrpl:devnet':
      case 'xrpl:2':
        return 'wss://s.devnet.rippletest.net:51233'
      case 'xrpl:xahau-mainnet':
      case 'xrpl:21337':
        throw new Error('Cannnot use xahau mainnet with this Wallet')
      case 'xrpl:xahau-testnet':
      case 'xrpl:21338':
        return 'wss://xahau-test.net'
      default:
        if (this.#additionalNetworks[network]) return this.#additionalNetworks[network].server
        throw new Error('Invalid network')
    }
  }

  #getFaucetEndpointFromNetwork(network: XRPLIdentifierString) {
    switch (network) {
      case 'xrpl:mainnet':
      case 'xrpl:0':
        throw new Error('Cannnot use mainnet with this Wallet')
      case 'xrpl:testnet':
      case 'xrpl:1':
        return 'https://faucet.altnet.rippletest.net/accounts'
      case 'xrpl:devnet':
      case 'xrpl:2':
        return 'https://faucet.devnet.rippletest.net/accounts'
      case 'xrpl:xahau-mainnet':
      case 'xrpl:21337':
        throw new Error('Cannnot use xahau mainnet with this Wallet')
      case 'xrpl:xahau-testnet':
      case 'xrpl:21338':
        return 'https://xahau-test.net/accounts'
      default:
        if (this.#additionalNetworks[network]) return this.#additionalNetworks[network].faucet
        throw new Error('Invalid network')
    }
  }
}
