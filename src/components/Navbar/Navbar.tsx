'use client'

import { HStack, Stack, Text } from '@chakra-ui/layout'
import { Switch } from '@chakra-ui/switch'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import { Chain } from '@/constants'
import { useZkEVMNetwork } from '@/store'

export function Navbar() {
  const { setNetwork } = useZkEVMNetwork()

  const handleSwitch = (checked: boolean) => {
    if (checked) {
      setNetwork(Chain.TESTNET)
    } else {
      setNetwork(Chain.MAINNET)
    }
  }

  return (
    <Stack backgroundColor="white" boxShadow="lg" margin="0 !important" width="full">
      <HStack direction="row" height="70px" justify={{ base: 'center', md: 'end' }} paddingX={{ base: 2, md: 10 }}>
        <HStack>
          <Text>Use testnet</Text>
          <Switch onChange={(e) => handleSwitch(e.target.checked)} />
        </HStack>
        <ConnectButton />
      </HStack>
    </Stack>
  )
}
