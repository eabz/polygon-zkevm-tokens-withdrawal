'use client'

import '@/theme/style.css'

import { Center, Stack, VStack } from '@chakra-ui/layout'

import { Navbar, TokensList } from '@/components'

export default function Home() {
  return (
    <Stack margin={0} maxHeight="calc(100vh)" minHeight="calc(100vh)" position="relative">
      <Navbar />
      <Center height="calc(100vh)" width="calc(100vw)">
        <VStack>
          <TokensList />
        </VStack>
      </Center>
    </Stack>
  )
}
