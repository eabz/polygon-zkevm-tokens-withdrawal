'use client'

import { IconButton } from '@chakra-ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card'
import { Center, Heading, HStack, Stack, StackDivider } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

import { AddIcon } from '@/assets'
import { Token } from '@/components'
import { defaultTokensLists } from '@/constants'
import { IToken, useTokenStore } from '@/store'

export function TokensList() {
  const { tokens } = useTokenStore()

  const { isConnected, isConnecting } = useAccount()

  const tokensList: IToken[] = useMemo(() => {
    const defaultTokens = defaultTokensLists
    for (const token of Object.values(tokens)) {
      defaultTokens.unshift(token)
    }
    return defaultTokens
  }, [tokens])

  return (
    <Card
      backgroundColor="rgba(255, 255, 255, 0.5)"
      boxShadow="xl"
      maxHeight="500px"
      rounded="2xl"
      width={{ base: '300px', md: '600px', lg: '1000px' }}
    >
      <CardHeader background="white" borderBottom="2px" borderBottomColor="light-gray" height="70px" roundedTop="2xl">
        <HStack justifyContent="space-between">
          <Heading size="md">Wallet Tokens</Heading>
          <IconButton aria-label="Add new token icon button" icon={<AddIcon boxSize={4} />} rounded="full" size="sm" />
        </HStack>
      </CardHeader>

      <CardBody backgroundColor="rgba(255, 255, 255, 0.3)" height="380px" overflowY="scroll">
        {!isConnected && !isConnecting && (
          <Center height="340px" width="full">
            <ConnectButton />
          </Center>
        )}

        {!isConnected && isConnecting && (
          <Center height="340px" width="full">
            <Spinner color="accent" size="xl" />{' '}
          </Center>
        )}

        {isConnected && !isConnecting && (
          <Stack divider={<StackDivider color="gray" />} spacing="4">
            {tokensList.map((token) => (
              <Token key={token.address} tokenData={token} />
            ))}
          </Stack>
        )}
      </CardBody>

      <CardFooter background="white" borderTop="2px" borderTopColor="light-gray" height="50px" roundedBottom="2xl" />
    </Card>
  )
}
