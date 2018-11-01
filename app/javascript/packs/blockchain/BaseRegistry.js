import Web3 from 'web3'

class BaseRegistry {
  constructor() {
    this.web3 = window.keyTools.web3;
    return this;
  }

  getActiveAccount() {
    return this.web3.eth.getAccounts().then( (accounts) => {
      return Promise.resolve(accounts[0]);
    });
  }

  getCurrentNetwork() {
    return this.web3.eth.net.getId().then( netId => {
      return Promise.resolve(netId);
    })
  }

  getEntryPrice() {
    let contract = this.contract;
    return this.web3.eth.getAccounts().then( (accounts) => {
      return contract.methods.entryPrice().call({from: accounts[0]});
    });
  }

  getMethodSignature(name) {
    return this.contract._jsonInterface.find((f) => (f.name  == name ) ).signature;
  }
}

export default BaseRegistry;
