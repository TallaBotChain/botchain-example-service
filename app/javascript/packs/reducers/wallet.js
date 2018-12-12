import { WalletActions } from '../actions/walletActions.js'

import update from 'immutability-helper';

const initialState = {
  inProgress: false,
  error: null,
  balance: 0,
  tokenBalance: 0,
  transferTxMined: false,
  usdExchangeRate: 0,
  transferTxEstGas: 0,
  registrationFee: 0,
  botRegistrationFee: 0,
  approveFee: 0,
  addDeveloperFee: 0,
  createRegistrationVoteFee: 0.000724628,
  createBotProductFee: 0.001276824,
  hasPendingTx: false,
  currency: "BOTC"
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
