'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { Spinner } from '@chakra-ui/spinner'
import { useEffect, useState } from 'react'
import { Abi, Address, encodeFunctionData, formatUnits, Hex, parseUnits, zeroAddress } from 'viem'
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useFeeData,
  useNetwork,
  usePublicClient,
  useSendTransaction,
  useSwitchNetwork,
  useTransaction,
} from 'wagmi'

import { UnknownIcon } from '@/assets'
import { isNativeToken, tokenWrapperABI, zkEVMABI, zkEVMBridgeABI } from '@/constants'
import { usePermit } from '@/hooks'
import { IToken, useZkEVMNetwork } from '@/store'
import { rawTxToCustomRawTx } from '@/utils'

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

  const [value, setValue] = useState(parseFloat(balance))

  const { zkEVMAddress, chainID, l1MaticTokenAddress, l1ChainID, bridgeAddress } = useZkEVMNetwork()

  const { data: forceBatchFeeData, status: forceBatchFeeStatus } = useContractRead({
    abi: zkEVMABI as Abi,
    address: zkEVMAddress,
    enabled: chain?.id !== chainID,
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
    enabled: chain?.id !== chainID,
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

  const { writeAsync: submitApprovalBatch, status: statusApprovalBatch } = useContractWrite({
    abi: tokenWrapperABI,
    address: l1MaticTokenAddress,
    functionName: 'approve',
  })

  const handleApproveBatch = async (amount: number | undefined) => {
    if (!amount) return

    const amountParsed = parseUnits(amount.toString(), 18)

    try {
      await submitApprovalBatch({ args: [zkEVMAddress as Address, amountParsed] })
    } catch (e) {
      console.log('error: => submitApprovalBatch ')
    }
  }

  const { switchNetworkAsync } = useSwitchNetwork()

  const { data: feeData } = useFeeData()

  const { sendTransactionAsync } = useSendTransaction()

  const [signedTransaction, setSignedTransaction] = useState<string | undefined>(undefined)

  const [transaction, setTransactionHash] = useState<Hex | undefined>(undefined)

  const { data: transactionData } = useTransaction({
    enabled: chain?.id === chainID,
    hash: transaction,
  })

  useEffect(() => {
    if (!transactionData) return

    const chars = Object.values(transactionData as any)

    const parsedTx = chars.join('')

    const rawTx = rawTxToCustomRawTx(parsedTx as Hex)

    setSignedTransaction(rawTx)

    setTransactionLoading(false)

    if (switchNetworkAsync) {
      switchNetworkAsync(l1ChainID)
    }
  }, [l1ChainID, switchNetworkAsync, transactionData])

  const [transactionLoading, setTransactionLoading] = useState(false)

  const { permit: permitFunction } = usePermit()

  const { getTransactionCount } = usePublicClient()

  const handleSignTransaction = async (amount: number) => {
    if (!feeData || !address) return

    const isNative = isNativeToken(withdrawToken.address)

    const amountParsed = parseUnits(amount.toString(), isNative ? 18 : withdrawToken.decimals)

    const nonce = await getTransactionCount({ address })

    let permit

    if (!isNative) {
      permit = await permitFunction({
        nonce,
        owner: address,
        spender: bridgeAddress,
        tokenAddress: withdrawToken.address,
        value: amountParsed.toString(),
      })
    }

    if (permit) {
      const withdrawFunction = encodeFunctionData({
        abi: zkEVMBridgeABI as Abi,
        args: [0, address as Address, amountParsed, isNative ? zeroAddress : withdrawToken.address, true, permit],
        functionName: 'bridgeAsset',
      })

      const tx = {
        chainId: chainID,
        data: withdrawFunction,
        from: address,
        gasPrice: feeData.gasPrice ?? undefined,
        to: bridgeAddress,
        value: isNative ? amountParsed : BigInt(0),
      }

      if (sendTransactionAsync) {
        try {
          const transaction = await sendTransactionAsync(tx)
          setTransactionLoading(true)
          setTransactionHash(transaction.hash)
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  const { writeAsync: submitForceBatch, status: statusSubmitForceBatch } = useContractWrite({
    abi: zkEVMABI,
    address: zkEVMAddress,
    functionName: 'forceBatch',
  })

  const handleWithdraw = async (signedTx: string | undefined, forceBatchFee: number | undefined) => {
    if (!signedTx || !forceBatchFee) return

    const fee = parseUnits(forceBatchFee.toString(), 18)

    try {
      await submitForceBatch({ args: [signedTx, fee] })
      onClose()
    } catch (e) {
      console.log('error: => submitForceBatch ')
    }
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

                  {!signedTransaction && (
                    <>
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
                    </>
                  )}

                  {chain?.id === chainID && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => handleSignTransaction(value)}
                    >
                      {transactionLoading ? <Spinner color="white" size="sm" /> : <Text>Sign Transaction</Text>}
                    </Button>
                  )}

                  {chain?.id !== chainID && !forceBatchAllowance && (
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

                  {chain?.id !== chainID && forceBatchAllowance && (
                    <Button
                      _hover={{ background: 'accent' }}
                      background="accent"
                      color="white"
                      isDisabled={value === 0}
                      size="md"
                      onClick={() => handleWithdraw(signedTransaction, forceBatchFee)}
                    >
                      {statusSubmitForceBatch === 'loading' ? (
                        <Spinner color="white" size="sm" />
                      ) : (
                        <Text> Withdraw</Text>
                      )}
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
