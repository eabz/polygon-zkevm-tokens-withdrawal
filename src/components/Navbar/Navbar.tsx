'use client'

import { HStack, Stack } from '@chakra-ui/layout'

import { ConnectWallet } from '@/components'

export function Navbar() {
  return (
    <Stack backgroundColor="white" boxShadow="sm" margin="0 !important" width="full">
      <HStack direction="row" height="70px" justify="end" paddingX={{ base: 2, md: 10 }}>
        <ConnectWallet />
      </HStack>
    </Stack>
  )
}
