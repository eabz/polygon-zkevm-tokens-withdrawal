import { ethers } from 'ethers'
import * as ffjavascript from 'ffjavascript'
import { Hex } from 'viem'

function toHexStringRlp(num: string | number | ethers.BigNumber | undefined) {
  let numHex
  if (typeof num === 'number' || typeof num === 'bigint' || typeof num === 'object') {
    numHex = ffjavascript.Scalar.toString(ffjavascript.Scalar.e(num), 16)
    // if it's an integer and it's value is 0, the standard is set to 0x, instead of 0x00 ( because says that always is codified in the shortest way)
    if (ffjavascript.Scalar.e(num) === ffjavascript.Scalar.e(0)) return '0x'
  } else if (typeof num === 'string') {
    numHex = num.startsWith('0x') ? num.slice(2) : num
  }
  numHex = numHex.length % 2 === 1 ? `0x0${numHex}` : `0x${numHex}`

  return numHex
}

function addressToHexStringRlp(address: string) {
  // empty address: deployment
  if (typeof address === 'undefined' || (typeof address === 'string' && address === '0x')) {
    return '0x'
  }

  let addressScalar: any
  if (typeof address === 'number' || typeof address === 'bigint' || typeof address === 'object') {
    addressScalar = ffjavascript.Scalar.e(address)
  } else if (typeof address === 'string') {
    const tmpAddr = address.startsWith('0x') ? address : `0x${address}`
    addressScalar = ffjavascript.Scalar.fromString(tmpAddr, 16)
  }

  return `0x${ffjavascript.Scalar.toString(addressScalar, 16).padStart(40, '0')}`
}

export function rawTxToCustomRawTx(rawTx: Hex) {
  const tx = ethers.utils.parseTransaction(rawTx)

  if (!tx.r || !tx.s || !tx.v) return

  const value = tx.value || 0

  const signData = ethers.utils.RLP.encode([
    toHexStringRlp(tx.nonce),
    toHexStringRlp(tx.gasPrice),
    toHexStringRlp(tx.gasLimit),
    addressToHexStringRlp(tx.to || '0x'),
    toHexStringRlp(value),
    toHexStringRlp(tx.data),
    toHexStringRlp(tx.chainId),
    '0x',
    '0x',
  ])
  const r = tx.r.slice(2)
  const s = tx.s.slice(2)
  const v = (tx.v - tx.chainId * 2 - 35 + 27).toString(16).padStart(2, '0') // 1 byte

  return signData.concat(r).concat(s).concat(v)
}
