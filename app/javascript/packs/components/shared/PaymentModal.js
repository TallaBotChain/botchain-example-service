import React, { Component } from 'react';
import Modal from '../Modal';
import Loader from '../Loader';

class PaymentModal extends Component {

  constructor(props) {
    super(props);
    this.state = {step: 1};
    this.approveClick = this.approveClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.okClick = this.okClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.tx_id ) {
      this.setState({step: 2});
    } else {
      this.setState({step: 1});
    }
  }

  resetState() {
    this.setState({step: 1});
  }

  nextStep() {
    let step = (this.state.step + 1)
    this.setState({step: step });
  }

  approveClick() {
    this.props.approveClick();
  }

  cancelClick() {
    this.resetState();
    this.props.cancelClick();
  }

  okClick() {
    this.props.okClick();
    this.resetState();
  }

  render() {
    return (
      <Modal {...this.props} >
        <div className='payment-modal'>
          <div className={ this.state.step == 1 ? '' : 'hidden' }>
            <h2>Finish Registration</h2>
            <h3>Step 1 of 2</h3>
            {this.props.balance == 0 && (
              <div>
                <p className="alert">
                  Warning: not enough Ether to pay for gas.
                </p>
              </div>
            )}
            {this.props.token_balance >= this.props.entryPrice ? (
              <div>
                <p>
                  The fee for this transaction is <b>{this.props.entryPrice} BOTC</b>.<br/>
                  No BOTC tokens will be transferred during this first part
                  of the process. <a href="">Learn more</a>
                </p>
                <div>
                  <button type="button" className="orange-button cta-button" onClick={this.approveClick}>AUTHORIZE PAYMENT</button>
                </div>
                <div>
                  <button className="default-button small-button width-86" type="button" onClick={this.cancelClick}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="alert">Insufficient tokens to carry out the transaction.</p>
                <button className="default-button small-button width-86" type="button" onClick={this.cancelClick}>Cancel</button>
              </div>
            )}
          </div>
          <div className={ this.state.step == 2 ? '' : 'hidden' }>
            <h2 className="gold">Registration pending</h2>
            <p className="large-p">
              <b>This transaction has been successfully submitted</b><br/>  and is now awaiting confirmation. You can check the status of this transaction on <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.tx_id}`} target='_blank'>Etherscan here</a>.
            </p>
            <div className='warning'>
              <h4>Do not close this browser window!</h4>
              <p> The Transaction's speed depends on the Ethereum Network and can range anywhere from a few seconds to up to an hour. This modal will close automatically when the transaction is complete.</p>
            </div>
            <Loader visible={true} message="Processing Transaction"/>
          </div>
        </div>
      </Modal>
      )
  }
}

export default PaymentModal;
