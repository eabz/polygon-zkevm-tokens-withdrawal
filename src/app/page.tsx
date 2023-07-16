'use client'

import '@/theme/style.css'

import { Center, HStack, Stack, Text } from '@chakra-ui/layout'
import Link from 'next/link'

import { Navbar, TokensList } from '@/components'

export default function Home() {
  return (
    <Stack margin={0} maxHeight="calc(100vh)" minHeight="calc(100vh)" position="relative">
      <Navbar />
      <Center height="calc(90vh)" width="calc(100vw)">
        <TokensList />
      </Center>
      <HStack align="center" justify="center" paddingY="2" width="full">
        <Text>
          Built by{' '}
          <Link href="https://twitter.com/0xeabz" rel="noreferer" target="_blank">
            0xeabz
          </Link>
        </Text>
      </HStack>
    </Stack>
  )
}
