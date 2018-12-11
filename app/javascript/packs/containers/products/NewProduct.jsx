import React, { Component } from 'react';
import {connect} from 'react-redux'
import ProductForm from '../../components/products/ProductForm';
import ProductRegistrationModal from '../../components/products/ProductRegistrationModal';
import * as ProductsActions from '../../actions/productsActions';


class NewProduct extends Component {

  constructor(props) {
    super(props);
    this.state = { showRegistrationModal: false, metadata: null };
    this.clickRegister = this.clickRegister.bind(this);
    this.closeRegistrationModal = this.closeRegistrationModal.bind(this);
    this.clickSubmitRegistration = this.clickSubmitRegistration.bind(this);
  }

  componentDidMount() {
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

  formSubmitDisabled() {
    return (this.props.wallet.botRegistrationFee == 0 ||
      this.props.wallet.botRegistrationFee > this.props.wallet.balance ||
      this.props.products.entryPrice > this.props.wallet.tokenBalance
    );
  }

  render() {
    return (
      <div className="white-container">
        <div className='inner-container ai-products'>
          <h1 className='green-text'>Register</h1>
          <p className="botcoin-green">
            <strong>Botchain AI Product</strong>
          </p>
          <ProductForm onSubmit={this.clickRegister} inProgress={this.props.products.inProgress} submitDisabled={this.formSubmitDisabled()} />
        </div>
        <ProductRegistrationModal 
          show={this.state.showRegistrationModal}
          submitRegistrationClick={() => this.clickSubmitRegistration}
          handleClose={() => this.closeRegistrationModal}
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
    wallet: state.wallet
  }
}

const mapDispatchToProps = dispatch => {
  return {
    reset: () => {
      dispatch(ProductsActions.resetTxs());
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
