'use client'

import { IconButton } from '@chakra-ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card'
import { useDisclosure } from '@chakra-ui/hooks'
import { Center, Heading, HStack, Stack, StackDivider } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useNetwork } from 'wagmi'

import { AddIcon } from '@/assets'
import { AddTokenModal, Token } from '@/components'
import { defaultTokensLists, polygonZkEVMChainID } from '@/constants'
import { useIsMounted } from '@/hooks'
import { IToken, useTokenStore } from '@/store'

const getTokensList = (tokens: Record<string, IToken>): IToken[] => {
  const tokensList: IToken[] = []

  for (const token of Object.values(tokens)) {
    tokensList.push(token)
  }

  for (const token of defaultTokensLists) {
    tokensList.push(token)
  }

  return tokensList
}

export function TokensList() {
  const { isOpen, onClose, onOpen } = useDisclosure()

  const { tokens } = useTokenStore()

  const { isConnected, isConnecting } = useAccount()

  const { chain } = useNetwork()

  const isMounted = useIsMounted()
  if (!isMounted) return null

  const tokensList: IToken[] = getTokensList(tokens)

  return (
    <>
      <AddTokenModal isOpen={isOpen} onClose={onClose} />
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
            {isConnected && chain?.id === polygonZkEVMChainID && (
              <IconButton
                aria-label="Add new token icon button"
                icon={<AddIcon boxSize={4} />}
                rounded="full"
                size="sm"
                onClick={onOpen}
              />
            )}
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
    </>
  )
}
