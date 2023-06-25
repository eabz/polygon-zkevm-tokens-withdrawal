'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Spinner } from '@chakra-ui/spinner'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { Abi, Address, formatUnits } from 'viem'
import { useAccount, useContractReads, useContractWrite, useNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import { l1MaticTokenAddress, polygonZkEVMChainID, tokenWrapperABI, zkEVMABI, zkEVMAddress } from '@/constants'
import { IToken } from '@/store'

export function WithdrawTokenModal({
  isOpen,
  withdrawToken,
  balance,
  onClose,
}: {
  isOpen: boolean
  withdrawToken: IToken
  balance: string
  onClose: () => void
}) {
  const { address } = useAccount()

  const { chain } = useNetwork()

  const { openChainModal } = useChainModal()

  const [value, setValue] = useState(parseFloat(balance))

  const [allowed, setAllowed] = useState<{ allowed: boolean; amount: number }>({ allowed: false, amount: 0 })

  const { data, isLoading } = useContractReads({
    allowFailure: true,
    contracts: [
      {
        abi: tokenWrapperABI as Abi,
        address: l1MaticTokenAddress,
        args: [address as Address, zkEVMAddress],
        functionName: 'allowance',
      },
      {
        abi: zkEVMABI as Abi,
        address: zkEVMAddress,
        functionName: 'getForcedBatchFee',
      },
    ],
    enabled: address !== undefined && chain?.id !== polygonZkEVMChainID,
  })

  const handleOnChange = (amount: string) => {
    if (amount === '') {
      setValue(0)
    }
    setValue(parseFloat(amount))
  }

  useEffect(() => {
    if (isLoading || !data || data.length !== 2 || data[0].status === 'failure' || data[1].status === 'failure') return

    const allowance = parseFloat(formatUnits(data[0].result as bigint, 18))

    const fee = parseFloat(formatUnits(data[1].result as bigint, 18))

    setAllowed({ allowed: allowance >= fee, amount: fee })
  }, [data, isLoading])

  const { isLoading: isLoadingApproval, write: submitApproval } = useContractWrite({
    abi: tokenWrapperABI,
    address: l1MaticTokenAddress,
    functionName: 'approve',
  })

  const handleApprove = (amount: number) => {
    submitApproval({ args: [zkEVMAddress as Address, amount * 1 ** 18] })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Heading fontSize="22px">Withdraw Token</Heading>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing="5">
            <Box height="300px">
              <Center height="full" width="full">
                <VStack spacing="5">
                  <Box textAlign="center">
                    <Avatar
                      background="accent"
                      icon={<UnknownIcon fontSize="1.5rem" />}
                      size="sm"
                      src={withdrawToken.logoURI}
                    />

                    <Text fontWeight="700">{withdrawToken.name}</Text>
                    <Text fontWeight="300">{withdrawToken.symbol}</Text>
                  </Box>

                  <Text fontWeight="300">Select an amount to withdraw</Text>
                  <InputGroup>
                    <Input
                      background="light-gray"
                      borderColor="accent"
                      focusBorderColor="accent"
                      placeholder={balance}
                      textAlign="center"
                      type="number"
                      value={value}
                      width="300px"
                      onChange={(e) => handleOnChange(e.target.value)}
                    />
                    <InputRightElement>
                      <Button
                        _hover={{ background: 'accent' }}
                        background="accent"
                        color="white"
                        marginRight="2"
                        size="xs"
                        onClick={() => setValue(parseFloat(balance))}
                      >
                        Max
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {chain?.id === polygonZkEVMChainID && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={openChainModal}
                    >
                      Change to L1
                    </Button>
                  )}
                  {chain?.id !== polygonZkEVMChainID && !allowed.allowed && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => handleApprove(allowed.amount)}
                    >
                      {isLoadingApproval ? <Spinner color="white" size="sm" /> : <Text>Approve</Text>}
                    </Button>
                  )}
                  {chain?.id !== polygonZkEVMChainID && allowed.allowed && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => setValue(parseFloat(balance))}
                    >
                      Withdraw
                    </Button>
                  )}
                </VStack>
              </Center>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
