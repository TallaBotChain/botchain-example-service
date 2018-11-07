import React, { Component } from 'react';

class HelpPage extends Component {

  render() {
    return (
      <div className="white-container">
        <div className='inner-container help'>
          <h1>Developer Registration FAQ/Help</h1>
          <h3 className="green-text" id="how_to_register">How to Register</h3>
          <p>The BotChain Registration service provides a simple way for developers to register on BotChain.</p>
          
          <h3 className="green-text" id="register_steps">What are the steps to Register</h3>
          <p>
            BotChain Registration process consists of 3 simple steps for an AI developer:<br/>
            <ul>
              <li>Use BotChain Registration Service to enter developer information</li>
              <li>Developer information is then submitted to the BotChain curators for Approval</li>
              <li>BotChain Curators review developer information and choose to approve or reject the developer registration</li>
            </ul>
          </p>

          <h3 className="green-text" id="register_process">How does the Registration process work</h3>
          <p>
            Once the developer enters their information. There are two things that happen in the background.<br/>
            A JSON file with metadata will be constructed and sent to IPFS.
            BotChain smart contracts running on the Ethereum blockchain will be invoked with the developer ETH address and the JSON file stored on IPFS
            The ETH address along with JSON metadata will serve as the developer identity information and will be submitted to the BotChain Curation Council for Approval.
          </p>

          <h3 className="green-text" id="register_approvals">How does the Registration Approvals work</h3>
          <p>
            Once the developer information is submitted, the members of the BotChain Curation Council review the developer information submitted and makes a decision to approve or reject the developer registration.
          </p>

          <h3 className="green-text" id="once_register">What do I do once I Register</h3>
          <p>
            Once a developer is registered in BotChain, they can now register their AI software, product, bot offering in BotChain.
          </p>

          <h3 className="green-text" id="what_is_eth">What is ETH?</h3>
          <p>
            BotChain runs on the Ethereum BlockChain. ETH is the currency of the Ethereum blockchain.
          </p>

          <h3 className="green-text" id="what_is_gas">What is Gas?</h3>
          <p>
            Operations in Ethereum blockchain costs Gas which is paid in ETH. The cost per transaction is calculated based on the current unit gas price and the volume of gas used.
          </p>

          <h3 className="green-text" id="where_get_eth">Where do I get ETH to pay for gas?</h3>
          <p>
            For the test network, you can get ETH here:  <a href="https://github.com/kovan-testnet/faucet" target="_blank" rel="noopener noreferrer">https://github.com/kovan-testnet/faucet</a>
          </p>
          <br/>
          <br/>
          <br/>
        </div>
        <div className="sidebar">
          <ul>
            <li>
              <a href="#how_to_register">How to Register</a>
            </li>
            <li>
              <a href="#register_steps">What are the steps to Register</a>
            </li>
            <li>
              <a href="#register_process">How does the Registration process work</a>
            </li>
            <li>
              <a href="#register_approvals">How does the Registration Approvals work</a>
            </li>
            <li>
              <a href="#once_register">What do I do once I Register</a>
            </li>
            <li>
              <a href="#what_is_eth">What is ETH?</a>
            </li>
            <li>
              <a href="#what_is_gas">What is Gas?</a>
            </li>
            <li>
              <a href="#where_get_eth">Where do I get ETH to pay for gas?</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default HelpPage;
