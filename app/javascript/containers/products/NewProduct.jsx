import React, { Component } from 'react';
import {connect} from 'react-redux'
import ProductForm from '../../components/products/ProductForm';
import ProductRegistrationModal from '../../components/products/ProductRegistrationModal';
import RefundWallet from '../../components/products/RefundWallet';
import * as ProductsActions from '../../actions/productsActions';
import * as WalletActions from '../../actions/walletActions';
import Loader from '../../components/Loader'

class NewProduct extends Component {

  constructor(props) {
    super(props);
    this.state = { showRegistrationModal: false, metadata: null };
    this.clickRegister = this.clickRegister.bind(this);
    this.closeRegistrationModal = this.closeRegistrationModal.bind(this);
    this.clickSubmitRegistration = this.clickSubmitRegistration.bind(this);
    this.clickFinishButton = this.clickFinishButton.bind(this);
  }

  componentDidMount() {
    this.props.getBalances();
    if (this.props.products.entryPrice == null) this.props.fetchEntryPrice();
    if (this.props.products.entryPrice !== null) this.props.fetchBotRegistrationProcessEstGas();
  }

  componentDidUpdate(prevProps) {
    if (this.props.products.entryPrice !== prevProps.products.entryPrice && prevProps.products.entryPrice == null) {
      this.props.fetchBotRegistrationProcessEstGas();
    }
  }

  clickRegister(values){
    let metadata = { ...values }
    this.setState({ showRegistrationModal: true, metadata: metadata})
  }

  clickSubmitRegistration(){
    this.props.addAiProduct(this.state.metadata);
  }

  closeRegistrationModal(){
    this.setState({ showRegistrationModal: false })
    this.props.reset()
  }

  clickFinishButton(){
    this.props.reset()
    this.props.history.push('/products');
  }

  isNeedRefund(){
    return (this.props.wallet.botRegistrationFee > this.props.wallet.balance ||
            this.props.products.entryPrice > this.props.wallet.tokenBalance)
  }

  isWalletDataFetching(){
    return (this.props.wallet.inProgress == true || 
            this.props.products.entryPrice == null || 
            this.props.wallet.botRegistrationFee == 0)
  }

  formSubmitDisabled() {
    return (this.props.wallet.botRegistrationFee == 0 ||
      this.props.wallet.botRegistrationFee > this.props.wallet.balance ||
      this.props.products.entryPrice > this.props.wallet.tokenBalance
    );
  }

  renderCheckingBalance(){
    return(
      <div className="white-container">
        <div className='inner-container ai-products'>
          <Loader visible={true} message="Checking balance" />
        </div>
      </div>
    )
  }

  render() {
    if (this.isWalletDataFetching()) return this.renderCheckingBalance()
    return (
      <div className="white-container">
        <div className='registration-steps'>
          <span className={`registration-step ${this.isNeedRefund() ? 'active': ''}`}>1. Fund Wallet</span>
          <span className={`registration-step ${!this.isNeedRefund() ? 'active' : ''}`}>2. Registration</span>
        </div>
        {this.isNeedRefund() && 
          <RefundWallet 
            wallet={this.props.wallet} 
            products={this.props.products} 
            getBalance={this.props.getBalances}
            address={this.props.user.ethAddress}
          />
        }
        {!this.isNeedRefund() &&
          <div className='inner-container ai-products'>
            <p className="botcoin-green">
              <strong>REGISTER</strong>
            </p>
            <p className="botcoin-green">
              <strong>Botchain AI Product</strong>
            </p>
            <ProductForm onSubmit={this.clickRegister} inProgress={this.props.products.inProgress} submitDisabled={this.formSubmitDisabled()} />
          </div>
        }
        <ProductRegistrationModal 
          show={this.state.showRegistrationModal}
          submitRegistrationClick={() => this.clickSubmitRegistration}
          handleClose={() => this.closeRegistrationModal}
          clickFinish={() => this.clickFinishButton}
          products={this.props.products}
          wallet={this.props.wallet}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    products: state.products,
    wallet: state.wallet,
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reset: () => {
      dispatch(ProductsActions.resetTxs());
    },
    getBalances: () => {
      dispatch(WalletActions.getBalances());
    },
    fetchEntryPrice: () => {
      dispatch(ProductsActions.fetchEntryPrice());
    },
    addAiProduct: (values) => {
      dispatch(ProductsActions.addAiProduct(values));
    },
    fetchBotRegistrationProcessEstGas: () => {
      dispatch(ProductsActions.fetchBotRegistrationProcessEstGas());
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(NewProduct);
