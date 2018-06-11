export const UserActions = {
    SET_ATTRIBUTE: "USER_SET_ATTRIBUTE"
}

const setErrors = (errors)  => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

const setInProgress = (value) => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'inProgress', value: value }
}

const setSignedIn = (value) => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'signedIn', value: value }
}

const setCurrentUser = (value) => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'currentUser', value: value }
}


export const signUpUser = (payload) => (dispatch) => {
    dispatch( setInProgress(true) );
    var token = $( 'meta[name="csrf-token"]' ).attr( 'content' );
    payload.encrypted_mnemonic = window.keyTools.generateEncryptedMnemonic(payload.password);
    payload.eth_address = window.keyTools.address;
    $.ajax('/users',{ method: 'POST',
        data: JSON.stringify(payload),
        contentType: "application/json",
        headers: {'X-CSRF-Token': token} })
        .done( (response) => {
            if( response.errors !== undefined ) {
                dispatch( setErrors(response.errors) );
                dispatch( setInProgress(false) );
            } else {
                dispatch( setCurrentUser(response.current_user) );
                dispatch( setSignedIn(true) );
                dispatch( setInProgress(false) );
            }
        })
        .fail( (error) => {
            console.log( "error: ", error );
            alert(`An error has occured ${error}`);
        });
}
