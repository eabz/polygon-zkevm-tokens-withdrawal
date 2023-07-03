'use client'

import { Address } from 'viem'

export * from './abis'
export * from './mock-network'
export * from './tokens'

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export enum Chain {
  TESTNET,
  MAINNET,
}

const chainID = {
  [Chain.TESTNET]: 0x5a2,
  [Chain.MAINNET]: 0x44d,
}

const l1ChainID = {
  [Chain.TESTNET]: 0x5,
  [Chain.MAINNET]: 0x1,
}

const zkEVMAddress = {
  [Chain.TESTNET]: '0xa997cfD539E703921fD1e3Cf25b4c241a27a4c7A',
  [Chain.MAINNET]: '',
}

const bridgeAddress = {
  [Chain.TESTNET]: '0xF6BEEeBB578e214CA9E23B0e9683454Ff88Ed2A7',
  [Chain.MAINNET]: '0x2a3dd3eb832af982ec71669e178424b10dca2ede',
}

const l1MaticTokenAddress = {
  [Chain.TESTNET]: '0x1319D23c2F7034F52Eb07399702B040bA278Ca49',
  [Chain.MAINNET]: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
}

export const getChainID = (chain: Chain): number => {
  return chainID[chain]
}

export const getL1ChainID = (chain: Chain): number => {
  return l1ChainID[chain]
}

export const getZkEVMAddress = (chain: Chain): Address => {
  return zkEVMAddress[chain] as Address
}

export const getBridgeAddress = (chain: Chain): Address => {
  return bridgeAddress[chain] as Address
}

export const getL1MaticTokenAddress = (chain: Chain): Address => {
  return l1MaticTokenAddress[chain] as Address
}

export function isNativeToken(token: string) {
  return token === nativeTokenAddress
}
