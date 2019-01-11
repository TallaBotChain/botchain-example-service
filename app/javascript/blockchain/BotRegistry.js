import artifact from './abi/BotProductRegistryDelegate.json'
import BaseRegistry from './BaseRegistry'

class BotRegistry extends BaseRegistry {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, window.keyTools.currentNetworkConfig.bot_registry_contract);
    this.gasPrice = window.app_config.gas_price;
  }

  /** Returns user address */
  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Estimates addDeveloper gas
   * @param {string} developerId - developer entry ID
   * @param {string} botProductAddress - AI product ETH address
   * @param {string} IpfsHash - IPFS hash
   * @returns {Promise}
   **/
  addBotEstGas(developerId, botProductAddress, IpfsHash) {
    const ipfsParsed = this.parseIpfsHash(IpfsHash);
    return this.contract.methods.createBotProduct(developerId, botProductAddress, ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size).estimateGas({from: this.account, gasPrice: this.gasPrice});
  }

  /** Adds new AI product into BotRegistry
   * @param {string} developerId - developer entry ID
   * @param {string} botProductAddress - AI product ETH address
   * @param {string} IpfsHash - IPFS hash
   * @returns {Promise}
   **/
  addBot(developerId, botProductAddress, IpfsHash) {
    const ipfsParsed = this.parseIpfsHash(IpfsHash);
    let contract = this.contract;
    console.log('developerId: ', developerId);
    console.log('botProductAddress: ', botProductAddress);

    return new Promise((resolve, reject) => {
      contract.methods.createBotProduct(developerId, botProductAddress, ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size)
        .estimateGas({ from: this.account, gasPrice: this.gasPrice }).then((gas) => {
          console.log('createBotProduct estimated gas: ', gas);
          return contract.methods.createBotProduct(developerId, botProductAddress, ipfsParsed.digest, ipfsParsed.fnCode, ipfsParsed.size)
            .send({ from: this.account, gasPrice: this.gasPrice, gas: gas },
              function (err, tx_id) {
                if (err) {
                  console.log('addBot error:', err);
                  reject(err);
                } else {
                  console.log('addBot tx_id:', tx_id);
                  resolve(tx_id);
                }
              });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });;
    });
  }
}

export default BotRegistry;
