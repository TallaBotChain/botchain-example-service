import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class NotEnoughEth extends Component {
  render() {
    if (this.props.balance >= this.props.registrationFee) return null
    return (
      <div className='alert'>
        <ul>
          <li>The wallet does not have enough ETH to pay for transactions. Click <Link to='/help#where_get_eth'>here</Link> to learn about how to get ETH</li>
        </ul>
      </div>
    );
  }
}

export default NotEnoughEth;
