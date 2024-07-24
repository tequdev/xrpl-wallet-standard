import type { IdentifierString } from '@wallet-standard/core'

export const XRPL_MAINNET = 'xrpl:0'
export const XRPL_TESTNET = 'xrpl:1'
export const XRPL_DEVNET = 'xrpl:2'
export const XAHAU_MAINNET = 'xrpl:21337'
export const XAHAU_TESTNET = 'xrpl:21338'

export const XRPL_NETWORKS = [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET] as const

export const XAHAU_NETWORKS = [XAHAU_MAINNET, XAHAU_TESTNET] as const

export const XRPL_PROTOCOL_NETWORKS = [...XRPL_NETWORKS, ...XAHAU_NETWORKS] as const

export type XRPLProtorcolNetwork = (typeof XRPL_PROTOCOL_NETWORKS)[number]

export function isXRPLNetworks(network: IdentifierString): network is XRPLProtorcolNetwork {
  return XRPL_PROTOCOL_NETWORKS.includes(network as XRPLProtorcolNetwork)
}

export type XRPLIdentifierString = `xrpl:${string}`
