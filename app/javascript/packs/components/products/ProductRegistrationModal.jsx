import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import Errors from '../Errors';


class ProductRegistrationModal extends Component {

  constructor(props) {
    super(props);
  }

  renderRegistrationConfirmation() {
    return (
      <div>
        <p><strong>Registration process consists of several steps and takes some time. Please, do not close this browser window until the registration process is complete!</strong></p>
        <p>The fee for registration is <strong>{this.props.products.entryPrice} BOTC</strong> and the gas fee will be approx. <strong>{this.props.wallet.botRegistrationFee} ETH</strong>.</p>
        <div>
          <Button bsClass="btn orange-button cta-button" type="button" onClick={this.props.submitRegistrationClick()}>
            SUBMIT REGISTRATION
          </Button>
        </div>
        <div>
          <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.props.handleClose()}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  renderErrors(){
    return(
      <div>
        <div><Errors errors={this.props.products.errors} /></div>
        
        <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.props.handleClose()}>Cancel</Button>
      </div>
    )
  }

  renderRegistrationStatus(){
    const statuses = { ...this.props.products.statuses }
    return (
      <div>
        <p><strong>Registration process consists of several steps and takes some time. Please, do not close this browser window until the registration process is complete!</strong></p>
        <ul className='text-left registration-statuses'>
          {this.props.products.statusesOrder.map(function (status_key, index) {
            return (
              <li key={index} className={statuses[status_key]['status']}>
                {statuses[status_key]['text']}
              </li>
            )
          })}
        </ul>
        {this.props.products.errors.length > 0 && this.renderErrors()}
      </div>
    )
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose()} dialogClassName="app-modal payment-modal">
        <Modal.Header>
          <Modal.Title className="text-center">AI PRODUCT REGISTRATION</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          {this.props.products.inProgress ? this.renderRegistrationStatus() : this.renderRegistrationConfirmation()}
        </Modal.Body>
      </Modal>
    )
  }
}

ProductRegistrationModal.propTypes = {
  products: PropTypes.object.isRequired,
  wallet: PropTypes.object.isRequired,
  show: PropTypes.bool,
  submitRegistrationClick: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired
};

export default ProductRegistrationModal;
