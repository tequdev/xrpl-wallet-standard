import styled from 'styled-components'
import { ConnectModal } from './ConnectModal'

const DefaultConnectButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0 15px;
  font-size: 15px;
  line-height: 1;
  font-weight: 500;
  height: 35px;
  /* violet */
  background-color: white;
  color: var(--violet-11);
  box-shadow: 0 2px 10px var(--black-a7);
  &:hover {
    background-color: var(--violet-3);
  }
  &:focus {
    box-shadow: 0 0 0 2px var(--violet-7);
  }
`

export const ConnectButton = () => {
  return <ConnectModal trigger={<DefaultConnectButton>Connect Wallet</DefaultConnectButton>} />
}
