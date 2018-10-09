import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import Errors from '../components/Errors';
import WalletNavigation from '../components/wallet/WalletNavigation';
import ReceiveModal from '../components/wallet/ReceiveModal';
import SendModal from '../components/wallet/SendModal';
import * as WalletActions from '../actions/walletActions.js'
import {round} from '../utils/Rounder'

class WalletBotcoinPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_receive_modal: false,
      show_send_modal: false,
      amount: null,
      to: null
    };
  }

  componentDidMount() {
    this.props.getBalances()
  }

  canTransfer = () => {
    return parseFloat(this.props.walletData.balance) > 0 && parseFloat(this.props.walletData.tokenBalance) > 0
  }

  showReceiveModal = () => {
    this.setState({ show_receive_modal: true });
  }

  hideReceiveModal = () => {
    this.setState({ show_receive_modal: false });
  }

  showSendModal = () => {
    this.setState({ show_send_modal: true });
    this.props.transferEstGas(window.keyTools.address, "0")
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
                {round(this.props.walletData.tokenBalance)}<span>BOTC</span>
              </h1>
            </Col>
            <Col xs={7} sm={9} lg={10} className="buttons">
              <Button onClick={this.showSendModal} bsClass="btn orange-button cta-button width-100 pull-left" disabled={!this.canTransfer() || this.props.walletData.hasPendingTx}>
                {this.props.walletData.hasPendingTx ? "IN PROGRESS" : "SEND"}
              </Button>
              <Button onClick={this.showReceiveModal} bsClass="btn default-button cta-button width-100 pull-left">Receive</Button>
            </Col>
          </Row>

          <h5 className="gray text-left">TRANSACTION HISTORY</h5>
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
    walletData: state.wallet
  }
}

const mapDispatchToProps = dispatch => {
  return {
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
