import React, { Component } from 'react';
import {connect} from 'react-redux'
import DeveloperForm from '../components/developer/DeveloperForm';
import Errors from '../components/Errors';
import PaymentModal from '../components/shared/PaymentModal';
import TransactionModal from '../components/shared/TransactionModal';
import SubmitRegistrationModal from '../components/shared/SubmitRegistrationModal'
import * as DeveloperActions from '../actions/developerActions';
import * as WalletActions from '../actions/walletActions.js'
import Success from '../components/developer/Success';
import Loader from '../components/Loader';
class DeveloperPage extends Component {

  constructor(props) {
    super(props);
    this.state = { show_payment_modal: false };
  }

  componentDidMount() {
    this.props.reset();
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
    let metadata = { ...values }
    delete metadata.eth_address;
    let local = this;
    this.props.addMetadata2IPFS(metadata).then(function () { local.setState({show_payment_modal: true}) })
  }

  hidePaymentModal = () => {
    this.setState({ show_payment_modal: false });
  }

  approveClick = () => {
    console.log("Starting approve request");
    this.props.approvePayment();
  }

  continueClick = () => {
    console.log("Sending actual addDeveloper transaction");
    this.props.addDeveloper(this.props.developer.ipfsHash);
  }

  submitRegistrationClick = () => {
    console.log("Sending CurationCouncil createRegistrationVote transaction");
    this.props.createRegistrationVote();
  }

  showPaymentModal(){
    return (
      this.state.show_payment_modal && 
      !this.props.developer.allowanceTxMined &&
      this.props.developer.entryPrice != 0
    );
  }

  showTransactionModal() {
    return (
      this.state.show_payment_modal && 
      (this.props.developer.allowanceTxMined || this.props.developer.entryPrice == 0) && 
      !this.props.developer.addDeveloperTxMined
    );
  }

  showSubmitRegistrationModal() {
    return (
      this.state.show_payment_modal &&
      this.props.developer.addDeveloperTxMined &&
      !this.props.developer.registrationVoteTxMined
    );
  }

  formSubmitDisabled() {
    return (this.props.wallet.registrationFee == 0 ||
            this.props.wallet.registrationFee > this.props.wallet.balance ||
            this.props.developer.ipfsInProgress
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
            <Loader visible={this.props.wallet.registrationFee == 0} message="Checking balance"/>
            <Errors errors={this.props.developer.errors} />
            <DeveloperForm onSubmit={this.submit} submitDisabled={this.formSubmitDisabled()} ipfsInProgress={this.props.developer.ipfsInProgress}/>
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
              entryPrice={this.props.developer.entryPrice}
              txFee={this.props.wallet.addDeveloperFee}
          />
            <SubmitRegistrationModal
              tx_id={this.props.developer.registrationVoteTxId}
              show={this.showSubmitRegistrationModal()}
              submitRegistrationClick={this.submitRegistrationClick}
              handleClose={this.hidePaymentModal}
              entryPrice={this.props.developer.entryPrice}
              txFee={this.props.wallet.createRegistrationVoteFee}
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
      return(dispatch(DeveloperActions.addMetadata2IPFS(metadata)));
    },
    addDeveloper: (ipfsHash) => {
      dispatch(DeveloperActions.addDeveloper(ipfsHash) );
    },
    createRegistrationVote: () => {
      dispatch(DeveloperActions.createRegistrationVote());
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(DeveloperPage);
