import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { required } from 'redux-form-validators'
import { inputField } from '../form/FormFields';
import {connect} from 'react-redux'


class PasswordForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="password" type="text"
          component={inputField} label="" placeholder="Current Password"
          validate={[ required()]}
        />
        <Field name="new_password" type="text"
          component={inputField} label="" placeholder="New Password"
          validate={[ required()]}
        />
        <Field name="new_password_confirmation" type="text"
          component={inputField} label="" placeholder="Confirm Password"
          validate={[ required()]}
        />
        <button className='primary' type="submit">Change Password</button>
      </form>
    );
  }
}

PasswordForm = reduxForm({
  form: 'password', // a unique name for this form,
})(PasswordForm);

export default PasswordForm;
