import artifact from './abi/DeveloperRegistryDelegate.json'
import BaseRegistry from './BaseRegistry'

class DeveloperRegistry extends BaseRegistry {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, window.app_config.developer_registry_contract);
    this.gasPrice = 100000000;
  }

  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  getDeveloperId() {
    let contract = this.contract;
    return contract.methods.owns(this.account).call({from: this.account});
  }

  getDeveloperApproval(developerId) {
    let contract = this.contract;
    return contract.methods.approvalStatus(developerId).call({from: this.account});
  }

  /**
  * @param {string} url
  * @param {string} metadata
  * @returns {Promise}
  */
  addDeveloper(url, metadata) {
    let metadataHash = this.web3.utils.sha3(metadata); // bytes32
    let urlBytes = this.web3.utils.utf8ToHex(url.substring(0,31)); // bytes32
    let contract = this.contract;
    console.log("url: ", urlBytes );
    console.log("data:", metadataHash );
    return new Promise((resolve,reject) => {
      contract.methods.addDeveloper(metadataHash, urlBytes)
        .send({from: this.account, gasPrice: this.gasPrice, gas: 300000},
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
  }
}

export default DeveloperRegistry;
