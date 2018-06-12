import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import Errors from '../components/Errors';
import WalletNav from '../components/wallet/WalletNav';
import Information from '../components/wallet/Information';
import TransferForm from '../components/wallet/TransferForm';
import TransferModal from '../components/wallet/TransferModal';
import * as WalletActions from '../actions/walletActions.js'

class WalletPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Information',
      transfer_modal_visible: false,
      amount: null,
      to: null
     };
  }

  componentDidMount() {
    this.props.getBalances(this.props.user.eth_address)
  }

  onTabChange = (tab) => {
    this.setState({activeTab: tab});
  }

  openTransferModal = (values) => {
    this.setState({
      transfer_modal_visible: true,
      amount: values.amount,
      to: values.to
    });
  }

  cancelClick = () => {
    this.setState({transfer_modal_visible: false});
  }

  okClick = () => {
    this.props.transferTokens(this.state.to, this.state.amount);
  }



  render() {

    return (
      <div>
        <div>
          <h1>Wallet</h1>
          <Errors errors={this.props.user.errors} />
          <div className="centered">
            <WalletNav activeTab={this.state.activeTab} onTabChange={this.onTabChange}/>
          </div>
          <div className="centered">
            {this.state.activeTab == 'Information' && (
              <Information
                eth_address={this.props.user.eth_address}
                balance={this.props.wallet.balance}
                tokenBalance={this.props.wallet.tokenBalance}
              />
            )}
            {this.state.activeTab == 'Transfer' && (
              <div>
                <TransferForm onSubmit={this.openTransferModal} {...this.props}/>
                <TransferModal visible={this.state.transfer_modal_visible } amount={this.state.amount} okClick={this.okClick} cancelClick={this.cancelClick} />
              </div>
            )}
            {this.state.activeTab == 'Deposit' && (
              <div id="#Deposit">
                <p>Not yet implemented</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    wallet: state.wallet
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getBalances: (address) => {
      dispatch(WalletActions.getBalances(address));
    },
    transferTokens: (to, amount) => {
      dispatch(WalletActions.transferTokens(to, amount));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WalletPage);
