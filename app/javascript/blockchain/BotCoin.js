import BaseRegistry from './BaseRegistry'
import Web3 from 'web3'
import artifact from './abi/BotCoin.json'

class BotCoin extends BaseRegistry {
  constructor() {
    super();
    this.web3 = window.keyTools.web3;
    this.contract = new this.web3.eth.Contract(artifact.abi, window.keyTools.currentNetworkConfig.botcoin_contract);
    this.decimals = 18;
    this.gasPrice = window.keyTools.currentNetworkConfig.gas_price;
  }

  /** Returns user address */
  get account() {
    return this.web3.eth.accounts.wallet[0].address;
  }

  /** Converts from wei to float point amount of ETH or ERC20 tokens
   * @param bigNumber - value in Wei
   **/
  convertToHuman(bigNumber) {
    return bigNumber / (10**this.decimals);
  }

  /** Estimates gas to ERC20 approve call
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
  approveEstGas(amount,to) {
    return this.contract.methods.approve(to,amount*10**this.decimals).estimateGas({from: this.account,gasPrice: this.gasPrice});
  }

  /** Erc20 approve call
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
  approve(amount,to) {
    return new Promise((resolve,reject) => {
      this.contract.methods.approve(to,amount*10**this.decimals)
        .estimateGas({from: this.account,gasPrice: this.gasPrice})
        .then( (gas) => {
          console.log("Approve tx estimate gas: ", gas);
          this.contract.methods.approve(to,amount*10**this.decimals)
            .send({from: this.account,gas: gas,gasPrice: this.gasPrice},
              function(err,tx_id) {
                if( ! err ) {
                  console.log("approve tx_id:",tx_id);
                  resolve(tx_id);
                }
              }).catch( (err) => {
                reject(err);
              });
        });
    });
  }

  /** Erc20 transfer call
   * @param amount - amount of tokens to transfer (float)
   * @param to - address to send tokens to
   **/
  pay(amount,to) {
    let self = this;
    return this.web3.eth.getAccounts().then( (accounts) => {
      return new Promise(function(resolve,reject) {
        self.contract.methods.transfer(to,amount*10**self.decimals)
          .send({from: accounts[0]},
            function(err,tx_id) {
              if( ! err ) {
                console.log("transfer tx_id:",tx_id);
                resolve(tx_id);
              }
            }).catch( (err) => {
              reject(err);
            });

      });
    });
  }

  /** Checks if transaction is mined
   * @param tx_id - transaction hash
   * @returns {Promise}
   **/
  isTxMined(tx_id){
    return this.web3.eth.getTransaction(tx_id).then( (transaction) => {
      console.log("transaction: ",transaction)
      let result = (transaction && transaction.blockNumber) != null
      console.log("mined: ",result);
      return Promise.resolve(result);
    }).catch(error => {
      return Promise.reject();
    });
  }

  /** Checks if transaction is successful
   * @param tx_id - transaction hash
   * @returns {Promise}
   **/
  isTxSucceed(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id).then( (receipt) => {
      console.log("receipt: ",receipt)
      return Promise.resolve(receipt.status == 1);
    }).catch(error => {
      return Promise.reject();
    });
  }

  /** Gets transaction receipt from blockchain
   * @param tx_id - transaction hash
   **/
  getTxReceipt(tx_id){
    return this.web3.eth.getTransactionReceipt(tx_id)
  }

  /** Gets token balance for current account
   * @return Promise
   **/
  getTokenBalance() {
    let contract = this.contract;
    let address = this.web3.eth.accounts.wallet[0].address
    return contract.methods.balanceOf(address).call();
  }

  /** Gets Ether balance for current account
   * @return Promise
   **/
  getBalance() {
    let address = this.web3.eth.accounts.wallet[0].address
    return this.web3.eth.getBalance(address)
  }

  /** Estimates token transfer gas
   * @param to - address to send tokens to
   * @param amount - amount of tokens to transfer (float)
   **/
  transferTokensEstGas(to, amount) {
    return this.contract.methods.transfer(to, this.web3.utils.toWei(amount.toString(), "ether")).estimateGas({from: this.account})
  }

  /** Transfers ERC20 tokens
   * @param to - address to send tokens to
   * @param amount - amount of tokens to transfer (float)
   **/
  transferTokens(to, amount) {
    let self = this;
    let fromAddress = this.web3.eth.accounts.wallet[0].address
    return self.contract.methods.transfer(to, amount).estimateGas({from: fromAddress}).then(function(gas) {
      return new Promise(function(resolve, reject) {
        self.contract.methods.transfer(to, amount)
        .send({gasPrice: self.gasPrice, from: fromAddress, gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }

  /** Estimates Ether transfer gas
   * @param to - address to send ETH to
   * @param amount - amount of Ether to transfer (float)
   **/
  transferEtherEstGas(to, amount) {
    return this.web3.eth.estimateGas({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether")})
  }

  /** Performs Ether transfer
   * @param to - address to send ETH to
   * @param amount - amount of Ether to transfer (float)
   **/
  transferEther(to, amount) {
    return this.web3.eth.estimateGas({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether")}).then((gas) => {
      return new Promise((resolve, reject) => {
        this.web3.eth.sendTransaction({from: this.account, to: to, value: this.web3.utils.toWei(amount.toString(), "ether"), gas: gas},
          function(err, tx_id) {
            if (!err) {
              console.log("transfer tx_id:", tx_id);
              resolve(tx_id);
            }
          }
        ).catch((err) => {
          reject(err);
        });
      });
    })
  }
}

export default BotCoin;
