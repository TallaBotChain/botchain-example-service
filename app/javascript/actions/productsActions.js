import axios from 'axios';
import BotRegistry from '../blockchain/BotRegistry';
import BotCoin from '../blockchain/BotCoin';
import { normalizeProducts } from '../helpers/JsonNormalizer';
import * as WalletActions from './walletActions';

export const ProductsActions = {
  RESET_STATE: 'PRODUCTS_RESET_STATE',
  APPEND: 'PRODUCTS_APPEND',
  SET_ATTRIBUTE: "PRODUCTS_SET_ATTRIBUTE",
  SET_PROGRESS: "PRODUCTS_SET_PROGRESS"
}

/** Resets redux state for AI products */
export const resetTxs = () => (dispatch) => {
  dispatch({ type: ProductsActions.RESET_STATE });
}

/** Append products in redux state
 * @param products - normalized products (helper normalizeProducts)
 **/
const appendProducts = (products) => {
  return {
    type: ProductsActions.APPEND,
    products: normalizeProducts(products)
  }
}

/** Sets in progress flag used to display in progress message or animation
 * @param status - boolean value, true if request is in progress
 **/
const setInProgress = (status) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'inProgress', value: status }
}

/** Sets progress status to display in progress message
 * @param step - string with step name
 * @param status - string with status of this step
 **/
const setProgressStatus = (step, status) => {
  return { type: ProductsActions.SET_PROGRESS, step: step, status: status }
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
 * @param values - AI product metadata as JS object
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
    dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'addBotTxId', value: txId });
    dispatch(setProgressStatus('add_bot', 'completed'));
  } catch (e) {
    let errors = e.toString();
    dispatch(setErrors([errors || "Not signed. Request cancelled."]));
    return
  }

  // store in DB
  await dispatch(storeProductInDB(values));
  dispatch(setInProgress(false));
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
  
  let createBotProductFee = getState().wallet.createBotProductFee;

  let registrationFee = approveFee + createBotProductFee
  console.log(`BotRegistrationFee: ${registrationFee}`);
  dispatch(WalletActions.setBotRegistrationFee(registrationFee));
}

/** store info about AI product in local db
 * @param values - AI product metadata as JS object
**/
const storeProductInDB = (values) => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    let create_bot_product_tx = getState().products.addBotTxId
    let form_data = { product: { eth_address: values.eth_address, name: values.name, create_bot_product_tx: create_bot_product_tx}}
    dispatch(setProgressStatus('store_in_db', 'running'));
    axios.post('/products', form_data)
      .then(function (response) {
        if (response.status == 200) {
          if (response.data.products){
            dispatch(appendProducts(response.data.products));
            dispatch(setProgressStatus('store_in_db', 'completed'));
            resolve()
          }
          if (response.data.errors){
            dispatch(setErrors(response.data.errors));
            reject()
          }          
        }
        else {
          console.log("storeProductInDB failed!")
          console.log(response.data)
          dispatch(setErrors([`storeProductInDB failed! HTTP status: ${response.status}`]));
          reject()
        }
      })
      .catch(function (error) {
        console.log("storeProductInDB failed!" + error)
        dispatch(setErrors([`storeProductInDB failed! ${error.toString()}`]));
        reject()
      })
  }) 
}
