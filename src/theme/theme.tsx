'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/provider'
/* eslint-disable no-restricted-imports */
import { extendTheme } from '@chakra-ui/react'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

const roobert = localFont({
  src: [
    {
      path: './fonts/roobert-light.ttf',
      weight: '300',
    },
    {
      path: './fonts/roobert-regular.ttf',
      weight: '400',
    },
    {
      path: './fonts/roobert-medium.ttf',
      weight: '500',
    },
    {
      path: './fonts/roobert-semibold.ttf',
      weight: '600',
    },
    {
      path: './fonts/roobert-bold.ttf',
      weight: '700',
    },
    {
      path: './fonts/roobert-heavy.ttf',
      weight: '800',
    },
  ],
})

export const fonts = {
  body: `${roobert.style.fontFamily}, sans-serif`,
  heading: `${roobert.style.fontFamily}, sans-serif`,
}

export const theme = extendTheme({
  colors: {
    accent: '#7b3fe4',
    background: '#d5bdf5',
    'dark-gray': '##8d8a95',
    'light-gray': '#f1f3f2',
  },
  fonts,
  styles: {
    global: {
      body: {},
    },
  },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </>
  )
}
