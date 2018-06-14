import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import {connect} from 'react-redux'
import Loader from '../Loader'

const ethAddress = value => (window.keyTools.web3.utils.isAddress(value) ? undefined : 'invalid ethereum address')

class TransferForm extends Component {

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
      <div id="#Transfer">
        <form onSubmit={handleSubmit}>
          <Field name="from" type="text" component={inputField} label="Transfer From" readOnly={true}/>
          <Field name="to" type="text" component={inputField} label="Transfer To" placeholder="0x123" validate={[required(), ethAddress]}/>
          <Field name="amount" type="text" component={inputField} label="BOTC" placeholder="1" validate={[required(), numericality({ '>': 0, '<=': this.props.wallet.tokenBalance })]}/>
          <button className='white-button' type="submit">Transfer</button>
          <Loader visible={this.props.wallet.inProgress}/>
        </form>
      </div>
    );
  }
}

TransferForm = reduxForm({
  form: 'transfer' // a unique name for this form,
})(TransferForm);

TransferForm = connect(
  state => ({
    initialValues: {from: state.user.ethAddress},
    enableReinitialize: true, // pull initial values from reducer
  })
)(TransferForm)

export default TransferForm;
