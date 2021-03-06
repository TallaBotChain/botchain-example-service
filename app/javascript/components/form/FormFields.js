import React from 'react';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';

export const captchaField = (props) => (
  <div>
    <ReCAPTCHA sitekey={window.app_config.recaptcha_key} onChange={props.input.onChange}/>
  </div>
)

export const inputField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => (
  <FormGroup controlId={input.name}>
    <FormControl {...input} placeholder={placeholder || label} type={type} readOnly={readOnly} className={touched && error && 'error'} />
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
    {asyncValidating && (<span>validating...</span>)}
    <ControlLabel>{label}</ControlLabel>
    {appendComponent}
  </FormGroup>
)

export const textareaField = ({ input, label, readOnly, placeholder, meta: { asyncValidating, touched, error, warning } }) => (
  <div>
    <label htmlFor={input.name}>{label}</label>
    <textarea {...input} placeholder={placeholder || label} readOnly={readOnly} rows="12" />
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
  </div>
)


export const checkboxField = ({ input, label, type, meta: { asyncValidating, touched, error, warning }, readOnly, placeholder, appendComponent }) => (
  <div className='checkbox'>
    <input {...input} placeholder={placeholder || label} type={type} id={input.name} />
    <label htmlFor={input.name}>{label}</label>
    {touched && ((error && <span className='validation-error'>{error}</span>) || (warning && <span>{warning}</span>))}
    {asyncValidating && (<span>validating...</span>)}
    {appendComponent}
  </div>
)
