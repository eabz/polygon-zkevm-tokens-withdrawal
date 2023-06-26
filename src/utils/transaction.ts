import { Hex, toRlp, TransactionLegacy } from 'viem'

export function rawTxToCustomRawTx(tx: TransactionLegacy) {
  if (!tx.r || !tx.s || !tx.v || !tx.chainId || !tx.to) return

  const signData = toRlp([
    ('0x' + tx.nonce.toString(16)) as Hex,
    ('0x' + tx.gasPrice.toString(16)) as Hex,
    ('0x' + tx.gas.toString(16)) as Hex,
    tx.to as Hex,
    ('0x' + tx.value.toString(16)) as Hex,
    tx.input as Hex,
    ('0x' + tx.chainId.toString(16)) as Hex,
    '0x',
    '0x',
  ])

  const r = tx.r.slice(2)
  const s = tx.s.slice(2)
  const v = (parseInt(tx.v.toString()) - tx.chainId * 2 - 35 + 27).toString(16).padStart(2, '0')

  return signData.concat(r).concat(s).concat(v)
}
