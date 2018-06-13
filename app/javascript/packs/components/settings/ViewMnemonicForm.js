import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {required, length} from 'redux-form-validators'
import { inputField } from '../form/FormFields';
import {connect} from 'react-redux'


class ViewMnemonicForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="password" type="password" label="Please enter your password to view mnemonic" component={inputField}  placeholder="Password" validate={[
            required(),
            length({min: 8})
          ]}/>
        <button className='primary' type="submit">View</button>
      </form>
    );
  }
}

ViewMnemonicForm = reduxForm({
  form: 'view_mnemonic', // a unique name for this form,
})(ViewMnemonicForm);

export default ViewMnemonicForm;
