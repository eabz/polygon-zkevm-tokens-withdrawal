'use client'

import { polygonZkEVMChainID } from '.'

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

const mockRPC = 'https://mock-rpc.kindynos.workers.dev'

export const mockNetwork = {
  id: polygonZkEVMChainID,
  name: 'Polygon ZkEVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  network: 'polygon-zkevm-testnet',
  rpcUrls: {
    default: {
      http: [mockRPC],
    },
    public: {
      http: [mockRPC],
    },
  },
}
