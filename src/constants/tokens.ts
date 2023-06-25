'use client'

import { IToken } from '@/store'

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const defaultTokensLists: IToken[] = [
  {
    address: nativeTokenAddress,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    name: 'Ethereum',
    symbol: 'ETH',
  },
  {
    address: '0x14d7c114cf32f9eFFaD314a0C96a98E2cC38ac29',
    decimals: 18,
    logoURI: 'https://i.imgur.com/uIExoAr.png',
    name: 'Matic Token',
    symbol: 'MATIC',
  },
]
