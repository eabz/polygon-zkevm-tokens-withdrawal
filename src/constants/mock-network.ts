'use client'

import { mockZkEVMChainID } from '.'

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const mockNetwork = {
  id: mockZkEVMChainID,
  name: 'Polygon ZkEVM Signer',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  network: 'polygon-zkevm-signer',
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8787/'],
    },
    public: {
      http: ['http://127.0.0.1:8787/'],
    },
  },
}
