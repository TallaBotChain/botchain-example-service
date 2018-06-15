import React, { Component } from 'react';

class Information extends Component {

  render() {
    return (
      <div id="#Information">
        <div className="information-row">
          <div className="col-30"><b>ETH Address:</b></div>
          <div className="col-70">{this.props.ethAddress}</div>
          <div className="clearfix"></div>
        </div>
        <div className="information-row">
          <div className="col-30"><b>ETH Balance:</b></div>
          <div className="col-70">{this.props.balance}</div>
          <div className="clearfix"></div>
        </div>
        <div className="information-row">
          <div className="col-30"><b>BOTC Balance:</b></div>
          <div className="col-70">{this.props.tokenBalance}</div>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
}

export default Information;
