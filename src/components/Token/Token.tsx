'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Box, HStack, Text, VStack } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { Address, useAccount, useContractRead, useNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import { polygonZkEVMChainID, tokenWrapperABI } from '@/constants'
import { IToken } from '@/store'

export function Token({ tokenData }: { tokenData: IToken }) {
  const { address } = useAccount()

  const [balance, setBalance] = useState(0)

  const { chain } = useNetwork()

  const { data, isLoading } = useContractRead({
    abi: tokenWrapperABI,
    address: tokenData.address as Address,
    args: [address as Address],
    enabled: address && chain && chain.id === polygonZkEVMChainID,
    functionName: 'balanceOf',
  })

  useEffect(() => {
    if (!chain || chain.id !== polygonZkEVMChainID) return

    setBalance(balance)
  }, [balance, chain, data])

  const { openChainModal } = useChainModal()

  return (
    <HStack key={tokenData.address} justifyContent="space-between">
      <HStack>
        <Avatar background="accent" icon={<UnknownIcon fontSize="1.5rem" />} size="sm" src={tokenData.logoURI} />
        <Box>
          <VStack align="start">
            <Text fontSize="16px" fontWeight="600" lineHeight="10px">
              {tokenData.name}
            </Text>
            <Text color="gray" fontSize="12px" fontWeight="400" lineHeight="5px" textTransform="uppercase">
              {tokenData.symbol}
            </Text>
          </VStack>
        </Box>
      </HStack>
      {chain?.id === polygonZkEVMChainID ? (
        <Box>{isLoading ? <Spinner color="gray" /> : <Text>{balance}</Text>}</Box>
      ) : (
        openChainModal && (
          <Button _hover={{ background: 'red' }} background="red" size="xs" onClick={() => openChainModal()}>
            <Text color="white" cursor="pointer" fontSize="xs">
              Change to L2 Network
            </Text>
          </Button>
        )
      )}
    </HStack>
  )
}
