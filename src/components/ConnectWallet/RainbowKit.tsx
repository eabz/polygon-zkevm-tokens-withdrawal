'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { AvatarComponent, getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { ReactNode } from 'react'
import { goerli, polygonZkEvmTestnet } from 'viem/chains'
import { configureChains, createConfig, mainnet, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { walletTheme } from '@/theme'

export function RainbowKit({ children }: { children: ReactNode }) {
  const { chains, publicClient } = configureChains([mainnet, goerli, polygonZkEvmTestnet], [publicProvider()])

  const { connectors } = getDefaultWallets({
    appName: 'Polygon ZkEVM Tokens Withdrawals',
    chains,
    projectId: 'polygon-zkevm-tokens-withdrawals',
  })

  const wagmiClient = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })

  const walletAvatars: AvatarComponent = ({ ensImage, size }) => {
    return ensImage ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt="ENS Image" height={size} src={ensImage} style={{ borderRadius: 999 }} width={size} />
    ) : (
      <Image
        alt="Polygon ZkEVM Logo"
        height={size}
        src="/images/polygon-icon.png"
        style={{ borderRadius: 999 }}
        width={size}
      />
    )
  }

  return (
    <WagmiConfig config={wagmiClient}>
      <RainbowKitProvider avatar={walletAvatars} chains={chains} modalSize="compact" theme={walletTheme}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
