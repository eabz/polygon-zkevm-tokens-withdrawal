import { Address } from 'viem'
import { create } from 'zustand'

import { Chain, getBridgeAddress, getChainID, getL1ChainID, getL1MaticTokenAddress, getZkEVMAddress } from '@/constants'

interface IChainStore {
  bridgeAddress: Address
  l1MaticTokenAddress: Address
  l1ChainID: number
  chainID: number
  zkEVMAddress: Address
  setNetwork: (network: Chain) => void
}

export const useZkEVMNetwork = create<IChainStore>()((set) => ({
  bridgeAddress: getBridgeAddress(Chain.MAINNET),
  chainID: getChainID(Chain.MAINNET),
  l1ChainID: getL1ChainID(Chain.MAINNET),
  l1MaticTokenAddress: getL1MaticTokenAddress(Chain.MAINNET),
  setNetwork: (network: Chain) =>
    set(() => ({
      bridgeAddress: getBridgeAddress(network),
      chainID: getChainID(network),
      l1ChainID: getL1ChainID(network),
      l1MaticTokenAddress: getL1MaticTokenAddress(network),
      zkEVMAddress: getBridgeAddress(network),
    })),
  zkEVMAddress: getZkEVMAddress(Chain.MAINNET),
}))
