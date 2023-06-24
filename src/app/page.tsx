'use client'

import { Center, Stack, Text, VStack } from '@chakra-ui/layout'

import { Navbar } from '@/components'

export default function Home() {
  return (
    <Stack margin={0} maxHeight="calc(100vh)" minHeight="calc(100vh)" position="relative">
      <Navbar />
      <Center height="calc(100vh)" width="calc(100vw)">
        <VStack>
          <Text>CONTENT</Text>
        </VStack>
      </Center>
    </Stack>
  )
}
