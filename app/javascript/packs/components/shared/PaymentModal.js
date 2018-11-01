import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import Loader from '../Loader';

class PaymentModal extends Component {

  constructor(props) {
    super(props);
    this.state = {step: 1};
    this.approveClick = this.approveClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.developer.ipfsHash == null && nextProps.developer.ipfsInProgress == false && nextProps.developer.allowanceTxId == null) {
      this.setState({step: 1});
    }
    else if ((nextProps.developer.ipfsHash != null || nextProps.developer.ipfsInProgress == true) && nextProps.developer.allowanceTxId == null) {
      this.setState({step: 2});
    }
    else if (nextProps.developer.allowanceTxId) {
      this.setState({step: 3});
    }
  }

  resetState() {
    this.setState({step: 1});
  }

  approveClick() {
    this.props.approveClick();
  }

  cancelClick() {
    this.resetState();
    this.props.handleClose();
  }

  renderModalHeader(){
    switch (this.state.step) {
      case 1:
        return (
          <Modal.Header>
            <Modal.Title className="text-center">FINISH REGISTRATION</Modal.Title>
          </Modal.Header>
        );
      case 2: /* same as 3 */
      case 3:
        return (
          <Modal.Header>
            <Modal.Title className="text-center gold">REGISTRATION PENDING</Modal.Title>
          </Modal.Header>
        );
    }
  }

  renderModalBody() {
    switch (this.state.step) {
      case 1:
        return (
          <Modal.Body className="text-center">
          <h3>Step 1 of 2</h3>
          {this.props.token_balance == 0 && (
            <div>
              <p className="alert">
                Warning: not enough Ether to pay for gas.
              </p>
            </div>
          )}
          {this.props.token_balance >= this.props.developer.entryPrice ? (
            <div>
              <p>
                The fee for this transaction is <b>{this.props.developer.entryPrice} BOTC</b>.<br/>
                No BOTC tokens will be transferred during this first part
                of the process. <a href="">Learn more</a>
              </p>
              <div>
                <Button bsClass="btn orange-button cta-button" type="button" onClick={this.approveClick}>
                  AUTHORIZE PAYMENT
                </Button>
              </div>
              <div>
                <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.cancelClick}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="alert">Insufficient tokens to carry out the transaction.</p>
              <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.cancelClick}>
                Cancel
              </Button>
            </div>
          )}
        </Modal.Body>
        );
      case 2:
        return (
          <Modal.Body className="text-center">
            <p className="large-p">
              <b>Preparing and uploading metadata to IPFS.</b>
            </p>
            <div className='warning'>
              <h4>Do not close this browser window!</h4>
            </div>
            <Loader visible={true} message="loading metadata"/>
          </Modal.Body>
        );
      case 3:
        return (
          <Modal.Body className="text-center">
            <p className="large-p">
              <b>This transaction has been successfully submitted</b><br/>  and is now awaiting confirmation. You can check the status of this transaction on <a href={`${"https://kovan.etherscan.io"}/tx/${this.props.developer.allowanceTxId}`} target='_blank'>Etherscan here</a>.
            </p>
            <div className='warning'>
              <h4>Do not close this browser window!</h4>
              <p> The Transaction's speed depends on the Ethereum Network and can range anywhere from a few seconds to up to an hour. This modal will close automatically when the transaction is complete.</p>
            </div>
            <Loader visible={true} message="Processing Transaction"/>
          </Modal.Body>
        );
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName="app-modal payment-modal">
        {this.renderModalHeader()}
        {this.renderModalBody()}
      </Modal>
    )
  }
}

export default PaymentModal;
