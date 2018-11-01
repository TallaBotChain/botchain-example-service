import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


export default class WalletNavigation extends Component {


  render() {
    return (
      <div className="wallet-navigation">
        <NavLink className="ethereum-link" exact to="/wallet/ethereum">Ethereum<span></span></NavLink>
        <NavLink className="botcoin-link" exact to="/wallet/botcoin">Botcoin<span></span></NavLink>
      </div>
    );
  }
}
