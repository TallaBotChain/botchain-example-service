import React, { Component } from 'react';
import QRCode from 'qrcode.react';

class Deposit extends Component {

  render() {
    return (
      <div id="#Deposit">
        <QRCode value={this.props.ethAddress} />
        <p className='alert-info'>{this.props.ethAddress}</p>
      </div>
    );
  }
}

export default Deposit;
