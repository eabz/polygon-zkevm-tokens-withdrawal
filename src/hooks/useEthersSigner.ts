import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useMemo } from 'react'
import { useWalletClient, type WalletClient } from 'wagmi'

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    ensAddress: chain.contracts?.ensRegistry?.address,
    name: chain.name,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}

export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return useMemo(() => (walletClient ? walletClientToSigner(walletClient) : undefined), [walletClient])
}
