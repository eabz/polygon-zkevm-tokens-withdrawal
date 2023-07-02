'use client'

import { useCallback } from 'react'
import { useNetwork, useSignTypedData } from 'wagmi'

export interface IPermit {
  tokenAddress: string
  owner: string
  spender: string
  value: string
  nonce: number
}

const permitTypes: any = {
  Permit: [
    {
      name: 'owner',
      type: 'address',
    },
    {
      name: 'spender',
      type: 'address',
    },
    {
      name: 'value',
      type: 'uint256',
    },
    {
      name: 'nonce',
      type: 'uint256',
    },
    {
      name: 'deadline',
      type: 'uint256',
    },
  ],
}

export const usePermit = (): { permit: (data: IPermit) => Promise<string> } => {
  const { chain } = useNetwork()

  const signatureMessage: any = ({
    nonce,
    owner,
    spender,
    value,
  }: {
    nonce: string
    owner: string
    spender: string
    value: string
  }) => ({
    deadline: Math.floor(Date.now() / 1000) + 100,
    nonce,
    owner,
    spender,
    value,
  })

  const { signTypedDataAsync } = useSignTypedData()

  const permit = useCallback(
    async ({ tokenAddress, nonce, owner, spender, value }: IPermit) => {
      const domain: any = {
        chainId: chain?.id,
        name: 'Token Approval',
        verifyingContract: tokenAddress,
        version: '1.0',
      }

      const primaryType: any = 'Permit'

      const message = signatureMessage({ nonce, owner, spender, value })

      const permit = await signTypedDataAsync({ domain, message, primaryType, types: permitTypes })

      return permit
    },
    [chain?.id, signTypedDataAsync],
  )

  return { permit }
}
