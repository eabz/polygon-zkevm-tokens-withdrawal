'use client'

import { HStack, Stack, Text } from '@chakra-ui/layout'
import { Switch } from '@chakra-ui/switch'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Navbar() {
  const handleSwitch = (toggle) => {
    console.log(toggle)
  }

  return (
    <Stack backgroundColor="white" boxShadow="lg" margin="0 !important" width="full">
      <HStack direction="row" height="70px" justify={{ base: 'center', md: 'end' }} paddingX={{ base: 2, md: 10 }}>
        <HStack>
          <Text>Use testnet</Text>
          <Switch onChange={handleSwitch} />
        </HStack>
        <ConnectButton />
      </HStack>
    </Stack>
  )
}
