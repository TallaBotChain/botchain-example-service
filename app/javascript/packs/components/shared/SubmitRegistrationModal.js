import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Loader from '../Loader';

class SubmitRegistrationModal extends Component {

  constructor(props) {
    super(props);
    this.state = { step: 1 };
    this.submitRegistrationClick = this.submitRegistrationClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tx_id) {
      this.setState({ step: 2 });
    } else {
      this.setState({ step: 1 });
    }
  }

  resetState() {
    this.setState({ step: 1 });
  }

  submitRegistrationClick() {
    this.props.submitRegistrationClick();
  }

  cancelClick() {
    this.resetState();
    this.props.handleClose();
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal payment-modal">
        <Modal.Header>
          <Modal.Title className="text-center">DEVELOPER REGISTRATION</Modal.Title>
        </Modal.Header>
        <Modal.Body className={this.state.step == 1 ? 'text-center' : 'hidden'}>
          <h3>Step {this.props.entryPrice == 0 ? '2' : '3'}: Submit Registration for Approval</h3>
          <p>
            <strong>Submitting your registration information to BotChain Curation Council for Approval.</strong> The fee for this transaction is 0 BOTC and the gas fee will be approx. {this.props.txFee} ETH.
          </p>
          <div>
            <Button bsClass="btn orange-button cta-button" type="button" onClick={this.submitRegistrationClick}>
              SUBMIT REGISTRATION
            </Button>
          </div>
          <div>
            <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.cancelClick}>
              Cancel
            </Button>
          </div>
        </Modal.Body>
        <Modal.Body className={this.state.step == 2 ? 'text-center' : 'hidden'}>
          <h3 className="text-center gold">REGISTRATION PENDING</h3>
          <p className="large-p">
            <b>This transaction has been successfully submitted</b><br />  and is now awaiting confirmation. You can check the status of this transaction on <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.tx_id}`} target='_blank'>Etherscan here</a>.
          </p>
          <div className='warning'>
            <h4>Do not close this browser window!</h4>
            <p> The Transaction's speed depends on the Ethereum Network and can range anywhere from a few seconds to up to an hour. This modal will close automatically when the transaction is complete.</p>
          </div>
          <Loader visible={true} message="Processing Transaction"/>
        </Modal.Body>
      </Modal> 
    )
  }
}

export default SubmitRegistrationModal;
