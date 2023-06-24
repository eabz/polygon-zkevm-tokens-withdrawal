'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
}

interface ITokenStore {
  tokens: Record<string, IToken>
  addToken: (token: IToken) => void
  removeToken: (tokenAddress: string) => void
}

function addToken(record: Record<string, IToken>, token: IToken): Record<string, IToken> {
  record[token.address] = token
  return record
}

function removeToken(record: Record<string, IToken>, tokenAddress: string): Record<string, IToken> {
  delete record[tokenAddress]
  return record
}

export const useTokenStore = create<ITokenStore>()(
  persist(
    (set) => ({
      addToken: (token: IToken) => set((state) => ({ tokens: addToken(state.tokens, token) })),
      removeToken: (tokenAddress: string) => set((state) => ({ tokens: removeToken(state.tokens, tokenAddress) })),
      tokens: {},
    }),
    {
      name: 'polygon-zkevm-tokens-store',
    },
  ),
)
