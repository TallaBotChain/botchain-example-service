import React, { Component } from 'react';
import { Modal, Button, Alert, Well } from 'react-bootstrap';
import QRCode from 'qrcode.react';
// import {clipboard} from 'electron'

export default class ReceiveModal extends Component {

  copyAddressClick = (e) => {
    e.preventDefault();
    // clipboard.writeText(this.props.address)
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose} dialogClassName={`app-modal receive-modal ${this.props.currency}-modal`}>
        <Modal.Header closeButton>
          <Modal.Title className="text-center">RECEIVE {this.props.currency}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="qr center-block">
            <QRCode value={this.props.address} renderAs="svg" size={132} />
          </div>
          <h3 className="gray-text">Your {this.props.currency} Address</h3>
          <h3 className={`${this.props.currency}`}>{this.props.address}</h3>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <a href="#" onClick={this.copyAddressClick}><small className="state-text">Copy address</small></a>
        </Modal.Footer>
      </Modal>
    );
  }
}
