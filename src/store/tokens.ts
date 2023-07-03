import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { defaultTokensLists } from '@/constants'

export interface IToken {
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  chainID: number
}

interface ITokenStore {
  tokens: Record<string, IToken>
  addToken: (token: IToken) => void
  removeToken: (tokenAddress: string) => void
}

function addToken(record: Record<string, IToken>, token: IToken): Record<string, IToken> {
  const alreadyIncluded = defaultTokensLists.map((token) => token.address).includes(token.address.toLowerCase())

  if (alreadyIncluded) {
    return record
  }

  record[token.address.toLowerCase()] = token

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
