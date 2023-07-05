'use client'

export const testNetwork = {
  id: 0x5a2,
  name: 'Forced Batch zkEVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  network: 'polygon-zkevm-testnet',
  rpcUrls: {
    default: {
      http: ['https://zkevm-testnet.kindynos.mx'],
    },
    public: {
      http: ['https://zkevm-testnet.kindynos.mx'],
    },
  },
}

export const mainNetwork = {
  id: 0x44d,
  name: 'Forced Batch zkEVM Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  network: 'polygon-zkevm',
  rpcUrls: {
    default: {
      http: ['https://zkevm.kindynos.mx/'],
    },
    public: {
      http: ['https://zkevm.kindynos.mx/'],
    },
  },
}
