'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Box, HStack, Text, VStack } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { Address, useAccount, useBalance, useContractRead, useNetwork, useSwitchNetwork } from 'wagmi'

import { UnknownIcon } from '@/assets'
import { isNativeToken, polygonZkEVMChainID, tokenWrapperABI } from '@/constants'
import { IToken } from '@/store'

export function Token({
  tokenData,
  openWithdraw,
}: {
  tokenData: IToken
  openWithdraw: (token: IToken, balance: string) => void
}) {
  const { address } = useAccount()

  const { data: nativeTokenBalance, isLoading: nativeTokenBalanceLoading } = useBalance({ address })

  const [balance, setBalance] = useState('0')

  const { chain } = useNetwork()

  const { data: tokenBalance, isLoading: tokenBalanceLoading } = useContractRead({
    abi: tokenWrapperABI,
    address: tokenData.address as Address,
    args: [address as Address],
    enabled: address && !isNativeToken(tokenData.address) && chain && chain.id === polygonZkEVMChainID,
    functionName: 'balanceOf',
  })

  useEffect(() => {
    if (!chain || chain.id !== polygonZkEVMChainID || !nativeTokenBalance) return

    let balanceFormatted = '0'

    if (isNativeToken(tokenData.address)) {
      balanceFormatted = parseFloat(formatUnits(nativeTokenBalance.value, tokenData.decimals)).toFixed(3)
    } else {
      if (!tokenBalance) return
      balanceFormatted = parseFloat(formatUnits(tokenBalance as bigint, tokenData.decimals)).toFixed(3)
    }

    setBalance(balanceFormatted)
  }, [balance, chain, nativeTokenBalance, tokenBalance, tokenData.address, tokenData.decimals])

  const { switchNetwork } = useSwitchNetwork()

  const handleL2NetworkChange = () => {
    if (switchNetwork) {
      switchNetwork(polygonZkEVMChainID)
    }
  }

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
        <HStack>
          <Box>
            {tokenBalanceLoading || nativeTokenBalanceLoading ? <Spinner color="gray" /> : <Text>{balance}</Text>}
          </Box>
          <Button
            _hover={{ background: 'accent' }}
            background="accent"
            color="white"
            size="xs"
            onClick={() => openWithdraw(tokenData, balance)}
          >
            Withdraw
          </Button>
        </HStack>
      ) : (
        <Button _hover={{ background: 'red' }} background="red" size="xs" onClick={handleL2NetworkChange}>
          <Text color="white" cursor="pointer" fontSize="xs">
            Change to L2 Network
          </Text>
        </Button>
      )}
    </HStack>
  )
}
