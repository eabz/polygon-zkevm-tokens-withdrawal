'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Spinner } from '@chakra-ui/spinner'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { Abi, Address, encodeFunctionData, formatUnits, parseUnits, zeroAddress } from 'viem'
import { useAccount, useContractRead, useContractWrite, useNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import {
  isNativeToken,
  l1MaticTokenAddress,
  polygonZkEVMChainID,
  tokenWrapperABI,
  zkEVMABI,
  zkEVMAddress,
  zkEVMBridgeABI,
  zkEVMBridgeAddress,
} from '@/constants'
import { useEthersSigner } from '@/hooks'
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
    enabled: !isNativeToken(withdrawToken.address) && chain?.id === polygonZkEVMChainID,
    functionName: 'allowance',
    watch: true,
  })

  useEffect(() => {
    if (bridgeAllowanceReadStatus !== 'success') return

    const bridgeAllowance = !isNativeToken(withdrawToken.address)
      ? parseFloat(formatUnits(bridgeAllowanceData as bigint, withdrawToken.decimals))
      : 0

    setBridgeAllowed(isNativeToken(withdrawToken.address) ? true : bridgeAllowance >= value)
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
    if (!forceBatchAllowanceData || !forceBatchFee || forceBatchAllowanceStatus !== 'success') return

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

  const signer = useEthersSigner({ chainId: polygonZkEVMChainID })

  const [signedTransaction, setSignedTransaction] = useState<string | undefined>(undefined)

  const handleSignTransaction = async (amount: number) => {
    if (!signer) return

    const isNative = isNativeToken(withdrawToken.address)

    const amountParsed = parseUnits(amount.toString(), isNative ? 18 : withdrawToken.decimals)

    const withdrawFunction = encodeFunctionData({
      abi: zkEVMBridgeABI as Abi,
      args: [0, address as Address, amountParsed, isNative ? zeroAddress : withdrawToken.address, true, ''],
      functionName: 'bridgeAsset',
    })

    const nonce = await signer.getNonce()

    const fee = await signer.provider.getFeeData()

    const tx = {
      data: withdrawFunction,
      from: address,
      gasLimit: 0,
      gasPrice: fee.gasPrice,
      maxFeePerGas: fee.maxFeePerGas,
      maxPriorityFeePerGas: fee.maxPriorityFeePerGas,
      nonce,
      to: zkEVMAddress,
      value: isNative ? amountParsed : 0,
    }

    const gasEstimate = await signer.estimateGas(tx)

    const totalGas = parseInt(gasEstimate.toString())

    tx.gasLimit = Math.floor(totalGas + totalGas * 0.1)

    setSignedTransaction(JSON.stringify(tx))

    if (openChainModal) {
      openChainModal()
    }
  }

  const handleWithdraw = async (signedTx: string | undefined) => {
    console.log(signedTx)
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
                  {!signedTransaction && (
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
                  )}

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
                      onClick={() => handleSignTransaction(value)}
                    >
                      {statusApprovalBridge === 'loading' ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        <Text>Sign Transaction</Text>
                      )}
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
                      onClick={() => handleWithdraw(signedTransaction)}
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
