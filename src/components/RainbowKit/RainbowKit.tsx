'use client'

import '@rainbow-me/rainbowkit/styles.css'

import { AvatarComponent, connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import Image from 'next/image'
import { ReactNode, useMemo } from 'react'
import { goerli } from 'viem/chains'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

import { mockNetwork } from '@/constants/mock-network'
import { walletTheme } from '@/theme'

export function RainbowKit({ children }: { children: ReactNode }) {
  const { chains, publicClient } = configureChains([goerli, mockNetwork], [publicProvider()])

  const connectors = useMemo(() => {
    const projectId = '9e3063f0bb1e16224c8cca4d4b4cb0ac'

    return connectorsForWallets([
      {
        groupName: 'Recommended',
        wallets: [
          metaMaskWallet({ chains, projectId }),
          walletConnectWallet({ chains, projectId }),
          trustWallet({ chains, projectId }),
          coinbaseWallet({ appName: 'Polygon ZkEVM Tokens Withdrawal', chains }),
          rainbowWallet({ chains, projectId }),
        ],
      },
    ])
  }, [chains])

  const wagmiClient = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })

  const walletAvatars: AvatarComponent = ({ ensImage, size }) => {
    return ensImage ? (
      <Image alt="ENS Image" height={size} src={ensImage} style={{ borderRadius: 999 }} width={size} />
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
