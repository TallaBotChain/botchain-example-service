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
    let new_state = { ...initialState, ...{ authChecked: state.authChecked } }
    return update(state, { $set: new_state });
  case UserActions.SET_ATTRIBUTE:
    return update(state, {[action.key]: {$set: action.value}});
  default:
    return state
  }
}

export default user;
