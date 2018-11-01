import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../helpers/TxStatus'
import {reset} from 'redux-form';
import axios from 'axios'
import * as HistoryActions from '../actions/historyActions'

export const EthereumActions = {
  SET_ETHEREUM_ATTRIBUTE: 'SET_ETHEREUM_ATTRIBUTE',
  RESET_STATE: 'ETHEREUM_RESET_STATE'
}

export const setError = (error) => {
    return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

const setBallance = (ballance) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'balance', value: ballance }
}

export const resetState = () => {
  return { type: EthereumActions.RESET_STATE}
}

const setPendingTx = (hasPendingTx) => {
  return { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'hasPendingTx', value: hasPendingTx }
}

export const getBalances = () => (dispatch) => {
  dispatch(setInProgress(true))
  let botCoin = new BotCoin()
  // ethers
  botCoin.getBalance().then((balance)=>{
    dispatch(setBallance(botCoin.web3.utils.fromWei(balance, 'ether')))
    dispatch(getExchangeRate())
    dispatch(setInProgress(false))
  }, (error) => {
    console.log(error)
    dispatch(setBallance(0))
    dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'error', value: "Failed to retrieve ballance" })
    dispatch(setInProgress(false))
  });
}

export const transfer = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  dispatch(setPendingTx(true))
  try {
    let botCoin = new BotCoin()
    let txId = await botCoin.transferEther(to, amount);
    dispatch(startTxObserver(txId, (status, receipt) => transferTxMined(txId, status, receipt, amount)));
    dispatch(reset('eth_transfer'));
    dispatch(setInProgress(false))
    // create new history row
    let data = { value: amount, txId, input: "0x", from: window.keyTools.address}
    dispatch(HistoryActions.addNewTransaction('ethereum', data))

  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to initiate transfer." ));
    dispatch(setInProgress(false))
    dispatch(setPendingTx(false))
  }
}

const transferTxMined = (txId, status, receipt, amount) => (dispatch) => {
  dispatch(setPendingTx(false))
  if(status == TxStatus.SUCCEED){
    dispatch(getBalances())
  } else {
    dispatch( setError("Transfer transaction failed." ));
  }
  //update history row
  let data = { value: amount, txId, input: "0x", from: window.keyTools.address, ...receipt}
  dispatch(HistoryActions.addNewTransaction('ethereum', data))
}

export const getExchangeRate = () => (dispatch) => {
  axios.get(window.app_config.coinbase_price_api_url)
    .then(function (response) {
      dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'usdExchangeRate', value: response.data.data.amount });
    })
    .catch(function (error) {
      dispatch({ type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'usdExchangeRate', value: 0 });
      console.log("Failed to retreive ETH - USD exchange rate." + error)
    })
}

export const transferEstGas = (to, amount) => async (dispatch) => {
  dispatch(setInProgress(true))
  try {
    let botCoin = new BotCoin()
    let transferGas = await botCoin.transferEtherEstGas(to, amount);
    let gasFee = botCoin.web3.utils.fromWei((transferGas*botCoin.gasPrice).toString())
    dispatch( { type: EthereumActions.SET_ETHEREUM_ATTRIBUTE, key: 'transferTxEstGas', value: gasFee });
  }catch(e) {
    console.log(e);
    dispatch( setError( "Failed to estimate gas." ));
    dispatch(setInProgress(false))
  }
}
