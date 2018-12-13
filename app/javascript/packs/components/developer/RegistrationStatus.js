import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Loader from '../Loader';

class RegistrationStatus extends Component {
  renderRegistrationSubmittedPendingApproval() {
    return (
      <div className='add-developer-success'>
        <h1 className='green-text'>REGISTRATION SUCCESSFULLY SUBMITTED!</h1>
        <p>
          Your developer address has been successfully registered for approval.<br />
          Once approved, you can register a product or service in Botchain.
        </p>
      </div>
    );
  }

  renderRegistrationApproved() {
    return (
      <div className='add-developer-success'>
        <h1 className='green-text'>REGISTRATION APPROVED!</h1>
        <p>
          Welcome to BotChain!<br />
          You are now an Approved BotChain Developer! You can now register your AI product or service in Botchain.
        </p>
        <Button className="btn default-button cta-button width-100" onClick={this.props.registerAiProduct()}>Register AI Product</Button>
      </div>
    );
  }

  renderRegistrationError(){
    return (
      <div>
        <h1>REGISTRATION ERROR!</h1>
        <p>
          There has been an error in the Registration process.<br/>
          Please contact <a href="mailto:support@botchain.network?Subject=BotChain%20Developer%20registration%20error!" target="_top">support@botchain.network</a> for additional details.
        </p>
      </div>
    );
  }

  renderRegistrationDenied() {
    return (
      <div>
        <h1>REGISTRATION DENIED!</h1>
        <p>
          Your BotChain Developer application was denied by the BotChain Curation Council.<br/>
          You can try reapplying or contact <a href="mailto:support@botchain.network?Subject=BotChain%20Developer%20registration%20denied!" target="_top">support@botchain.network</a> for additional details.
        </p>
      </div>
    );
  }
  
  render() {
    // if developer just added
    if (this.props.developer.successfullyAdded) return this.renderRegistrationSubmittedPendingApproval()

    // if have registrationStatus 
    if (this.props.developer.registrationStatus == 'approved') return this.renderRegistrationApproved();
    if (this.props.developer.registrationStatus == 'denied') return this.renderRegistrationDenied()

    // else check registration status
    if (this.props.developer.developerId == 0) return null
    if (this.props.developer.registrationStatus == 'not_approved' &&
      ( this.props.developer.voteFinalBlock == null ||
        this.props.developer.currentBlock == null
      )
    ) return <Loader visible={true} message="Checking registration status" />
    
    if (this.props.developer.registrationVoteId == 0 || this.props.developer.voteFinalBlock == 0) return this.renderRegistrationError();

    if (this.props.developer.voteFinalBlock > this.props.developer.currentBlock){
      return this.renderRegistrationSubmittedPendingApproval()
    }
    else{
      return this.renderRegistrationDenied()
    }
  }
}

RegistrationStatus.propTypes = {
  developer: PropTypes.object.isRequired,
  registerAiProduct: PropTypes.func.isRequired
};

export default RegistrationStatus;
