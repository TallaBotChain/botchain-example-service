import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length, url, email, acceptance} from 'redux-form-validators'
import {inputField, checkboxField, captchaField} from '../form/FormFields'
import Loader from '../Loader'

class SignInForm extends Component {

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="email" type="text" component={inputField} label="Email" placeholder="Your email" validate={[required(), email()]}/>

      <Field name="password" type="password" component={inputField} label="Password" placeholder="Password" validate={[required()]}/>
      <button className='white-button' type="submit">Sign in</button>
      <Loader visible={this.props.user.inProgress}/>
    </form>);
  }
}

SignInForm = reduxForm({
  form: 'sign_in' // a unique name for this form,
})(SignInForm);

export default SignInForm;
