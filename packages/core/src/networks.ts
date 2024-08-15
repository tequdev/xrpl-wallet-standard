import type { IdentifierString } from '@wallet-standard/core'

export const XRPL_MAINNET = 'xrpl:0' as const
export const XRPL_TESTNET = 'xrpl:1' as const
export const XRPL_DEVNET = 'xrpl:2' as const
export const XAHAU_MAINNET = 'xrpl:21337' as const
export const XAHAU_TESTNET = 'xrpl:21338' as const

export const XRPL_NETWORKS = [XRPL_MAINNET, XRPL_TESTNET, XRPL_DEVNET] as const

export const XAHAU_NETWORKS = [XAHAU_MAINNET, XAHAU_TESTNET] as const

export const XRPL_PROTOCOL_NETWORKS = [...XRPL_NETWORKS, ...XAHAU_NETWORKS] as const

export type XRPLProtorcolNetwork = (typeof XRPL_PROTOCOL_NETWORKS)[number]

export function isXRPLNetworks(network: IdentifierString): network is XRPLProtorcolNetwork {
  return XRPL_PROTOCOL_NETWORKS.includes(network as XRPLProtorcolNetwork)
}

export type XRPLStandardIdentifier = `xrpl:${number}`
export type XRPLReserverdIdentifier =
  | 'xrpl:mainnet'
  | 'xrpl:testnet'
  | 'xrpl:devnet'
  | 'xrpl:xahau-mainnet'
  | 'xrpl:xahau-testnet'

export type XRPLIdentifierString = XRPLStandardIdentifier | XRPLReserverdIdentifier
