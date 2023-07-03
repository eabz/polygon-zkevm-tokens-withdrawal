'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Spinner } from '@chakra-ui/spinner'
import { useEffect, useMemo, useState } from 'react'
import { Abi, Address, isAddress } from 'viem'
import { useAccount, useContractReads, useNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import { tokenWrapperABI } from '@/constants'
import { IToken, useTokenStore, useZkEVMNetwork } from '@/store'

export function AddTokenModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { isConnected } = useAccount()

  const { chainID } = useZkEVMNetwork()

  const { chain } = useNetwork()

  const [newToken, setNewToken] = useState<string | undefined>(undefined)

  const [newTokenData, setNewTokenData] = useState<IToken | undefined>(undefined)

  const handleInputChange = (newToken: string) => {
    setNewTokenData(undefined)

    if (newToken === '') {
      setNewToken(undefined)
    }

    if (isAddress(newToken)) {
      setNewToken(newToken)
    }
  }

  const contractData = useMemo(() => {
    return {
      abi: tokenWrapperABI as Abi,
      address: newToken as Address,
      functionName: 'name',
    }
  }, [newToken])

  const { data, isLoading } = useContractReads({
    allowFailure: true,
    contracts: [
      {
        ...contractData,
        functionName: 'name',
      },
      {
        ...contractData,
        functionName: 'decimals',
      },
      {
        ...contractData,
        functionName: 'symbol',
      },
      {
        ...contractData,
        functionName: 'bridgeAddress',
      },
    ],
    enabled: newToken !== undefined && isConnected && chain?.id === chainID,
  })

  useEffect(() => {
    if (
      !newToken ||
      !data ||
      data.length !== 4 ||
      data[0].status === 'failure' ||
      data[1].status === 'failure' ||
      data[2].status === 'failure' ||
      data[3].status === 'failure'
    )
      return

    const token: IToken = {
      address: newToken,
      chainID,
      decimals: data[1].result as number,
      name: data[0].result as string,
      symbol: data[2].result as string,
    }

    setNewTokenData(token)
  }, [chainID, data, newToken])

  const { addToken } = useTokenStore()

  const handleAddToken = (token: IToken) => {
    addToken(token)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="22px">Add a custom token</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="5">
            <Input
              background="light-gray"
              borderColor="accent"
              focusBorderColor="accent"
              onChange={(e) => handleInputChange(e.target.value)}
            />
            <Box height="200px">
              <Center height="full" width="full">
                {!newToken && !isLoading && <Text>No token found</Text>}
                {isLoading && <Spinner size="lg" />}
                {newTokenData && (
                  <VStack>
                    <Heading fontSize="18px" paddingY="2">
                      New token found!
                    </Heading>
                    <Avatar background="accent" icon={<UnknownIcon fontSize="1.5rem" />} size="sm" />
                    <Text fontSize="18px" fontWeight="400" lineHeight="10px">
                      {newTokenData.name}
                    </Text>
                    <Text color="gray" fontSize="14px" lineHeight="10px">
                      {newTokenData.symbol}
                    </Text>
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      marginY="5"
                      onClick={() => handleAddToken(newTokenData)}
                    >
                      Add Token
                    </Button>
                  </VStack>
                )}
              </Center>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
