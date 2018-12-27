import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';


export default class NotEnoughEth extends Component {

  render() {
    return (
      <Alert bsStyle="danger" >Insufficient ETH to complete transaction. Please add ETH to your wallet to continue with this transaction.</Alert>
    );
  }
}
