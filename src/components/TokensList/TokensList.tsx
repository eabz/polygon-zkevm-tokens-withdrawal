'use client'

import { IconButton } from '@chakra-ui/button'
import { Card, CardBody, CardFooter, CardHeader } from '@chakra-ui/card'
import { Box, Center, Heading, HStack, Stack, StackDivider, Text } from '@chakra-ui/layout'
import { Spinner } from '@chakra-ui/spinner'
import { useAccount } from 'wagmi'

import { AddIcon } from '@/assets'
import { ConnectWallet } from '@/components'

export function TokensList() {
  const { isConnected, isConnecting } = useAccount()
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

      <CardBody backgroundColor="rgba(255, 255, 255, 0.3)" height="380px" overflowY="scroll" position="relative">
        {!isConnected && !isConnecting && (
          <Center height="340px" width="full">
            <ConnectWallet />
          </Center>
        )}
        {!isConnected && isConnecting && (
          <Center height="340px" width="full">
            <Spinner color="accent" size="xl" />
          </Center>
        )}
        {isConnected && !isConnecting && (
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Summary
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                View a summary of all your clients over the last month.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Overview
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                Check out the overview of your clients.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Analysis
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Analysis
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Analysis
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
            <Box>
              <Heading size="xs" textTransform="uppercase">
                Analysis
              </Heading>
              <Text fontSize="sm" paddingTop="2">
                See a detailed analysis of all your business clients.
              </Text>
            </Box>
          </Stack>
        )}
      </CardBody>

      <CardFooter background="white" borderTop="2px" borderTopColor="light-gray" height="50px" roundedBottom="2xl" />
    </Card>
  )
}
