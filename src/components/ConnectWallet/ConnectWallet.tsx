'use client'

import { Button } from '@chakra-ui/button'
import { Text } from '@chakra-ui/layout'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function ConnectWallet() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, openChainModal, authenticationStatus, mounted }) => {
        const ready = mounted && authenticationStatus !== 'loading'
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated')

        if (connected) {
          if (chain.unsupported) {
            return (
              <Button
                _active={{ bg: 'red', color: 'white' }}
                _hover={{ bg: 'red', color: 'white' }}
                background="red"
                color="white"
                size="sm"
                onClick={() => openChainModal()}
              >
                Change wallet network
              </Button>
            )
          }

          return (
            <Button
              _active={{ bg: 'accent', color: 'white' }}
              _hover={{ bg: 'accent', color: 'white' }}
              background="accent"
              color="white"
              size="sm"
              onClick={() => openAccountModal()}
            >
              <Text fontSize="16px" fontWeight="500">
                {account.displayName}
              </Text>
            </Button>
          )
        }
        return (
          <Button
            _active={{ bg: 'accent', color: 'white' }}
            _hover={{ bg: 'accent', color: 'white' }}
            background="accent"
            color="white"
            size="sm"
            onClick={() => openConnectModal()}
          >
            <Text fontSize="16px" fontWeight="500">
              Connect to a wallet
            </Text>
          </Button>
        )
      }}
    </ConnectButton.Custom>
  )
}
