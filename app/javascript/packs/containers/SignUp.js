import React, { Component } from 'react';
import {connect} from 'react-redux'
import SignUpForm from '../components/sign_up/SignUpForm'
import Errors from '../components/Errors';
import * as UserActions from '../actions/userActions';
import { Redirect } from 'react-router-dom'

class SignUpPage extends Component {
    constructor(props) {
        super(props);
    }

  submit = (values) => {
      console.log("Sign up payload: ", values);
      this.props.sendRequest(values);
  }

    render() {
        return this.props.user.signedIn ? <Redirect to='/' /> :  (
            <div class='sign-up'>
                <h1>Sign up</h1>
                <Errors errors={this.props.user.errors} />
                <SignUpForm onSubmit={this.submit} {...this.props} />
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendRequest: (payload) => {
            dispatch( UserActions.signUpUser(payload) );
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpPage);
