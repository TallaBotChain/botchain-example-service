import React, { Component } from 'react';
import QRCode from 'qrcode.react';

class Deposit extends Component {

  render() {
    return (
      <div id="#Deposit">
        <QRCode value={this.props.eth_address} />
        <p className='alert-info'>{this.props.eth_address}</p>
      </div>
    );
  }
}

export default Deposit;
