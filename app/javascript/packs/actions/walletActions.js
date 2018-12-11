import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../helpers/TxStatus'
import {reset} from 'redux-form';
import axios from 'axios'
import * as HistoryActions from '../actions/historyActions'

export const WalletActions = {
  SET_WALLET_ATTRIBUTE: 'SET_WALLET_ATTRIBUTE',
  RESET_STATE: 'WALLET_RESET_STATE'
}

/** Sets error
 * @param error - error string
 **/
export const setError = (error) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: error };
}

/** Sets in progress flag used to display in progress message or animation
 * @param inProgress - boolean value, true if request is in progress
 **/
const setInProgress = (inProgress) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

/** Sets current account balance in Ether
 * @param balance - amount of Ether
 **/
const setBalance = (balance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'balance', value: balance }
}

/** Sets current account balance in BOT token
 * @param tokenBalance - amount of BOT token
 **/
const setTokenBalance = (tokenBalance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'tokenBalance', value: tokenBalance }
}

/** Resets redux state for wallet storage */
export const resetState = () => {
  return { type: WalletActions.RESET_STATE}
}

/** Sets estimate gas fee for whole bot registration process
 * @param value - amount of estimate gas fee (in ETH)
 **/
export const setBotRegistrationFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'botRegistrationFee', value: value }
}

/** Sets estimate gas fee for CurationCouncil.createRegistrationVote method
 * @param value - amount of estimate gas fee (in ETH)
 **/
export const setRegistrationFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'registrationFee', value: value }
}

/** Sets estimate gas fee for BotCoin.approve method
 * @param value - amount of estimate gas fee (in ETH)
 **/
export const setApproveFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'approveFee', value: value }
}

/** Sets estimate gas fee for DeveloperRegistry.addDeveloper method
 * @param value - amount of estimate gas fee (in ETH)
 **/
export const setAddDeveloperFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'addDeveloperFee', value: value }
}

/** Sets estimate gas fee for whole registration process
 * @param value - amount of estimate gas fee (in ETH)
 **/
export const setCreateRegistrationVoteFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'createRegistrationVoteFee', value: value }
}

/** Sets boolean flag if there is a pending transaction
 * @param hasPendingTx - true if pending transaction is present
 **/
const setPendingTx = (hasPendingTx) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}

/** Retrieves Ether and BOT token balance from blockchain and converts from Wei to ETH */
export const getBalances = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getBalance().then((balance)=>{
    dispatch(setBalance(botCoin.web3.utils.fromWei(balance, 'ether')))
  }, (error) => {
    console.log(error)
    dispatch(setBalance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve balance" })
  });

  // tokens
  botCoin.getTokenBalance().then((balance) => {
    dispatch(setTokenBalance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    dispatch(setTokenBalance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve token balance" })
    dispatch(setInProgress(false))
  });
}

/** Transfers BOT tokens
 * @param to - recipient address
 * @param amount - amount of BOT tokens to transfer
 **/
export const transferTokens = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin()
    let amount_wei = botCoin.web3.utils.toWei(amount.toString(), 'ether');
    let txId = await botCoin.transferTokens(to, amount_wei);
    dispatch(startTxObserver(txId, (status, receipt) => transferTxMined(txId, status, receipt, amount)));
    dispatch(reset('eth_transfer'));
    dispatch(setInProgress(false))
    //create new history row
    let data = { value: amount, txId, input: "0x", from: window.keyTools.address}
    dispatch(HistoryActions.addNewTransaction('botcoin', data))
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

/** Process mined transfer transaction
 * @param txId - transaction id (hash)
 * @param status - transaction status
 * @param receipt - transaction receipt
 * @param amount - transfer amount
 **/
const transferTxMined = (txId, status, receipt, amount) => (dispatch) => {
  dispatch(setPendingTx(false));

  if(status == TxStatus.SUCCEED){
    dispatch(getBalances())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }
  //update history row
  let data = { value: amount, txId, input: "0x", from: window.keyTools.address, ...receipt}
  dispatch(HistoryActions.addNewTransaction('botcoin', data))
}

/** Estimates gas fee for BOT tokens transfer
 * @param to - recipient address
 * @param amount - amount of BOT tokens to transfer
 **/
export const transferEstGas = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let botCoin = new BotCoin()
    let transferGas = await botCoin.transferTokensEstGas(to, amount);
    let gasFee = botCoin.web3.utils.fromWei((transferGas*botCoin.gasPrice).toString())
    dispatch( { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'transferTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to estimate gas." ));
    dispatch(setInProgress(false))
  }
}
