import React, { Component } from 'react';
import { Row, Col, Well, Button } from 'react-bootstrap'
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import Errors from '../components/Errors';
import WalletNavigation from '../components/wallet/WalletNavigation';
import WalletNav from '../components/wallet/WalletNav';
import ReceiveModal from '../components/wallet/ReceiveModal';
import Information from '../components/wallet/Information';
import TransferForm from '../components/wallet/TransferForm';
import TransferModal from '../components/wallet/TransferModal';
import Deposit from '../components/wallet/Deposit';
import * as WalletActions from '../actions/walletActions.js'
import {round} from '../utils/Rounder'

class WalletEthereumPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transfer_modal_visible: false,
      amount: null,
      to: null
    };
  }

  componentDidMount() {
    this.props.getBalances()
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

  render() {

    return (
      <div className="white-container">
        <WalletNavigation />
        <div className='inner-container wallet'>
          <h1>Ethereum Balance</h1>
          <Errors errors={this.props.user.errors} />
          <Row>
            <Col xs={5} sm={3} lg={2} className="balance">
              <h1 className="ethereum">
                {round(this.props.wallet.balance)}<span>ETH</span>
              </h1>
              <strong className="dollar-balance gray">
                <span>$</span>{round(this.props.wallet.balance * this.props.wallet.usdExchangeRate)}
              </strong>
            </Col>
            <Col xs={7} sm={9} lg={10} className="buttons">
              <Button bsClass="btn orange-button cta-button width-100 pull-left" disabled>SEND</Button>
              <Button onClick={this.showReceiveModal} bsClass="btn default-button cta-button width-100">Receive</Button>
            </Col>
          </Row>
          <h5 className="gray text-left">TRANSACTION HISTORY</h5>
        </div>
        <ReceiveModal show={this.state.show_receive_modal} handleClose={this.hideReceiveModal} address={this.props.user.ethAddress} currency="ethereum" />
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

export default connect(mapStateToProps,mapDispatchToProps)(WalletEthereumPage);
