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
import {round} from '../utils/Rounder'
import KeyTools from '../blockchain/KeyTools'

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
    this.props.transferEstGas(KeyTools.address, "0")
  }

  hideSendModal = () => {
    this.setState({ show_send_modal: false });
  }

  render() {

    return (
      <div className="white-container">
        <WalletNavigation />
      <div className='inner-container wallet'>
          <h1>Botcoin Balance</h1>
          <Errors errors={this.props.user.errors} />
          <Row>
            <Col xs={5} sm={3} lg={2} className="balance">
              <h1 className="botcoin">
                {round(this.props.wallet.tokenBalance)}<span>BOTC</span>
              </h1>
            </Col>
            <Col xs={7} sm={9} lg={10} className="buttons">
              <Button onClick={this.showSendModal} bsClass="btn orange-button cta-button width-100 pull-left" disabled={!this.canTransfer() || this.props.wallet.hasPendingTx}>
                {this.props.wallet.hasPendingTx ? "IN PROGRESS" : "SEND"}
              </Button>
              <Button onClick={this.showReceiveModal} bsClass="btn default-button cta-button width-100 pull-left">Receive</Button>
            </Col>
          </Row>

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
    },
    transferEstGas: (to, amount) => {
      dispatch(WalletActions.transferEstGas(to, amount));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(WalletBotcoinPage);
