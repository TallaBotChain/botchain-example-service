import artifact from './abi/CurationCouncilRegistryDelegate.json'
import BaseRegistry from './BaseRegistry'

class CurationCouncil extends BaseRegistry {
  constructor() {
    super();
    this.contract = new this.web3.eth.Contract(artifact.abi, window.keyTools.currentNetworkConfig.curation_council_contract);
    console.log('CurationCouncil contract:', this.contract);
    this.gasPrice = window.keyTools.currentNetworkConfig.gas_price;
  }

  /** Returns user address */
  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Sends createRegistrationVote transaction for current address */
  createRegistrationVote() {
    let contract = this.contract;
    return new Promise((resolve,reject) => {
      contract.methods.createRegistrationVote()
        .estimateGas({from: this.account, gasPrice: this.gasPrice}).then( (gas) => {
          console.log('createRegistrationVote from ',this.account);
          console.log('createRegistrationVote gas ',gas);
          return contract.methods.createRegistrationVote().send({from: this.account, gasPrice: this.gasPrice, gas: gas},
            function(err,tx_id) {
              if( err ) {
                console.log('createRegistrationVote error:',err);
                reject( err );
              }else {
                console.log('createRegistrationVote tx_id:',tx_id);
                resolve(tx_id);
              }
            });
        });
    });
  }

  /** Gets registration vote ID for current address */
  getRegistrationVoteId() {
    let contract = this.contract;
    return contract.methods.getRegistrationVoteIdByAddress(this.account).call({ from: this.account });
  }
  
  /**
   * Gets final block for vote
   * @param vote_id - registration vote ID
   */
  getVoteFinalBlock(vote_id){
    let contract = this.contract;
    return contract.methods.getVoteFinalBlock(vote_id).call({ from: this.account });
  }

  /** Gets current block */
  getCurrentBlock(){
    return this.web3.eth.getBlockNumber();
  }

}
export default CurationCouncil;
