import Web3 from 'web3'

class BaseRegistry {
  constructor() {
    this.web3 = window.keyTools.web3;
    return this;
  }

  /** Returns user address */
  getActiveAccount() {
    return this.web3.eth.getAccounts().then( (accounts) => {
      return Promise.resolve(accounts[0]);
    });
  }

  /** Returns current network ID */
  getCurrentNetwork() {
    return this.web3.eth.net.getId().then( netId => {
      return Promise.resolve(netId);
    })
  }

  /** Returns current entry price */
  getEntryPrice() {
    let contract = this.contract;
    return this.web3.eth.getAccounts().then( (accounts) => {
      return contract.methods.entryPrice().call({from: accounts[0]});
    });
  }

  /** Returns ABI method signature (4 bytes)
   * @param name - method name
   **/
  getMethodSignature(name) {
    return this.contract._jsonInterface.find((f) => (f.name  == name ) ).signature;
  }
}

export default BaseRegistry;
