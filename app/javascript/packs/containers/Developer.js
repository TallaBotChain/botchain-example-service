import React, { Component } from 'react';
import {connect} from 'react-redux'
import { Redirect } from 'react-router-dom'
import DeveloperForm from '../components/developer/DeveloperForm';
import Errors from '../components/Errors';
import PaymentModal from '../components/shared/PaymentModal';
import TransactionModal from '../components/shared/TransactionModal';
import TxStatus from '../helpers/TxStatus'
import * as DeveloperActions from '../actions/developerActions';
import * as WalletActions from '../actions/walletActions.js'
import Success from '../components/developer/Success';

class DeveloperPage extends Component {

  constructor(props) {
    super(props);
    this.state = { show_payment_modal: false };
  }

  componentDidMount() {
    this.props.getBalances();
    this.props.fetchEntryPrice();
    this.props.fetchDeveloperId();
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps", nextProps);
    if( nextProps.developer.errors.length > 0 ) {
      console.log("hiding payment modal");
      this.setState({show_payment_modal: false});
    }
  }

  submit = (values) => {
    this.props.reset();
    this.setState({show_payment_modal: true, values: values});
  }

  hidePaymentModal = () => {
    this.setState({ show_payment_modal: false });
  }

  approveClick = () => {
    console.log("Starting approve request");
    this.props.addMetadata2IPFS(this.state.values);
    this.props.approvePayment();
  }

  continueClick = () => {
    console.log("Sending actual addDeveloper transaction");
    this.props.addDeveloper(this.props.developer.ipfsHash);
  }

  showPaymentModal(){
    return (this.state.show_payment_modal && (!this.props.developer.allowanceTxMined || this.props.developer.ipfsHash == null));
  }

  showTransactionModal() {
    return (this.state.show_payment_modal && 
            this.props.developer.allowanceTxMined && 
            (!this.props.developer.addDeveloperTxMined) && 
            (this.props.developer.ipfsHash != null)
    );
  }

  render() {

    return (
      <div className="white-container">
        <div className='inner-container registration'>
          <Success visible={this.props.developer.successfullyAdded || (this.props.developer.developerId > 0)} />
          <div className={(this.props.developer.successfullyAdded || (this.props.developer.developerId > 0)) ? 'hidden' : '' } >
            <h1 className='green-text'>Register</h1>
            <p className="botcoin-green">
              <strong>Botchain Developer</strong>
            </p>
            <p className='alert-info'>Note : You have to be pre-approved to successfully complete the registration. Please <a href="https://botchain.talla.com/developers">click here</a> to request approval. Read more about the Developer Registration Process <a href="/faq#developer_registration" target="_blank">here.</a></p>
            <Errors errors={this.props.developer.errors} />
            <DeveloperForm onSubmit={this.submit} />
            <PaymentModal 
              balance={this.props.wallet.balance} 
              token_balance={this.props.wallet.tokenBalance} 
              tx_id={this.props.developer.allowanceTxId} 
              show={this.showPaymentModal()}
              approveClick={this.approveClick} 
              entryPrice={this.props.developer.entryPrice} 
              handleClose={this.hidePaymentModal} 
            />
            <TransactionModal 
              tx_id={this.props.developer.addDeveloperTxId} 
              show={this.showTransactionModal()}
              continueClick={this.continueClick} 
              handleClose={this.hidePaymentModal}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    developer: state.developer,
    transactions: state.txObserver.transactions,
    wallet: state.wallet,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reset: () => {
      dispatch( DeveloperActions.resetTxs() );
    },
    getBalances: () => {
      dispatch(WalletActions.getBalances());
    },
    fetchEntryPrice: () => {
      dispatch( DeveloperActions.fetchEntryPrice() );
    },
    fetchDeveloperId: () => {
      dispatch( DeveloperActions.fetchDeveloperId() );
    },
    approvePayment: () => {
      dispatch( DeveloperActions.approvePayment() );
    },
    addMetadata2IPFS: (metadata) => {
      dispatch(DeveloperActions.addMetadata2IPFS(metadata));
    },
    addDeveloper: (url, metadata) => {
      dispatch( DeveloperActions.addDeveloper(url, metadata) );
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(DeveloperPage);
