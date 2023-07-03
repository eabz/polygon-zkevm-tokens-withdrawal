'use client'

import { IconButton } from '@chakra-ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card'
import { useDisclosure } from '@chakra-ui/hooks'
import { Center, Heading, HStack, Stack, StackDivider } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount, useNetwork } from 'wagmi'

import { AddIcon } from '@/assets'
import { AddTokenModal, Token, WithdrawTokenModal } from '@/components'
import { defaultTokensLists } from '@/constants'
import { useIsMounted } from '@/hooks'
import { IToken, useTokenStore, useZkEVMNetwork } from '@/store'

const getTokensList = (tokens: Record<string, IToken>, chainID: number): IToken[] => {
  const tokensList: IToken[] = []

  for (const token of Object.values(tokens)) {
    tokensList.push(token)
  }

  for (const token of defaultTokensLists) {
    tokensList.push(token)
  }

  return tokensList.filter((token) => token.chainID === chainID)
}

export function TokensList() {
  const { isOpen: isOpenAddToken, onClose: onCloseAddToken, onOpen: onOpenAddToken } = useDisclosure()

  const { isOpen: isOpenWithdrawToken, onClose: onCloseWithdrawToken, onOpen: onOpenWithdrawToken } = useDisclosure()

  const { chainID } = useZkEVMNetwork()

  const { tokens } = useTokenStore()

  const { isConnected, isConnecting } = useAccount()

  const { chain } = useNetwork()

  const [withdrawToken, setWithdrawToken] = useState<{ token: IToken; balance: string } | undefined>(undefined)

  const isMounted = useIsMounted()
  if (!isMounted) return null

  const tokensList: IToken[] = getTokensList(tokens, chainID)

  const handleOpenWithdraw = (token: IToken, balance: string) => {
    setWithdrawToken({ balance, token })
    onOpenWithdrawToken()
  }

  const handleWithdrawTokenClose = () => {
    setWithdrawToken(undefined)
    onCloseWithdrawToken()
  }

  return (
    <>
      <AddTokenModal isOpen={isOpenAddToken} onClose={onCloseAddToken} />
      {withdrawToken && (
        <WithdrawTokenModal
          balance={withdrawToken.balance}
          isOpen={isOpenWithdrawToken}
          withdrawToken={withdrawToken.token}
          onClose={handleWithdrawTokenClose}
        />
      )}
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
            {isConnected && chain?.id === chainID && (
              <IconButton
                aria-label="Add new token icon button"
                icon={<AddIcon boxSize={4} />}
                rounded="full"
                size="sm"
                onClick={onOpenAddToken}
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
                <Token key={token.address} openWithdraw={handleOpenWithdraw} tokenData={token} />
              ))}
            </Stack>
          )}
        </CardBody>

        <CardFooter background="white" borderTop="2px" borderTopColor="light-gray" height="50px" roundedBottom="2xl" />
      </Card>
    </>
  )
}
