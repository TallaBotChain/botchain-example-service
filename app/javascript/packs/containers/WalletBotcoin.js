import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import Errors from '../components/Errors';
import WalletNavigation from '../components/wallet/WalletNavigation';
import WalletNav from '../components/wallet/WalletNav';
import ReceiveModal from '../components/wallet/ReceiveModal';
import SendModal from '../components/wallet/SendModal';
import Information from '../components/wallet/Information';
import TransferForm from '../components/wallet/TransferForm';
import TransferModal from '../components/wallet/TransferModal';
import Deposit from '../components/wallet/Deposit';
import * as WalletActions from '../actions/walletActions.js'

class WalletBotcoinPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'Information',
      transfer_modal_visible: false,
      show_receive_modal: false,
      show_send_modal: false,
      amount: null,
      to: null
    };
  }

  componentDidMount() {
    this.props.getBalances()
  }

  onTabChange = (tab) => {
    this.setState({activeTab: tab});
  }

  openTransferModal = (values) => {
    this.props.resetTransferState()
    this.setState({
      transfer_modal_visible: true,
      amount: values.amount,
      to: values.to
    });
  }

  cancelClick = () => {
    this.setState({transfer_modal_visible: false});
    this.setState({show_receive_modal: false});
  }

  okClick = () => {
    this.props.transferTokens(this.state.to, this.state.amount);
  }

  canTransfer = () => {
    return parseFloat(this.props.wallet.balance) > 0 && parseFloat(this.props.wallet.tokenBalance) > 0
  }

  showReceiveModal = () => {
    this.setState({ show_receive_modal: true });
  }

  hideReceiveModal = () => {
    this.setState({ show_receive_modal: false });
  }

  showSendModal = () => {
    this.setState({ show_send_modal: true });
  }

  hideSendModal = () => {
    this.setState({ show_send_modal: false });
  }

  render() {

    return (
      <div className="white-container">
        <WalletNavigation />
        <div className='inner-container registration'>
          <h1>Botcoin Balance</h1>
          <Errors errors={this.props.user.errors} />
          <div className="balance">
            <h1 className="botcoin">
              {this.props.wallet.tokenBalance}<span>BOTC</span>
            </h1>
          </div>
          <div className="buttons">

              <Button onClick={this.showSendModal} bsClass="btn orange-button small-button width-100" disabled={!this.canTransfer()}>SEND</Button>

            <Button onClick={this.showReceiveModal} bsClass="btn default-button small-button width-100">Receive</Button>
          </div>
          <h5 className="gray text-left">TRANSACTION HISTORY</h5>

          <div className="centered">
            <WalletNav activeTab={this.state.activeTab} onTabChange={this.onTabChange}/>
          </div>
          <div className="centered">
            {this.state.activeTab == 'Transfer' && (
              <div>
                {this.props.wallet.transferSuccess && (
                  <p className='alert-info'>Transfer was successfully completed!!</p>
                )}
                {this.canTransfer() ? (
                  <div>
                    <TransferForm onSubmit={this.openTransferModal} {...this.props}/>
                    <TransferModal tx_id={this.props.wallet.transferTxId} visible={this.state.transfer_modal_visible && !this.props.wallet.transferTxMined} amount={this.state.amount} okClick={this.okClick} cancelClick={this.cancelClick} />
                  </div>
                ) : (
                  <p className='alert-info'>Not enough funds for transfer!</p>
                )}
              </div>
            )}
          </div>

        </div>
        <ReceiveModal show={this.state.show_receive_modal} handleClose={this.hideReceiveModal} address={this.props.user.ethAddress} currency="botcoin" />
        <SendModal show={this.state.show_send_modal} handleClose={this.hideSendModal} {...this.props} currency="BOTC" />
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
    resetTransferState: () => {
      dispatch( WalletActions.resetTransferState() );
    },
    getBalances: () => {
      dispatch(WalletActions.getBalances());
    },
    transferTokens: (to, amount) => {
      dispatch(WalletActions.transferTokens(to, amount));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WalletBotcoinPage);
