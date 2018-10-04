import React, {Component} from 'react';
import {Field, reduxForm, formValueSelector} from 'redux-form';
import { connect } from 'react-redux';
import {required, length, numericality } from 'redux-form-validators'
import {inputField } from '../form/FormFields'
import { Col, Row } from 'react-bootstrap';
import NotEnoughEth from './NotEnoughEth'
import {round} from '../../utils/Rounder'

const ethAddress = value => (window.keyTools.web3.utils.isAddress(value) ? undefined : 'invalid ethereum address')

class SendForm extends Component {

  hasEnoughEth = () => {
    return this.props.wallet.balance > this.props.wallet.transferTxEstGas
  }

  availableBalance = () => {
    if (this.props.currency === "ETH") {
      return this.props.wallet.balance > 0 ? (this.props.wallet.balance - this.props.wallet.transferTxEstGas) : this.props.wallet.balance
    } else {
      return this.props.wallet.tokenBalance
    }
  }

  render() {
    const {handleSubmit, pristine, reset, submitting, disabled} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Row>
          {!this.hasEnoughEth() && (
            <Col xs={10} xsOffset={1}>
              <NotEnoughEth />
            </Col>
          )}
          <Col xs={10} xsOffset={1}>
            <span className="form-icon arrow-icon"></span>
            <Field name="to" type="text" component={inputField} label="To:" placeholder={this.props.currency==="ETH" ? "Send to Ethereum address" : "Send to Botcoin address"} validate={[required(), ethAddress]}/>
          </Col>
          <Col xs={10} xsOffset={1}>
            <span className="form-icon currency-icon"></span>
            <Field name="amount" type="text" component={inputField} label="Amount" placeholder="Amount" validate={[required(), numericality({ '>': 0, '<=': this.availableBalance(), msg: {lessThanOrEqualTo: "insufficient balance"}}) ]}/>
            <span className={`currency ${this.props.currency.toLowerCase()}`}>{this.props.currency}</span>
          </Col>
        </Row>
        <Row className="form-footer">
          <Col xs={12}>
            <Col xs={3}>
              <button className='btn orange-button small-button width-100' type="submit" disabled={pristine || submitting }>SUBMIT</button>
            </Col>
            <Col xs={6}>
              <Row>
                <Row>
                  <Col xs={8} className="gray-text">
                    <div><small><strong>Send {this.props.amount ? this.props.amount : 0} <small>{this.props.currency}</small></strong></small></div>
                    <div><small><small>Gas Fee: {this.props.wallet.transferTxEstGas} <small>ETH</small></small></small></div>
                  </Col>
                  <Col xs={4} className="gray-text right-small">
                    <div><small><small><strong>{this.props.currency==="ETH" && this.props.amount ? `$${round(this.props.amount*this.props.usdExchangeRate)}` : "$0" }</strong></small></small></div>
                    <div><small><small><small>${round(this.props.wallet.transferTxEstGas*this.props.wallet.usdExchangeRate)}</small></small></small></div>
                  </Col>
                </Row>
              </Row>
            </Col>
            <Col xs={3}>
              <button className='btn default-button small-button width-86 pull-right' type="button" onClick={this.props.handleClose}>Cancel</button>
            </Col>
          </Col>
        </Row>
      </form>
    );
  }
}

SendForm = reduxForm({
  form: 'eth_transfer', // a unique name for this form,
})(SendForm);

const selector = formValueSelector('eth_transfer') // <-- same as form name

SendForm = connect(
  state => {
    const amount = selector(state, 'amount')
    return {
      amount
    };
  }
)(SendForm);


export default SendForm;
