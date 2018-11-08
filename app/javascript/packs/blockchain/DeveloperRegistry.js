import artifact from './abi/DeveloperRegistryDelegate.json'
import BaseRegistry from './BaseRegistry'
import multihash from 'multihashes';

class DeveloperRegistry extends BaseRegistry {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, window.app_config.developer_registry_contract);
    this.gasPrice = window.app_config.gas_price;
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

  parseIpfsHash(IpfsHash){
    const mhash = multihash.fromB58String(IpfsHash);
    const decoded = multihash.decode(mhash);
    const hexString = multihash.toHexString(mhash);
    return {
      digest: `0x${hexString.substring(4)}`,
      fnCode: decoded.code,
      size: decoded.length
    };
  }

  addDeveloperEstGas(IpfsHash) {
    const ipfsParsed = this.parseIpfsHash(IpfsHash);
    return this.contract.methods.addDeveloper(ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size).estimateGas({from: this.account, gasPrice: this.gasPrice});
  }

  /**
  * @param {string} IpfsHash
  * @returns {Promise}
  */
  addDeveloper(IpfsHash) {
    console.log("IpfsHash: ", IpfsHash);
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
