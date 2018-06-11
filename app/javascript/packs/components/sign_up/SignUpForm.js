import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {required, length, url, email, acceptance} from 'redux-form-validators'
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
      <Field name="name" type="text" component={inputField} label="Name" placeholder="Your name" validate={[
          required(),
          length({max: 36})
        ]}/>
      <Field name="email" type="text" component={inputField} label="Email" placeholder="Your email" validate={[required(), email()]}/>

      <Field name="password" type="password" component={inputField} label="Password" placeholder="Password" validate={[
          required(),
          length({min: 8})
        ]}/>

      <Field name="password_confirmation" type="password" component={inputField} label="Password confirmation" placeholder="Password confirmation" validate={[
          required(),
          length({min: 8})
        ]}/>
      <Field name='g-recaptcha-response' component={captchaField}/>
      <Field name="age" type="checkbox" component={checkboxField} label="I confirm that I am 18 years or older" validate={acceptance({message: "Must be at least 18 years old"})}/>

      <button className='white-button' type="submit">Sign up</button>
      <Loader visible={this.props.user.signUpInProgress}/>
    </form>);
  }
}

SignUpForm = reduxForm({
  form: 'sign_up' // a unique name for this form,
})(SignUpForm);

export default SignUpForm;
