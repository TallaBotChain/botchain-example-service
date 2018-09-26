import React, { Component } from 'react';

class Success extends Component {
  render() {
    return (
      <div className={ this.props.visible ? 'add-developer-success' : 'hidden' }>
        <h1 className='green-text'>REGISTRATION APPROVED!</h1>
        <p>
          Your developer address has been successfully registered for approval.<br/>
          Once approved, you can register a product or service in Botchain.
        </p>
      </div>
    );
  }
}

export default Success;
