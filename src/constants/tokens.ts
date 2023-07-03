'use client'

import { IToken } from '@/store'

export const nativeTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const defaultTokensLists: IToken[] = [
  {
    address: nativeTokenAddress,
    chainID: 0x5a2,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    name: 'Ethereum',
    symbol: 'ETH',
  },
  {
    address: nativeTokenAddress,
    chainID: 0x44d,
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    name: 'Ethereum',
    symbol: 'ETH',
  },
  {
    address: '0x14d7c114cf32f9eFFaD314a0C96a98E2cC38ac29',
    chainID: 0x5a2,
    decimals: 18,
    logoURI: 'https://i.imgur.com/uIExoAr.png',
    name: 'Matic Token',
    symbol: 'MATIC',
  },
  {
    address: '0xa2036f0538221a77a3937f1379699f44945018d0',
    chainID: 0x44d,
    decimals: 18,
    logoURI: 'https://i.imgur.com/uIExoAr.png',
    name: 'Matic Token',
    symbol: 'MATIC',
  },
]
