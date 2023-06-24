'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/provider'
/* eslint-disable no-restricted-imports */
import { extendTheme } from '@chakra-ui/react'
import { lightTheme, Theme } from '@rainbow-me/rainbowkit'
import merge from 'lodash/merge'
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

export const walletTheme = merge(lightTheme(), {
  colors: {
    accentColor: '#7b3fe4',
    closeButton: '#7b3fe4',
  },
  fonts: { body: roobert.style.fontFamily },
} as Theme)

export const fonts = {
  body: `${roobert.style.fontFamily}, sans-serif`,
  heading: `${roobert.style.fontFamily}, sans-serif`,
}

export const theme = extendTheme({
  colors: {
    accent: '#7b3fe4',
    background: '#d5bdf5',
    'light-gray': '#f1f3f2',
    red: '#b30000',
  },
  fonts,
  styles: {
    global: {
      body: {
        background:
          'radial-gradient(66.32% 66.32% at 54.13% 113.95%,rgba(108,38,255,0.2) 0,rgba(242,89,255,0) 100%), linear-gradient(211.99deg,rgba(65,157,241,0.2) -4.17%,rgba(45,143,234,0) 68.7%),radial-gradient(100% 100% at 28.65% 0,#d5bdf5 0,rgba(250,247,254,0) 100%);',
      },
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
