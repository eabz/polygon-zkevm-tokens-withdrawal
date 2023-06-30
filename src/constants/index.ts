'use client'

import { nativeTokenAddress } from './tokens'

export * from './abis'
export * from './tokens'

export const polygonZkEVMChainID = 0x5a2

export const l1ChainID = 0x5

export const zkEVMAddress = '0xa997cfD539E703921fD1e3Cf25b4c241a27a4c7A'

export const zkEVMBridgeAddress = '0xf6beeebb578e214ca9e23b0e9683454ff88ed2a7'

export const l1MaticTokenAddress = '0x1319D23c2F7034F52Eb07399702B040bA278Ca49'

export function isNativeToken(token: string) {
  return token === nativeTokenAddress
}
