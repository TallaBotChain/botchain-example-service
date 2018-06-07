import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import PasswordForm from '../components/settings/PasswordForm';

class SettingsPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {

    return (
      <div>
        <div>
          <h1>Settings</h1>
          <div className="centered">
            <h3 >1. Change Password</h3>
            <PasswordForm />
          </div>
          <div className="centered">
            <h3>2. Email Verification</h3>
            <p>Email has been verified</p>
          </div>
          <div className="centered">
            <h3>Backup</h3>
            <p>If you forget your password and you do not have your mnemonic then your funds are lost forever. But if you have your mnemonic, your funds can be recovered. Be sure to write down your mnemonic.</p>
            <button className='primary' type="button">View Mnemonic</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    developer: state.developer,
    transactions: state.txObserver.transactions
  }
}

const mapDispatchToProps = dispatch => {
  return {

  }
}

export default connect(mapStateToProps,mapDispatchToProps)(SettingsPage);
