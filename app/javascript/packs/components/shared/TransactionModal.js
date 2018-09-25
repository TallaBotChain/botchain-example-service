import React, { Component } from 'react';
import Modal from '../Modal';
import Loader from '../Loader';

class TransactionModal extends Component {

  constructor(props) {
    super(props);
    this.state = {step: 1};
    this.continueClick = this.continueClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
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

  continueClick() {
    this.props.continueClick();
  }

  cancelClick() {
    this.resetState();
    this.props.cancelClick();
  }

  render() {
    return (
      <Modal {...this.props} >
        <div className='payment-modal'>
          <div className={ this.state.step == 1 ? '' : 'hidden' }>
            <h2>Finish Registration</h2>
            <h3>Step 2 of 2</h3>
            <p>
              Finalize the transaction with the button below.  BOTC tokens will be transferred from your account during this last process. <a href="">Learn more</a>
            </p>
            <div>
              <button type="button" className="orange-button cta-button" onClick={this.continueClick}>FINALIZE TRANSACTION</button>
            </div>
            <div>
              <button type="button" className="default-button small-button width-86" onClick={this.cancelClick}>Cancel</button>
            </div>
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

export default TransactionModal;
