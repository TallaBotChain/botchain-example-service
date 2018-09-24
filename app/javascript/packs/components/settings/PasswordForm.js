import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {required, length} from 'redux-form-validators'
import { inputField } from '../form/FormFields';
import {connect} from 'react-redux'


class PasswordForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="current_password" type="password" component={inputField}  placeholder="Current Password" label="Current Password" validate={[
            required(),
            length({min: 8})
          ]}/>

        <Field name="password" type="password" component={inputField}  placeholder="New Password" label="New Password" validate={[
            required(),
            length({min: 8})
          ]}/>

        <Field name="password_confirmation" type="password" component={inputField} placeholder="Confirm New Password" label="Confirm New Password" validate={[
            required(),
            length({min: 8})
          ]}/>
        <button className='orange-button cta-button' type="submit">CHANGE PASSWORD</button>
      </form>
    );
  }
}

PasswordForm = reduxForm({
  form: 'password', // a unique name for this form,
})(PasswordForm);

export default PasswordForm;
