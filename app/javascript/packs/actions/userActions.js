import axios from 'axios';

export const UserActions = {
    SET_ATTRIBUTE: "USER_SET_ATTRIBUTE"
}

const setErrors = (errors)  => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

const setSignUpInProgress = (value) => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'signUpInProgress', value: value }
}

const setSignUpCompleted = (value) => {
    return { type: UserActions.SET_ATTRIBUTE, key: 'signUpInCompleted', value: value }
}

const setCurrentUser = (value) => {
    window.app_config.current_user = value; // TODO: do something here
    return { type: UserActions.SET_ATTRIBUTE, key: 'currentUser', value: value }
}


export const signUpUser = (payload) => (dispatch) => {
    dispatch( setSignUpInProgress(true) );
    var token = $( 'meta[name="csrf-token"]' ).attr( 'content' );
    axios.post('/users', payload, { headers: {'X-CSRF-Token': token} } )
        .then( (response) => {
            if( response.data.errors !== undefined ) {
                dispatch( setErrors(response.data.errors) );
                dispatch( setSignUpInProgress(false) );
            } else {
                dispatch( setSignUpCompleted(true) );
                dispatch( setSignUpInProgress(false) );
                dispatch( setCurrentUser(response.data.current_user) );
            }
        })
        .catch( (error) => {
            alert(`An error has occured ${error}`);
        });
}
