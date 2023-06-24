'use client'

import { HStack, Stack } from '@chakra-ui/layout'

import { ConnectWallet } from '@/components'

export function Navbar() {
  return (
    <Stack backgroundColor="white" boxShadow="lg" margin="0 !important" width="full">
      <HStack direction="row" height="70px" justify={{ base: 'center', md: 'end' }} paddingX={{ base: 2, md: 10 }}>
        <ConnectWallet />
      </HStack>
    </Stack>
  )
}
