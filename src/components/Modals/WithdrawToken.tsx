'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Spinner } from '@chakra-ui/spinner'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { Abi, Address, formatUnits, parseUnits } from 'viem'
import { useAccount, useContractRead, useContractWrite, useNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import {
  l1MaticTokenAddress,
  nativeTokenAddress,
  polygonZkEVMChainID,
  tokenWrapperABI,
  zkEVMABI,
  zkEVMAddress,
  zkEVMBridgeAddress,
} from '@/constants'
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

  const [bridgeAllowed, setBridgeAllowed] = useState(false)

  const { data: bridgeAllowanceData, status: bridgeAllowanceReadStatus } = useContractRead({
    abi: tokenWrapperABI as Abi,
    address: withdrawToken.address as Address,
    args: [address as Address, zkEVMBridgeAddress],
    enabled: withdrawToken.address !== nativeTokenAddress && chain?.id === polygonZkEVMChainID,
    functionName: 'allowance',
    watch: true,
  })

  useEffect(() => {
    if (!bridgeAllowanceData || bridgeAllowanceReadStatus === 'loading') return

    const bridgeAllowance =
      withdrawToken.address !== nativeTokenAddress
        ? parseFloat(formatUnits(bridgeAllowanceData as bigint, withdrawToken.decimals))
        : 0

    setBridgeAllowed(withdrawToken.address !== nativeTokenAddress ? bridgeAllowance >= value : true)
  }, [bridgeAllowanceData, bridgeAllowanceReadStatus, value, withdrawToken.address, withdrawToken.decimals])

  const { data: forceBatchFeeData, status: forceBatchFeeStatus } = useContractRead({
    abi: zkEVMABI as Abi,
    address: zkEVMAddress,
    enabled: chain?.id !== polygonZkEVMChainID,
    functionName: 'getForcedBatchFee',
  })

  const [forceBatchFee, setForceBatchFee] = useState<number | undefined>()

  useEffect(() => {
    if (!forceBatchFeeData || forceBatchFeeStatus === 'loading') return

    const fee = parseFloat(formatUnits(forceBatchFeeData as bigint, 18))

    setForceBatchFee(fee)
  }, [forceBatchFeeData, forceBatchFeeStatus])

  const { data: forceBatchAllowanceData, status: forceBatchAllowanceStatus } = useContractRead({
    abi: tokenWrapperABI as Abi,
    address: l1MaticTokenAddress,
    args: [address as Address, zkEVMAddress],
    enabled: chain?.id !== polygonZkEVMChainID,
    functionName: 'allowance',
    watch: true,
  })

  const [forceBatchAllowance, setForceBatchAllowance] = useState(false)

  useEffect(() => {
    if (!forceBatchAllowanceData || !forceBatchFee || forceBatchAllowanceStatus === 'loading') return

    const allowance = parseFloat(formatUnits(forceBatchAllowanceData as bigint, 18))

    setForceBatchAllowance(allowance >= forceBatchFee)
  }, [forceBatchAllowanceData, forceBatchFee, forceBatchAllowanceStatus])

  const handleOnChange = (amount: string) => {
    if (amount === '') {
      setValue(0)
    }
    setValue(parseFloat(amount))
  }

  const { write: submitApprovalBridge, status: statusApprovalBridge } = useContractWrite({
    abi: tokenWrapperABI,
    address: withdrawToken.address as Address,
    functionName: 'approve',
  })

  const { write: submitApprovalBatch, status: statusApprovalBatch } = useContractWrite({
    abi: tokenWrapperABI,
    address: l1MaticTokenAddress,
    functionName: 'approve',
  })

  const handleApproveBatch = (amount: number | undefined) => {
    if (!amount) return

    const amountParsed = parseUnits(amount.toString(), 18)

    submitApprovalBatch({ args: [zkEVMAddress as Address, amountParsed] })
  }

  const handleApproveBridge = (amount: number) => {
    const amountParsed = parseUnits(amount.toString(), withdrawToken.decimals)

    submitApprovalBridge({ args: [zkEVMBridgeAddress as Address, amountParsed] })
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

                  {chain?.id === polygonZkEVMChainID && !bridgeAllowed && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => handleApproveBridge(value)}
                    >
                      {statusApprovalBridge === 'loading' ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        <Text>Approve Bridge</Text>
                      )}
                    </Button>
                  )}

                  {chain?.id === polygonZkEVMChainID && bridgeAllowed && (
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

                  {chain?.id !== polygonZkEVMChainID && !forceBatchAllowance && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => handleApproveBatch(forceBatchFee)}
                    >
                      {statusApprovalBatch === 'loading' ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        <Text>Approve Batch</Text>
                      )}
                    </Button>
                  )}
                  {chain?.id !== polygonZkEVMChainID && forceBatchAllowance && (
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
