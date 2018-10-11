import CurationCouncil from '../blockchain/CurationCouncil';
import axios from 'axios'

export const HistoryActions = {
  SET_ATTRIBUTE: 'SET_HISTORY_ATTRIBUTE',
  ADD_TRANSACTIONS: 'HISTORY_ADD_TRANSACTIONS',
  ADD_TO_INDEX: 'HISTORY_ADD_TO_INDEX',
  REMOVE_FROM_INDEX: 'HISTORY_REMOVE_FROM_INDEX'
}

const defaultAccountApiParams = () => {
  return {
    module: "account",
    address: window.keyTools.address,
    sort: "desc",
    apikey: window.app_config.etherscan_api_key
  }
}

const normalizeTransactions = (transactions) => {
  let result = { index: [], transactions: {}}
  transactions.map((transaction) => {
    result.index.push(transaction.hash)
    result.transactions[transaction.hash] = transaction
  })
  return result
}


const setError = (error) => {
  return { type: HistoryActions.SET_ATTRIBUTE, key: 'error', value: error };
}

const setInProgress = (inProgress) => {
  return { type: HistoryActions.SET_ATTRIBUTE, key: 'inProgress', value: inProgress }
}

export const addNewTransaction = (type, data) => (dispatch) => {
  let curationCouncil = new CurationCouncil();
  let newTx = {
    [data.txId]: {
      hash: data.txId,
      from: data.from || "0x",
      timeStamp: Math.floor(Date.now() /1000),
      gasPrice: window.app_config.gas_price,
      gasUsed: data.gasUsed,
      blockNumber: data.blockNumber,
      value: curationCouncil.web3.utils.toWei(data.value.toString(), "ether"),
      input: data.input
    }
  }
  dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: newTx });
  dispatch({ type: HistoryActions.ADD_TO_INDEX, key: type, value: [data.txId] });
}

//ethereum history
export const getEthereumHistory = () => (dispatch, getState) => {
  dispatch(setInProgress(true))
  let startblock = getState().history.ethereumBlockId
  axios.get(window.app_config.etherscan_api_url, {
    params: {
      ...defaultAccountApiParams(),
      startblock: parseInt(startblock)+1,
      action: "txlist"
    }
  })
  .then(function (response) {
    //filter by eth amount.
    if (response.data.result && response.data.result.length > 0){
      let data =  response.data.result.filter(record => record.value > 0)
      if (data.length > 0) {
        let {index, transactions} = normalizeTransactions(data)
        dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: transactions });
        dispatch({ type: HistoryActions.ADD_TO_INDEX, key: 'ethereum', value: index });
        dispatch({ type: HistoryActions.SET_ATTRIBUTE, key: 'ethereumBlockId', value: data[0].blockNumber})
      }
    }
    dispatch(setInProgress(false))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
    dispatch(setInProgress(false))
  })
}

//botcoin history
export const getBotcoinHistory = () => (dispatch, getState) => {
  dispatch(setInProgress(true))
  let startblock = getState().history.botcoinBlockId
  axios.get(window.app_config.etherscan_api_url, {
    params: {
      ...defaultAccountApiParams(),
      action: "tokentx",
      startblock: parseInt(startblock)+1,
      contractaddress: window.app_config.botcoin_contract,
    }
  })
  .then(function (response) {
    if (response.data.result && response.data.result.length > 0){
      let data = response.data.result
      let {index, transactions} = normalizeTransactions(data)
      dispatch({ type: HistoryActions.ADD_TRANSACTIONS, value: transactions });
      dispatch({ type: HistoryActions.ADD_TO_INDEX, key: 'botcoin', value: index });
      dispatch({ type: HistoryActions.SET_ATTRIBUTE, key: 'botcoinBlockId', value: data[0].blockNumber})
    }
    dispatch(setInProgress(false))
  })
  .catch(function (error) {
    dispatch( setError("Failed to retreive transaction history." ));
    dispatch(setInProgress(false))
  })
}
