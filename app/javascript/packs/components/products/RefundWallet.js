import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import Clipboard from 'react-clipboard.js';

class RefundWallet extends Component {

  renderNeedEther(){
    return (
      <div>
        <p>Insufficient Ether to pay for this transaction. You need at least {this.props.wallet.botRegistrationFee}ETH, your current wallet balance is {this.props.wallet.balance}ETH. </p>
        <blockquote>
          <p><small>Tip: For the test network, you can get ETH <a href="https://github.com/kovan-testnet/faucet" target="_blank" rel="noopener noreferrer">here</a>. You will need to paste your address into github when asked for your Kovan ETH address</small></p>
        </blockquote>
      </div>
      
    )
  }

  renderNeedBotCoin() {
    return (
      <p>Insufficient BotCoin to pay for this transaction. You need at least {this.props.products.entryPrice}BOTC, your current wallet balance is {this.props.wallet.tokenBalance}BOTC. </p>
    )
  }
  
  render() {
    return (
      <div className='inner-container ai-products'>
        {this.props.wallet.botRegistrationFee > this.props.wallet.balance && this.renderNeedEther()}
        {this.props.products.entryPrice > this.props.wallet.tokenBalance && this.renderNeedBotCoin()}
        <div className="text-center">
          <div className="qr center-block">
            <QRCode value={this.props.address} renderAs="svg" size={132} />
          </div>
          <h3 className="gray-text">Your Address</h3>
          <h3 id="my_address">{this.props.address}</h3>  
          <Clipboard className="btn default-button cta-button width-100" data-clipboard-target="#my_address">Copy address</Clipboard>
          <span>&nbsp;</span>
          <Button className="btn default-button cta-button width-100" onClick={() => this.props.getBalance()}>Check Balance</Button>
        </div>
      </div>
    )
  }
}

RefundWallet.propTypes = {
  wallet: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  getBalance: PropTypes.func.isRequired,
  address: PropTypes.string.isRequired
};

export default RefundWallet;
