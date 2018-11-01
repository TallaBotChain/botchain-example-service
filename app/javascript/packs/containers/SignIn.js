import React, { Component } from 'react';
import {connect} from 'react-redux'
import SignInForm from '../components/sign_in/SignInForm'
import Errors from '../components/Errors';
import * as UserActions from '../actions/userActions';
import { Redirect } from 'react-router-dom'

class SignInPage extends Component {
    constructor(props) {
        super(props);
    }

  submit = (values) => {
      console.log("Sign in payload: ", values);
      this.props.sendRequest(values);
  }

    render() {
        return this.props.user.signedIn ? <Redirect to='/' /> :  (
          <div className="white-container">
            <div className='inner-container sign-in'>
              <h1 className='green-text'>Sign In</h1>
              <Errors errors={this.props.user.errors} />
              <SignInForm onSubmit={this.submit} {...this.props} />
            </div>
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
            dispatch( UserActions.signInUser(payload) );
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignInPage);
