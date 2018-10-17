import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import {required, length, url, email} from 'redux-form-validators'
import { MetadataValidator } from '../../validators/MetadataValidator';
import { inputField, textareaField } from '../form/FormFields';
import {connect} from 'react-redux'
import MetadataTooltip from './MetadataTooltip';
import { Button } from 'react-bootstrap';

const REQUIRED_METADATA_ATTRIBUTES = ["name","organization","street_1","city","state/province","postal_code","country","phone","email","url"]

const validateMetadata = (value) => {
  let mv = new MetadataValidator(REQUIRED_METADATA_ATTRIBUTES)
  return mv.validate(value)
}

const asyncValidate = (values, dispatch, props) => {
  return MetadataValidator.fetch(values.metadata_url, props)
}

class DeveloperForm extends Component {
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="eth_address" type="text" readOnly={true}
          component={inputField} label="ETH Address" placeholder="0x000..."
          validate={[ required()]}
        />
        <Field name="name" type="text"
          component={inputField} label="Name" placeholder="Name"
          validate={[required(), length({min: 8})]}
        />
        <Field name="organization" type="text"
          component={inputField} label="Organization" placeholder="Organization"
          validate={[ required()]}
        />
        <Field name="street_1" type="text"
          component={inputField} label="Street 1" placeholder="Street 1"
          validate={[ required()]}
        />
        <Field name="street_2" type="text"
          component={inputField} label="Street 2" placeholder="Street 2"
        />
        <Field name="city" type="text"
          component={inputField} label="City" placeholder="City"
          validate={[ required()]}
        />
      <Field name="state/province" type="text"
          component={inputField} label="State/Province" placeholder="State/Province"
          validate={[ required()]}
        />
        <Field name="postal_code" type="text"
          component={inputField} label="Postal Code" placeholder="Postal Code"
          validate={[ required()]}
        />
        <Field name="country" type="text"
          component={inputField} label="Country" placeholder="Country"
          validate={[ required()]}
        />
        <Field name="phone" type="text"
          component={inputField} label="Phone" placeholder="Phone"
          validate={[ required()]}
        />
        <Field name="email" type="text"
          component={inputField} label="Email" placeholder="Email"
          validate={[required(), email()]}
        />
        <Field name="url" type="text"
          component={inputField} label="Organization URL" placeholder="Organization URL"
          validate={[ required(), length({ max: 132 }), url() ]}
        />
        {/* <Field name="metadata_url" type="url"
          component={inputField} label="Developer Metadata URL" placeholder="Developer Metadata URL"
          validate={[ required(), length({ max: 132 }), url() ]}
          appendComponent={<MetadataTooltip />}
        />
        <Field name="metadata"
          component={textareaField} label="Metadata" placeholder="Will be autoloaded from url above" readOnly={true}
          validate={[required(), validateMetadata]}
        /> */}
        <Button bsClass="btn orange-button cta-button" type="submit">
          REGISTER
        </Button>
      </form>
    );
  }
}

DeveloperForm = reduxForm({
  form: 'developer', // a unique name for this form,
  asyncValidate,
  asyncBlurFields: ['metadata_url']
})(DeveloperForm);

DeveloperForm = connect(
  state => ({
    initialValues: {eth_address: window.keyTools.address},
    enableReinitialize: true, // pull initial values from reducer
  })
)(DeveloperForm)

export default DeveloperForm;
