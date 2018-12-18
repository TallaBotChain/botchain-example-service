import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { required, length, addValidator} from 'redux-form-validators'
import { inputField } from '../form/FormFields';
import {connect} from 'react-redux'
import { Button } from 'react-bootstrap';
import Loader from '../Loader';

const ethAddress = addValidator({
  defaultMessage: 'Invalid ETH address',
  validator: function (options, value, allValues) {
    return (window.keyTools.web3.utils.isAddress(value))
  }
})

class ProductForm extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="eth_address" type="text"
          component={inputField} label="ETH Address" placeholder="Product ETH Address"
          validate={[required(), ethAddress()]}
        />
        <Field name="name" type="text"
          component={inputField} label="Name" placeholder="Name"
          validate={[required(), length({min: 2})]}
        />
        <Field name="description" type="text"
          component={inputField} label="Description" placeholder="Description"
          validate={[required(), length({ min: 8 })]}
        />
        <Field name="tags" type="text"
          component={inputField} label="Tags" placeholder="Tags"
          validate={[required()]}
        />
        <Field name="version" type="text"
          component={inputField} label="Version" placeholder="current version"
          validate={[required()]}
        />
        <Field name="developer_eth_address" type="text" readOnly={true}
          component={inputField} label="Developer ETH Address" placeholder="0x000..."
          validate={[required()]}
        />
        <Button bsClass="btn orange-button cta-button" type="submit" disabled={this.props.submitDisabled}>
          REGISTER
        </Button>
        <Loader visible={this.props.inProgress} message="Registering" />
      </form>
    );
  }
}

ProductForm = reduxForm({
  form: 'product' // a unique name for this form,
})(ProductForm);

ProductForm = connect(
  state => ({
    initialValues: {developer_eth_address: window.keyTools.address},
    enableReinitialize: true, // pull initial values from reducer
  })
)(ProductForm)

ProductForm.propTypes = {
  handleSubmit: PropTypes.func,
  inProgress: PropTypes.bool
};

export default ProductForm;
