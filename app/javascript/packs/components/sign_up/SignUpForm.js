import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length, url, email, confirmation} from 'redux-form-validators'
import {inputField, checkboxField, captchaField} from '../form/FormFields'
import Loader from '../Loader'

class SignUpForm extends Component {

  // specifying your onload callback function
  callback = () => {
    console.log('Done!!!!');
  };

  // specifying verify callback function
  verifyCallback = (response) => {
    console.log(response);
  };

  render() {
    const {handleSubmit, pristine, reset, submitting} = this.props;
    return (<form onSubmit={handleSubmit}>
      <Field name="name" type="text" component={inputField} label="Name" placeholder="Name" validate={[
          required(),
          length({max: 36})
        ]}/>
      <Field name="email" type="text" component={inputField} label="Email address" placeholder="Email address" validate={[required(), email()]}/>

      <Field name="password" type="password" component={inputField} label="Password" placeholder="Password" validate={[
          required(),
          length({min: 8})
        ]}/>

      <Field name="password_confirmation" type="password" component={inputField} label="Confirm password" placeholder="Confirm password" validate={[
          required(),
          length({min: 8}),
          confirmation({ field: 'password', fieldLabel: 'Password', message: 'Passwords do not match' })
        ]}/>
      <Field name='g-recaptcha-response' component={captchaField} validate={[
          required(),
        ]}/>

      <button className='orange-button big-button' type="submit">Sign Up</button>
      <Loader visible={this.props.user.inProgress}/>
    </form>);
  }
}

SignUpForm = reduxForm({
  form: 'sign_up' // a unique name for this form,
})(SignUpForm);

export default SignUpForm;
