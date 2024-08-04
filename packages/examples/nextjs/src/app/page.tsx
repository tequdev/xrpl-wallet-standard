'use client'

import { XRPL_MAINNET } from '@xrpl-wallet-standard/app'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignAndSubmitTransaction,
  useSignTransaction,
  useWallet,
  useWallets,
} from '@xrpl-wallet-standard/react'

export default function Home() {
  const wallets = useWallets()
  const { wallet: selectedWallet } = useWallet()
  const account = useAccount()
  const { connect, status } = useConnect()
  const disconnect = useDisconnect()
  const signTransaction = useSignTransaction()
  const signAndSubmitTransaction = useSignAndSubmitTransaction()

  console.log(status)

  const handleSignTransaction = async () => {
    if (selectedWallet && account) {
      const signedTransaction = await signTransaction(
        {
          TransactionType: 'Invoke',
          Account: account.address,
          NetworkID: 21338,
        },
        XRPL_MAINNET,
      )
      console.log(signedTransaction)
    }
  }

  const handleSignAndSubmitTransaction = async () => {
    const signedTransaction = await signAndSubmitTransaction(
      {
        TransactionType: 'AccountSet',
        Account: account.address,
      },
      XRPL_MAINNET,
    )
    console.log(signedTransaction)
  }

  return (
    <>
      <h1 className="text-4xl">Wallet</h1>
      <div className="flex flex-col p-8">
        {wallets.map((wallet) => (
          <div key={wallet.name} className="w-56 my-1.5">
            <button
              type="button"
              className="w-full hover:bg-blue-400 text-blue-800 hover:text-gray-100 border border-blue-400 font-bold py-2 px-4 rounded inline-flex items-center"
              onClick={() => connect(wallet)}
            >
              <img src={wallet.icon} alt="" height={24} width={24} className="mr-2" />
              <span className="text-center">{wallet.name}</span>
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col p-8">
        {selectedWallet && (
          <div>
            <h2 className="text-center text-xl mb-1">{selectedWallet.name}</h2>
            {selectedWallet.accounts.map((account) => (
              <div key={account.address}>{account.address}</div>
            ))}
          </div>
        )}
        {selectedWallet && account && (
          <>
            <button
              type="button"
              className="mb-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => handleSignTransaction()}
            >
              SignTransaction
            </button>
            <button
              type="button"
              className="mb-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => handleSignAndSubmitTransaction()}
            >
              SignAndSubmitTransaction
            </button>
            <button
              type="button"
              className="mb-1 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={() => disconnect()}
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </>
  )
}
