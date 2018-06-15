import React, { Component } from 'react';
import QRCode from 'qrcode.react';

class Deposit extends Component {

  render() {
    return (
      <div id="#Deposit">
        <div className="qr_image">
          <QRCode value={this.props.ethAddress} renderAs="svg" size={256} />
        </div>
        <div className='deposit-address'><b>{this.props.ethAddress}</b></div>
      </div>
    );
  }
}

export default Deposit;
