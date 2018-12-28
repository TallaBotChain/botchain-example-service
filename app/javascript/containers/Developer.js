import React, { Component } from 'react';
import {connect} from 'react-redux'
import DeveloperForm from '../components/developer/DeveloperForm';
import RefundWallet from '../components/wallet/RefundWallet';
import Errors from '../components/Errors';
import PaymentModal from '../components/shared/PaymentModal';
import TransactionModal from '../components/shared/TransactionModal';
import SubmitRegistrationModal from '../components/shared/SubmitRegistrationModal'
import * as DeveloperActions from '../actions/developerActions';
import * as WalletActions from '../actions/walletActions.js'
import RegistrationStatus from '../components/developer/RegistrationStatus';
import Loader from '../components/Loader';
class DeveloperPage extends Component {

  constructor(props) {
    super(props);
    this.state = { show_payment_modal: false };
    this.registerAiProduct = this.registerAiProduct.bind(this);
  }

  componentDidMount() {
    this.props.reset();
    this.props.getBalances();
    this.props.fetchEntryPrice();
    this.props.fetchDeveloperId();
  }

  componentWillReceiveProps(nextProps) {
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

  registerAiProduct(){
    this.props.history.push('/products/new');
  }

  isNeedRefund() {
    return (this.props.wallet.registrationFee > this.props.wallet.balance ||
            this.props.developer.entryPrice > this.props.wallet.tokenBalance)
  }

  isDeveloperRegistered(){
    return (this.props.developer.successfullyAdded || (this.props.developer.developerId > 0))
  }

  isWalletDataFetching() {
    return (this.props.wallet.inProgress == true ||
            this.props.developer.entryPrice == null ||
            this.props.wallet.registrationFee == 0)
  }

  isRegistrationChecking(){
    return  ( this.props.developer.registrationStatus == 'not_approved' && 
              !this.props.developer.successfullyAdded &&
            ( this.props.developer.voteFinalBlock == null || this.props.developer.currentBlock == null ) )
  }

  activeRegistrationTab(){
    if (this.isDeveloperRegistered()) return 3
    return (this.isNeedRefund() ? 1 : 2)
  }

  renderRegistrationTabs(){
    if (this.isRegistrationChecking() || (!this.isDeveloperRegistered() && this.isWalletDataFetching())) return null
    return(
      <div className='registration-steps'>
        <span className={`registration-step ${this.activeRegistrationTab() == 1 ? 'active' : ''}`}>1. Fund Wallet</span>
        <span className={`registration-step ${this.activeRegistrationTab() == 2 ? 'active' : ''}`}>2. Registration</span>
        <span className={`registration-step ${this.activeRegistrationTab() == 3 ? 'active' : ''}`}>3. Submission</span>
      </div>
    )
  }

  renderRegistrationForm(){
    return(
      <div>
        <h1 className='green-text'>Register</h1>
        <p className="botcoin-green">
          <strong>Botchain Developer</strong>
        </p>
        <Errors errors={this.props.developer.errors} />
        <DeveloperForm onSubmit={this.submit} submitDisabled={this.formSubmitDisabled()} ipfsInProgress={this.props.developer.ipfsInProgress} />
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
    )
  }

  renderChecking(message) {
    return (
      <div className="white-container">
        <div className='inner-container registration'>
          <Loader visible={true} message={message} />
        </div>
      </div>
    )
  }

  render() {
    if (this.isRegistrationChecking()) return this.renderChecking('Checking registration status');
    if (!this.isDeveloperRegistered() && this.isWalletDataFetching()) return this.renderChecking('Checking balance');
    return (
      <div className="white-container">
        {this.renderRegistrationTabs()}
        <div className='inner-container registration'>
          {this.activeRegistrationTab() == 1 && 
            <RefundWallet 
              registrationFee={this.props.wallet.registrationFee}
              balance={this.props.wallet.balance}
              entryPrice={this.props.developer.entryPrice}
              tokenBalance={this.props.wallet.tokenBalance}
              getBalance={this.props.getBalances}
              address={this.props.user.ethAddress}
            />
          }
          {this.activeRegistrationTab() == 2 && 
            this.renderRegistrationForm()
          }
          {this.activeRegistrationTab() == 3 && 
            <RegistrationStatus developer={this.props.developer} registerAiProduct={() => this.registerAiProduct} />
          }
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
