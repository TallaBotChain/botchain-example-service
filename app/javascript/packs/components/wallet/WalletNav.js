import React, { Component } from 'react';

class WalletNav extends Component {

  renderNavItem = (name) => {
    return (
      <a href={`#${name}`} onClick={(e) => this.props.onTabChange(name)} className={this.props.activeTab == name ? "active" : ""}>{name}</a>
    )
  }
  render() {
    return (
      <div className="wallet-nav">
        {this.renderNavItem('Information')} | {this.renderNavItem('Transfer')}  | {this.renderNavItem('Deposit')}
      </div>
    );
  }
}

export default WalletNav;
