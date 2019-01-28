import { UserActions } from '../actions/userActions'

import update from 'immutability-helper';

const initialState = {
  currentUser: '',
  signedIn: false,
  inProgress: false,
  errors: [],
  alerts: [],
  encryptedMnemonic: null,
  ethAddress: null,
  authChecked: false
}

const user = (state = initialState, action) => {
  switch (action.type) {
  case UserActions.RESET_STATE:
    return update(state, { $set: initialState });
  case UserActions.SET_ATTRIBUTE:
    return update(state, {[action.key]: {$set: action.value}});
  default:
    return state
  }
}

export default user;
