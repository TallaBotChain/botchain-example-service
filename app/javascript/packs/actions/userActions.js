import {reset} from 'redux-form';

export const UserActions = {
  SET_ATTRIBUTE: 'USER_SET_ATTRIBUTE'
}

/** setErrors
 * @param errors - array of errors
 **/
const setErrors = (errors)  => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

/** setErrors
 * @param alerts - array of alerts
 **/
const setAlerts = (alerts) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'alerts', value: alerts }
}

/** Sets in progress flag used to display in progress message or animation
 * @param value - boolean value, true if request is in progress
 **/
const setInProgress = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'inProgress', value: value }
}

/** Sets user signedIn status
 * @param value - boolean value, true if user is signed in
 **/
const setSignedIn = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'signedIn', value: value }
}

/** Sets user name
 * @param value - string with user name
 **/
const setCurrentUser = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'currentUser', value: value }
}

/** Sets encrypted mnemonic
 * @param value - string with encrypted mnemonic
 **/
const setEncryptedMnemonic = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'encryptedMnemonic', value: value }
}

/** Sets decrypted mnemonic
 * @param value - string with decrypted mnemonic
 **/
const setMnemonic = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'mnemonic', value: value }
}

/** Sets user address in Ethereum network
 * @param value - string with Ethereum address
 **/
const setEthAddress = (value) => {
  return { type: UserActions.SET_ATTRIBUTE, key: 'ethAddress', value: value }
}

/** SignUp user process
 * @param payload - JS object with data from redux-form
 **/
export const signUpUser = (payload) => (dispatch) => {
  dispatch( setInProgress(true) );
  payload.encrypted_mnemonic = window.keyTools.generateEncryptedMnemonic(payload.password);
  payload.eth_address = window.keyTools.address;
  $.ajax('/users',{ method: 'POST',
    data: JSON.stringify(payload),
    contentType: 'application/json'})
    .done( (response) => {
      if( response.errors !== undefined ) {
        dispatch( setErrors(response.errors) );
        dispatch( setInProgress(false) );
      } else {
        dispatch( setErrors(null) );
        dispatch( setEncryptedMnemonic(payload.encrypted_mnemonic) );
        dispatch( setEthAddress(payload.eth_address) );
        dispatch( setCurrentUser(response.current_user) );
        dispatch( setSignedIn(true) );
        dispatch( setInProgress(false) );
      }
    })
    .fail( (error) => {
      console.log( 'error: ', error );
      dispatch(setErrors([`An error has occurred ${error}`]));
    });
}

/** SignIn user process
 * @param payload - JS object with data from redux-form
 **/
export const signInUser = (payload) => (dispatch) => {
  dispatch( setInProgress(true) );
  $.ajax('/session',{ method: 'POST',
    data: JSON.stringify(payload),
    contentType: 'application/json' })
    .done( (response) => {
      if( response.error !== undefined ) {
        dispatch( setErrors([response.error]) );
        dispatch( setInProgress(false) );
      } else {
        dispatch( setErrors(null) );
        dispatch( setEncryptedMnemonic(response.encrypted_mnemonic) );
        dispatch( setEthAddress(response.eth_address) );
        dispatch( setCurrentUser(response.current_user) );

        window.keyTools.applyEncryptedMnemonic(response.encrypted_mnemonic,
                                                payload.password);

        dispatch( setSignedIn(true) );
        dispatch( setInProgress(false) );
      }
    })
    .fail( (error) => {
      dispatch( setInProgress(false) );
      console.log( 'error: ', error );
      dispatch(setErrors([`An error has occurred ${error}`]));
    });
}

/** Update password
 * @param current_password - current password
 * @param password - new password
 * @param password_confirmation - new password confirmation
 **/
export const updatePassword = (current_password, password, password_confirmation) => (dispatch, getState) => {
  dispatch(setErrors([]));
  dispatch(setAlerts([]));
  let encryptedMnemonic = getState().user.encryptedMnemonic
  let decryptedMnemonic = window.keyTools.decryptMnemonic(encryptedMnemonic, current_password)
  if (!decryptedMnemonic) {
    return dispatch( setErrors(['Current Password is Invalid']) );
  }
  let newMnemonic = window.keyTools.encryptMnemonic(decryptedMnemonic, password)
  dispatch( setInProgress(true) );
  var token = $( 'meta[name="csrf-token"]' ).attr( 'content' );
  $.ajax('/users/me', { method: 'PUT',
    data: {
      current_password: current_password,
      password: password,
      password_confirmation: password_confirmation,
      encrypted_mnemonic: newMnemonic
    },
    headers: {'X-CSRF-Token': token}
  })
    .done( (response) => {
      if( response.errors !== undefined ) {
        dispatch( setErrors(response.errors) );
      } else {
        dispatch( setEncryptedMnemonic(response.encrypted_mnemonic) );
        window.keyTools.applyEncryptedMnemonic(response.encrypted_mnemonic,
                                                password);
        dispatch(reset('password'));
        dispatch(setAlerts(['Password was successfully changed!']));
      }
      dispatch( setInProgress(false) );
    })
    .fail( (error) => {
      dispatch( setInProgress(false) );
      console.log( 'error: ', error );
      dispatch(setErrors([`An error has occurred ${error}`]));
    });
}

/** Decrypt mnemonic
 * @param password - current password
 **/
export const decryptMnemonic = (password) => (dispatch, getState) => {
  let encryptedMnemonic = getState().user.encryptedMnemonic
  let decryptedMnemonic = window.keyTools.decryptMnemonic(encryptedMnemonic, password)
  if (decryptedMnemonic) {
    dispatch( setErrors([]) );
    dispatch(setMnemonic(decryptedMnemonic))
  }else {
    dispatch( setErrors(['password is invalid']) );
  }
}
