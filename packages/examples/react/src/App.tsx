import './App.css'

import {
  ConnectButton,
  useAccount,
  useConnectionStatus,
  useDisconnect,
  useSignAndSubmitTransaction,
} from '@xrpl-wallet-standard/react'

function App() {
  const account = useAccount()
  const status = useConnectionStatus()
  const disconnect = useDisconnect()
  const signAndSubmitTransaction = useSignAndSubmitTransaction()

  const handleSignAndSubmitTransaction = async () => {
    const submittedTransaction = await signAndSubmitTransaction(
      {
        TransactionType: 'AccountSet',
        Account: account.address,
      },
      'xrpl:1',
    )
    console.log(submittedTransaction)
  }

  return (
    <>
      <h1>Wallet Connect Example</h1>
      {account && <div>{String(account.address)}</div>}
      <ConnectButton />
      {status === 'connected' && (
        <div>
          <button type="button" onClick={() => handleSignAndSubmitTransaction()}>
            SignAndSubmitTransaction
          </button>
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        </div>
      )}
    </>
  )
}

export default App
