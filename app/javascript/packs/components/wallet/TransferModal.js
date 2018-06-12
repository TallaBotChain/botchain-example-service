import React, { Component } from 'react';
import Modal from '../Modal';
import Loader from '../Loader';

class TransferModal extends Component {

  constructor(props) {
    super(props);
    this.state = {step: 1};
  }

  componentWillReceiveProps(nextProps) {
    if( nextProps.tx_id ) {
      this.setState({step: 2});
    } else {
      this.setState({step: 1});
    }
  }

  resetState = () => {
    this.setState({step: 1});
  }

  okClick = () =>  {
    this.props.okClick();
    this.resetState()
  }

  cancelClick = () =>  {
    this.resetState()
    this.props.cancelClick();
  }

  render() {
    return (
      <Modal {...this.props} >
        <div className='payment-modal'>
          <div className={ this.state.step == 1 ? '' : 'hidden' }>
            <h2> Confirmation</h2>
            <p>Your account will be deducted {this.props.amount} BOTC for this transaction.</p>
            <button type="button" className="primary" onClick={this.okClick}>Continue</button>
            <button type="button" className="" onClick={this.cancelClick}>Cancel</button>
          </div>
          <div className={ this.state.step == 2 ? '' : 'hidden' }>
            <p>Transaction successfully submitted. Waiting for confirmation. <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.tx_id}`} target='_blank'>Click here</a>  to check the status of this transaction.</p>
            <Loader />
            <p className='warning'>Please do not close this browser window. The Transactions speed depends on the Ethereum Network and can range anywhere from a few seconds to up to an hour.</p>
          </div>
        </div>
      </Modal>
      )
  }
}

export default TransferModal;
