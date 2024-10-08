import { blackA, gray } from '@radix-ui/colors'
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
  background-color: white;
  color: ${gray.gray11};
  border: 1px solid ${blackA.blackA7};
  &:hover {
    border: 1px solid ${blackA.blackA7};
    background-color: ${blackA.blackA1};
  }
  &:focus {
    outline: none;
  }
`

export const ConnectButton = () => {
  return <ConnectModal trigger={<DefaultConnectButton>Connect Wallet</DefaultConnectButton>} />
}
