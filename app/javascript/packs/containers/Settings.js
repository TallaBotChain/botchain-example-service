import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import Errors from '../components/Errors';
import PasswordForm from '../components/settings/PasswordForm';
import ViewMnemonicForm from '../components/settings/ViewMnemonicForm';
import * as UserActions from '../actions/userActions';

class SettingsPage extends Component {

  constructor(props) {
    super(props);
    this.state = { view_mnemonic: false };
  }

  updatePassword = (values) => {
    console.log("Change password payload: ", values);
    this.props.updatePassword(values.current_password, values.password, values.password_confirmation);
  }

  decryptMnemonic = (values) => {
    console.log("View Mnemonic: ", values);
    this.props.decryptMnemonic(values.password);
  }

  toggleMnemonicForm = () => {
    this.setState({view_mnemonic: !this.state.view_mnemonic});
  }

  render() {

    return (
      <div>
        <div>
          <h1>Settings</h1>
          <Errors errors={this.props.user.errors} />
          <div className="centered">
            <h3>1. Change Password</h3>
            <PasswordForm onSubmit={this.updatePassword} {...this.props}/>
          </div>
          <div className="centered">
            <h3>2. Backup</h3>
            <p>If you forget your password and you do not have your mnemonic then your funds are lost forever. But if you have your mnemonic, your funds can be recovered. Be sure to write down your mnemonic.</p>
            {this.state.view_mnemonic ? (
              <div>
                {this.props.user.mnemonic ? (
                  <p className='alert-info'>{this.props.user.mnemonic}</p>
                ) : (
                  <ViewMnemonicForm onSubmit={this.decryptMnemonic} {...this.props}/>
                )}
              </div>
            ) : (
              <button className='primary' type="button" onClick={this.toggleMnemonicForm}>View Mnemonic</button>
            )}
          </div>
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
    updatePassword: (current_password, password, password_confirmation) => {
      dispatch( UserActions.updatePassword(current_password, password, password_confirmation));
    },
    decryptMnemonic: (password) => {
      dispatch( UserActions.decryptMnemonic(password));
    },
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SettingsPage);
