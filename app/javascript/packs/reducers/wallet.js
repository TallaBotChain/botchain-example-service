import { WalletActions } from '../actions/walletActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  balance: 0,
  tokenBalance: 0,
  transferTxId: null,
  transferTxMined: false,
  transferSuccess: false
}

const wallet = (state = initialState, action) => {
  switch (action.type) {
  case WalletActions.SET_WALLET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
  case WalletActions.RESET_STATE:
      return update(state, {$set: initialState});
  default:
    return state
  }
}

export default wallet
