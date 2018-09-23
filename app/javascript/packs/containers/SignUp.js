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
          <div className="white-container">
            <div className='welcome'>
              <h1>Botchain Developer Registration</h1>
              <h2>BotChain is the decentralized identity and audit ledger for autonomous AI agents. <a href="">Learn more</a></h2>
            </div>
            <div className='inner-container sign-up'>
              <h1 className='green-text'>Sign up</h1>
              <p className="botcoin-green">
                <strong>Botchain Developer Account</strong>
              </p>
              <Errors errors={this.props.user.errors} />
              <SignUpForm onSubmit={this.submit} {...this.props} />
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
            dispatch( UserActions.signUpUser(payload) );
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(SignUpPage);
