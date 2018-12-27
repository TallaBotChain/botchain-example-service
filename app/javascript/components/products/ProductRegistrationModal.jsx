import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import Errors from '../Errors';

class ProductRegistrationModal extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      modal_slide: 1, 
      registration_steps: {
        load_to_ipfs: { status: 'waiting', text: 'Loading metadata to IPFS' },
        approve:      { status: 'waiting', text: 'Approving BOT token transaction' },
        add_bot:      { status: 'waiting', text: 'Registering AI product in BotChain' }
      },
      steps_order: ['load_to_ipfs', 'approve', 'add_bot']
    };
  }

  componentDidMount() {
    this.updateStateRegistrationSteps();
  }

  componentDidUpdate(prevProps) {
    if (this.props.products.inProgress !== prevProps.products.inProgress) {
      if (this.props.products.inProgress == true){
        this.setState({ modal_slide: 2 });
      }
      else{
        this.props.products.addBotTxId == null ? this.setState({ modal_slide: 1 }) : this.setState({ modal_slide: 3 });
      }
    }
    if (this.props.products.registrationStep !== prevProps.products.registrationStep || this.props.products.stepStatus !== prevProps.products.stepStatus){
      this.updateStateRegistrationSteps();
    }
  }

  updateStateRegistrationSteps() {
    const current_step = this.props.products.registrationStep;
    const current_step_index = this.state.steps_order.findIndex((elem)=>{return elem==current_step})
    const current_status = this.props.products.stepStatus;
    let registration_steps = { ...this.state.registration_steps };
    this.state.steps_order.map((step, index) => {
      if (index == current_step_index) {
        registration_steps[step].status = current_status
      }
      else if (index < current_step_index) {
        registration_steps[step].status = 'completed'
      }
      else {
        registration_steps[step].status = 'waiting'
      }
    })
    // check APPROVE STATUS
    if (this.props.products.entryPrice == 0) registration_steps.approve.status = 'not_used'

    this.setState({ registration_steps: registration_steps });
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
    return (
      <div>
        <p><strong>Registration process consists of several steps and takes some time. Please, do not close this browser window until the registration process is complete!</strong></p>
        <ul className='registration-statuses'>
          {this.state.steps_order.map(function (step, index) {
            return (
              <li key={index} className={this.state.registration_steps[step].status}>
                {this.state.registration_steps[step].text}
              </li>
            )
          }, this)}
        </ul>
        {this.props.products.errors.length > 0 && this.renderErrors()}
        {this.state.modal_slide == 3 && 
          <div>
            <p className="botcoin-green"><strong>Registration Successful!</strong></p>
            <Button bsClass="btn default-button small-button width-86" type="button" onClick={this.props.clickFinish()}>Finish</Button>
          </div>
        }
      </div>
    )
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose()} dialogClassName="app-modal payment-modal product-registration-modal">
        <Modal.Header>
          <Modal.Title className="text-center">AI PRODUCT REGISTRATION</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          {this.state.modal_slide == 1 ? this.renderRegistrationConfirmation() : this.renderRegistrationStatus()}
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
  handleClose: PropTypes.func.isRequired,
  clickFinish: PropTypes.func.isRequired
};

export default ProductRegistrationModal;
