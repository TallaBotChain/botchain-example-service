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

export const setError = (error) => {
    return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'balance', value: ballance }
}

const setTokenBallance = (tokenBalance) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'tokenBalance', value: tokenBalance }
}

export const resetState = () => {
  return { type: WalletActions.RESET_STATE}
}

export const setRegistrationFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'registrationFee', value: value }
}

export const setApproveFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'approveFee', value: value }
}

export const setAddDeveloperFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'addDeveloperFee', value: value }
}

export const setCreateRegistrationVoteFee = (value) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'createRegistrationVoteFee', value: value }
}

const setPendingTx = (hasPendingTx) => {
  return { type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}

export const getBalances = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getBalance().then((balance)=>{
    dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
  }, (error) => {
    console.log(error)
    dispatch(setBallance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve ballance" })
  });

  // tokens
  botCoin.getTokenBalance().then((balance) => {
    dispatch(setTokenBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(setInProgress(false))
  }, (error) => {
    dispatch(setTokenBallance(0))
    dispatch({ type: WalletActions.SET_WALLET_ATTRIBUTE, key: 'error', value: "Failed to retrieve token ballance" })
    dispatch(setInProgress(false))
  });
}

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
