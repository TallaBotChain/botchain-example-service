import React, { Component } from 'react';

class Information extends Component {

  render() {
    return (
      <div id="#Information">
        <p>ETH Address: <b>{this.props.ethAddress}</b></p>
        <p>ETH Balance: <b>{this.props.balance}</b></p>
        <p>BOTC Balance: <b>{this.props.tokenBalance}</b></p>
      </div>
    );
  }
}

export default Information;
