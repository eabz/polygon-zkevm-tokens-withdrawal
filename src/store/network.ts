import { create } from 'zustand'

interface ITestnetStore {
  testnet: boolean
  setTestnet: (testnet: boolean) => void
}

export const useTestnet = create<ITestnetStore>()((set) => ({
  setTestnet: (testnet: boolean) => set(() => ({ testnet })),
  testnet: false,
}))
