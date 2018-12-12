import React, { Component } from 'react';
import {connect} from 'react-redux'
import ProductsList from '../../components/products/ProductsList';
import * as ProductsActions from '../../actions/productsActions';

class ProductsContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.fetchEntryPrice();
    if (this.props.developer.registrationStatus == 'approved' && this.props.products.allIds.length == 0){
      this.props.history.push('/products/new');
    }
  }

  renderDeveloperNotApproved(){
    return <h3>To register a new AI product, you must be an approved developer!</h3>
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
    }
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(ProductsContainer);
