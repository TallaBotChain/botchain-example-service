import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import {connect} from 'react-redux'
import Loader from '../Loader'

class TransferForm extends Component {

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (
      <div id="#Transfer">
        <form onSubmit={handleSubmit}>
          <Field name="from" type="text" component={inputField} label="Transfer From" readOnly={true}/>
          <Field name="to" type="text" component={inputField} label="Transfer To" placeholder="0x123" validate={[required()]}/>
          <Field name="amount" type="text" component={inputField} label="BOTC" placeholder="1" validate={[required()]}/>
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
    initialValues: {from: state.user.eth_address},
    enableReinitialize: true, // pull initial values from reducer
  })
)(TransferForm)

export default TransferForm;
