import React, { Component } from 'react';
import { connect } from 'react-redux'

class AboutPage extends Component {

  componentDidMount() {
    if (this.props.user.signedIn && window.keyTools.currentNetwork == 'mainnet') this.props.history.push('/');
  }

  render() {
    return (
      <div className="white-container">
        <div className='inner-container help'>
          <h2 id="welcome">Welcome to the BotChain Test Network Launch!</h2>
          <p>Thank you for helping test the BotChain Registry Application.</p>
          <p>Click <a href="#testing_scenarios">here</a> to chose a testing workflow and earn your reward for the contribution to BotChain.</p>
          <p>The goal of this Registry is to provide AI developers and companies with a decentralized means of registering and establishing verifiable identities (ownership & reputation) for all of their AI software and software instances. We at BotChain have built the application to grow and scale independently of any single platform owner...this is for the community, by the community open-source!</p>
          <p>All are welcome and encouraged to consider what services you can build on-top! But first...let’s make sure the registration and curation workflows and processes are ready for prime-time! In general, please consider what information about a developer and their machines are “must have” aspects of their identity.</p>
          <p>Please find some more information that might answer questions below.</p>
          
          <h2 id="users_and_roles">The Users and Roles of the Registry</h2>
          <p>BotChain Registry is a Token Curated Registry that runs on the Ethereum’s Koven test network. There are two key types of participants in this registry.</p>
          <p><strong>AI Developers:</strong><br/>The developers are the owners of the machines. They can be a company or individual who wants to be registered on BotChain. A successful registration provides the developer, their machine and the machine instances with a universally verifiable identity. Now data and reputation can be appended, marketplace discovery could be built, compliance and audit can be built. By registering, the developers take a first step towards building transparency and trust between their machines and the customers or users of those machines.</p>
          <p><strong>Curation Council Members:</strong><br />Curation Council Members are token-incentivized users (often AI developers) who stake their BotCoin tokens to participate in the curation process. They are the users who review registrations and must determine whether to approve or decline submissions. There are intrinsic economic incentives for token holders to curate the registry’s contents judiciously.</p>
          <p>In our BotChain Test Network Launch, we would be releasing solutions to the following use cases.</p>

          
          <h2 id="testing_scenarios">Testing Scenarios</h2>
          
          <h4>Use Case 1: AI Developer Registration</h4>
          <p>A process to register an AI Developer in the BotChain. In order to register, the Developer needs to provide information that can verify their developer identity.</p>
          <p>Service to be used: <a href="https://register.botchain.network/">Developer Registry Service</a></p>
          <p>The feedback that we would like to collect:</p>
          <ol>
            <li>Is the developer metadata information provided sufficient?</li>
            <li>What other metadata should we be collecting?</li>
            <li>Are there any concerns about the information being publically available?</li>
            <li>How was the overall registration process? Was any of it confusing?</li>
          </ol>

          <h4>Use Case 2: Becoming a Curation Council Member</h4>
          <p>In order to become a Curation Council member, one would need to put in a stake in the form Bitcoins in the system.  Once you are successfully staked, you are now a BotChain Curation Council member and you get to curate the developer registry in BotChain.</p>
          <p>Service to be used: <a href="https://github.com/TallaBotChain/botchain-releases/releases">Curation Council App</a></p>
          <p>The feedback that we would like to collect:</p>
          <ol>
            <li>Was the staking process clear?</li>
            <li>Did you have any issues managing the wallet in the app?</li>
            <li>Were you able to transfer cryptocurrencies to/from the wallet to an external wallet?</li>
            <li>Would you like a minimum stake amount to be set? If so what would it be?</li>
          </ol>

          <h4>Use Case 3: Developer Approval</h4>
          <p>Developer Approval process will be done by Curation Council members. Once a Developer information is submitted the curation council member will have a chance to review the Developer metadata. Once reviewed and validated they can either choose to approve or reject the developer from registering in BotChain.</p>
          <p>Service to be used: <a href="https://github.com/TallaBotChain/botchain-releases/releases">Curation Council App</a></p>
          <p>The feedback that we would like to collect:</p>
          <ol>
            <li>Is the developer metadata information provided sufficient?</li>
            <li>What other metadata should we be collecting?</li>
            <li>How was the overall approval process?</li>
            <li>What other external sites if any did you use to verify the developer information?</li>
            <li>How much time did you spend validating the data before making a decision?</li>
          </ol>

          <h4>Use Case 4: Curation Council Developer Approval & Reward Process</h4>
          <p>Once you have successfully staked, you are now a Curation Council member and get to curate the developer registry. For every vote/action that you take in the process of curation, you will be rewarded for your work in the form BotCoins. In order for a developer to be considered approved, the number of curator approval vote has to reach a certain critical number before they can be approved.</p>
          <p>Service to be used: <a href="https://github.com/TallaBotChain/botchain-releases/releases">Curation Council App</a></p>
          <p>The feedback that we would like to collect:</p>
          <ol>
            <li>Was the reward process clear?</li>
            <li>Was the reward amount satisfactory? If not how much would you like it to be?</li>
            <li>Was the developer consensus approval process clear?</li>
          </ol>
          <br />
          <p>To get started, please follow the links below</p>
          <p>Developer Registration Service : <a href="https://register.botchain.network">https://register.botchain.network</a></p>
          <p>Curation Council App : <a href="https://github.com/TallaBotChain/botchain-releases/releases">https://github.com/TallaBotChain/botchain-releases/releases</a></p>

          <br/>
          <br/>
          <br/>
        </div>
        <div className="sidebar">
          <ul>
            <li>
              <a href="#welcome">Welcome</a>
            </li>
            <li>
              <a href="#users_and_roles">The Users and Roles of the Registry</a>
            </li>
            <li>
              <a href="#testing_scenarios">Testing Scenarios</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps, null)(AboutPage);
