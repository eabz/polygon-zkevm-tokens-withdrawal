'use client'

import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input'
import { Box, Center, Heading, Text, VStack } from '@chakra-ui/layout'
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/modal'
import { useState } from 'react'

import { UnknownIcon } from '@/assets'
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
  const [value, setValue] = useState(parseFloat(balance))

  const handleOnChange = (amount: string) => {
    if (amount === '') {
      setValue(0)
    }
    setValue(parseFloat(amount))
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
                </VStack>
              </Center>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
