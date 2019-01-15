import React, { Component } from 'react';
import {connect} from 'react-redux'
import ProductsList from '../../components/products/ProductsList';
import * as ProductsActions from '../../actions/productsActions';
import * as DeveloperActions from '../../actions/developerActions';
import Loader from '../../components/Loader';

class ProductsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.developer.developerId == 0 && default_props.developer) this.props.setRegistrationStatusForCurrentNetwork(default_props.developer.registrations);
    if (this.props.developer.registrationStatus == 'not_approved' || this.props.developer.registrationStatus == 'not_registered') this.props.fetchDeveloperId();
    this.props.fetchEntryPrice();
    if (this.props.developer.registrationStatus == 'approved' && this.props.products.allIds.length == 0){
      this.props.fetchProducts();
    }
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.developer.registrationStatus !== prevProps.developer.registrationStatus && 
        this.props.developer.registrationStatus == 'approved' &&
        this.props.products.allIds.length == 0 ) {
      this.props.fetchProducts();
    }
    if (this.props.products.fetchInProgress !== prevProps.products.fetchInProgress &&
        this.props.developer.registrationStatus == 'approved' &&
        this.props.products.allIds.length == 0 &&
        this.props.products.fetchInProgress == false) {
      this.props.history.push('/products/new');
    }
  }

  renderDeveloperNotApproved(){
    if (this.props.developer.registrationStatus == 'not_approved' &&
        this.props.developer.registrationStatus != 'not_registered' &&
       (this.props.developer.voteFinalBlock == null ||
        this.props.developer.currentBlock == null)){
      return <Loader visible={true} message="Checking registration status" />
    }
    else{
      return <p>To register a new AI Product or Bot, you must be an approved BotChain Developer</p>
    }
  }

  render() {
    return (
      <div className="white-container">
        <div className='inner-container ai-products'>
          {this.props.developer.registrationStatus != 'approved' ? 
            this.renderDeveloperNotApproved() : 
            <ProductsList products={this.props.products} />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    developer: state.developer,
    products: state.products
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchEntryPrice: () => {
      dispatch(ProductsActions.fetchEntryPrice());
    },
    fetchProducts: () => {
      dispatch(ProductsActions.fetchProducts());
    },
    fetchDeveloperId: () => {
      dispatch(DeveloperActions.fetchDeveloperId());
    },
    setRegistrationStatusForCurrentNetwork: (registrations) => {
      dispatch(DeveloperActions.setRegistrationStatusForCurrentNetwork(registrations));
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductsContainer);
