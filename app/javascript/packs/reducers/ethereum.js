import { EthereumActions } from '../actions/ethereumActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  balance: 0,
  transferTxEstGas: 0,
  currency: "ETH",
  usdExchangeRate: 0,
  hasPendingTx: false,
  transferTxId: null,
  transferTxMined: false,
  transferSuccess: false
}

const ethereum = (state = initialState, action) => {
  switch (action.type) {
  case EthereumActions.SET_ETHEREUM_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case EthereumActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default ethereum
