import artifact from './abi/DeveloperRegistryDelegate.json'
import BaseRegistry from './BaseRegistry'

class DeveloperRegistry extends BaseRegistry {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, window.app_config.developer_registry_contract);
    this.gasPrice = window.app_config.gas_price;
  }

  /** Returns user address */
  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Gets developer ID for current address */
  getDeveloperId() {
    let contract = this.contract;
    return contract.methods.owns(this.account).call({from: this.account});
  }

  /** Gets developer approval status */
  getDeveloperApproval(developerId) {
    let contract = this.contract;
    return contract.methods.approvalStatus(developerId).call({from: this.account});
  }

  /** Estimates addDeveloper gas
   * @param {string} IpfsHash - IPFS hash
   * @returns {Promise}
   **/
  addDeveloperEstGas(IpfsHash) {
    const ipfsParsed = this.parseIpfsHash(IpfsHash);
    return this.contract.methods.addDeveloper(ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size).estimateGas({from: this.account, gasPrice: this.gasPrice});
  }

  /**
  * @param {string} IpfsHash
  * @returns {Promise}
  */
  addDeveloper(IpfsHash) {
    const ipfsParsed = this.parseIpfsHash(IpfsHash);

    let contract = this.contract;

    return new Promise((resolve,reject) => {
      contract.methods.addDeveloper(ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size)
        .estimateGas({from: this.account, gasPrice: this.gasPrice}).then( (gas) => {
          console.log("Add developer estimated gas: ", gas);
          return contract.methods.addDeveloper(ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size)
            .send({from: this.account, gasPrice: this.gasPrice, gas: gas},
              function(err,tx_id) {
                if( err ) {
                  console.log("addDeveloper error:",err);
                  reject( err );
                }else {
                  console.log("addDeveloper tx_id:",tx_id);
                  resolve(tx_id);
                }
              });
        });
    });
  }
}

export default DeveloperRegistry;
