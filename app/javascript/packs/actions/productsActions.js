import axios from 'axios';
import BotRegistry from '../blockchain/BotRegistry';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../helpers/TxStatus';
import * as WalletActions from './walletActions';

export const ProductsActions = {
  RESET_STATE: 'PRODUCTS_RESET_STATE',
  SET_ATTRIBUTE: "PRODUCTS_SET_ATTRIBUTE",
  SET_PROGRESS: "PRODUCTS_SET_PROGRESS"
}

/** Resets redux state for AI products */
export const resetTxs = () => (dispatch) => {
  dispatch({ type: ProductsActions.RESET_STATE });
}

/** Sets in progress flag used to display in progress message or animation
 * @param status - boolean value, true if request is in progress
 **/
const setInProgress = (status) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'inProgress', value: status }
}

/** Sets progress status to display in progress message
 * @param status - string value
 **/
const setProgressStatus = (status_name, status) => {
  return { type: ProductsActions.SET_PROGRESS, status_name: status_name, status: status }
}

/** setErrors
 * @param errors - array of errors
 **/
const setErrors = (errors) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

/** Fetch entryPrice from BotRegistry */
export const fetchEntryPrice = () => async (dispatch) => {
  let registry = new BotRegistry(window.app_config.bot_registry_contract);
  let price = await registry.getEntryPrice();
  let botCoin = new BotCoin();
  dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'entryPrice', value: botCoin.convertToHuman(price) });
  if (price == 0) dispatch(setProgressStatus('approve', 'not_used'));
}

/** Upload AI product metadata to IPFS 
 * @param values - developer metadata as JS object
**/
const addMetadata2IPFS = (values) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(setProgressStatus('load_to_ipfs', 'running'));
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    const formData = new FormData()
    formData.append('file', JSON.stringify(values))

    axios.post('https://ipfs.infura.io:5001/api/v0/add?pin=true', formData, config)
      .then(function (response) {
        if (response.status == 200 && response.data['Hash']) {
          dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'ipfsHash', value: response.data['Hash'] });
          dispatch(setProgressStatus('load_to_ipfs', 'completed'));
          resolve(response.data['Hash'])
        }
        else {
          console.log("Failed to add file to Infura IPFS. Status: " + response.status)
          dispatch(setErrors(["Upload metadata to IPFS is failed."]));
          reject(response.status)
        }
      })
      .catch(function (error) {
        console.log("Failed to add file to Infura IPFS" + error)
        dispatch(setErrors(["Upload metadata to IPFS is failed."]));
        reject(error)
      })
  })
}

/** Add AI product in BotRegistry
 * @param values - Bot form values
 **/
export const addAiProduct = (values) => async (dispatch, getState) => {
  dispatch(setInProgress(true));
  console.log("Bot registry contract:", window.app_config.bot_registry_contract);
  console.log("Form values:", values);

  // upload bot metadata to IPFS
  let ipfsHash = await dispatch(addMetadata2IPFS(values));
  console.log(`ipfsHash: ${ipfsHash}`);

  // approve botcoin if need
  let entryPrice = getState().developer.entryPrice;
  if (entryPrice > 0){
    // approve botcoin
  }

  // createBotProduct
  let registry = new BotRegistry(window.app_config.bot_registry_contract);
  let developerId = getState().developer.developerId;
  try {
    dispatch(setProgressStatus('add_bot', 'running'));
    let txId = await registry.addBot(developerId, values.eth_address, ipfsHash);
    dispatch({ type: BotActions.SET_ATTRIBUTE, key: 'addBotTxId', value: txId });
    dispatch(startTxObserver(txId, addBotTxMined));
  } catch (e) {
    // console.log(e);
    let errors = e.toString();
    dispatch(setErrors([errors || "Not signed. Request cancelled."]));
  }

  // store in DB
}

/** Process mined addBot transaction */
const addBotTxMined = (status) => (dispatch) => {
  if (status == TxStatus.SUCCEED) {
    console.log("Mined addBot transaction");
    dispatch({ type: BotActions.SET_ATTRIBUTE, key: 'addBotTxMined', value: true });
    dispatch(setProgressStatus('add_bot', 'completed'));
  }
}

/** Fetch Estimate Gas for whole bot registration process */
export const fetchBotRegistrationProcessEstGas = () => async (dispatch, getState) => {
  let botCoin = new BotCoin();
  let chargingContract = window.app_config.developer_registry_contract;
  let amount = getState().products.entryPrice;
  let approveFee = 0
  if (amount > 0){
    let approveEstGas = await botCoin.approveEstGas(amount, chargingContract);
    approveFee = parseFloat(botCoin.web3.utils.fromWei(`${approveEstGas * window.app_config.gas_price}`, 'ether'));
  }
  
  let registry = new BotRegistry(window.app_config.bot_registry_contract);
  let developerId = getState().developer.developerId;
  let addBotEstGas = await registry.addBotEstGas(developerId, registry.account, 'QmXjFZZ3YJDkFvhhsRkTA5Y5MrtDfAMGHPFdfFbZZR9ivX'); // fake ipfs hash used only for gas estimation!
  let addBotFee = parseFloat(botCoin.web3.utils.fromWei(`${addBotEstGas * window.app_config.gas_price}`, 'ether'));

  let registrationFee = approveFee + addBotFee
  console.log(`BotRegistrationFee: ${registrationFee}`);
  dispatch(WalletActions.setBotRegistrationFee(registrationFee));
}
