import axios from 'axios';
import BotRegistry from '../blockchain/BotRegistry';
import BotCoin from '../blockchain/BotCoin';
import { normalizeProducts } from '../helpers/JsonNormalizer';
import * as WalletActions from './walletActions';

export const ProductsActions = {
  RESET_STATE: 'PRODUCTS_RESET_STATE',
  APPEND: 'PRODUCTS_APPEND',
  SET_ATTRIBUTE: "PRODUCTS_SET_ATTRIBUTE"
}

/** Resets redux state for AI products */
export const resetTxs = () => (dispatch) => {
  dispatch({ type: ProductsActions.RESET_STATE });
}

/** Append products in redux state
 * @param products - normalized products (helper normalizeProducts)
 **/
export const appendProducts = (products) => {
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

/** Sets in progress flag used to display in progress message or animation
 * @param status - boolean value, true if request is in progress
 **/
const setFetchInProgress = (status) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'fetchInProgress', value: status }
}

/** Sets current registration step, used to display registration progress 
 * @param step - string with step name
 **/
const setRegistrationStep = (step) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'registrationStep', value: step }
}

/** Sets status for current registration step, used to display registration progress 
 * @param status - string with step status name
 **/
const setStepStatus = (status) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'stepStatus', value: status }
}

/** setErrors
 * @param errors - array of errors
 **/
const setErrors = (errors) => {
  return { type: ProductsActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

/** Fetch entryPrice from BotRegistry */
export const fetchEntryPrice = () => async (dispatch) => {
  let registry = new BotRegistry();
  let price = await registry.getEntryPrice();
  let botCoin = new BotCoin();
  dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'entryPrice', value: botCoin.convertToHuman(price) });
}

/** Upload AI product metadata to IPFS 
 * @param values - AI product metadata as JS object
**/
const addMetadata2IPFS = (values) => (dispatch) => {
  return new Promise((resolve, reject) => {
    dispatch(setRegistrationStep('load_to_ipfs'));
    dispatch(setStepStatus('running'));
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    const formData = new FormData()
    formData.append('file', JSON.stringify(values))

    axios.post('https://ipfs.infura.io:5001/api/v0/add?pin=true', formData, config)
      .then(function (response) {
        if (response.status == 200 && response.data['Hash']) {
          dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'ipfsHash', value: response.data['Hash'] });
          dispatch(setRegistrationStep('load_to_ipfs'));
          dispatch(setStepStatus('completed'));
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
  console.log("Bot registry contract:", window.keyTools.currentNetworkConfig.bot_registry_contract);
  console.log("Form values:", values);

  // upload bot metadata to IPFS
  let ipfsHash = await dispatch(addMetadata2IPFS(values));
  console.log(`ipfsHash: ${ipfsHash}`);

  // approve botcoin if need
  let entryPrice = getState().developer.entryPrice;
  if (entryPrice > 0){
    // In the current version, registration does not require debiting BOTC.
    // If this changes in future, we will have to implement approve BOTC debiting here.
  }

  // createBotProduct
  let registry = new BotRegistry();
  let developerId = getState().developer.developerId;
  try {
    dispatch(setRegistrationStep('add_bot'));
    dispatch(setStepStatus('running'));
    let txId = await registry.addBot(developerId, values.eth_address, ipfsHash);
    dispatch({ type: ProductsActions.SET_ATTRIBUTE, key: 'addBotTxId', value: txId });
    dispatch(setRegistrationStep('add_bot'));
    dispatch(setStepStatus('completed'));
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
  let chargingContract = window.keyTools.currentNetworkConfig.developer_registry_contract;
  let amount = getState().products.entryPrice;
  let approveFee = 0
  if (amount > 0){
    let approveEstGas = await botCoin.approveEstGas(amount, chargingContract);
    approveFee = parseFloat(botCoin.web3.utils.fromWei(`${approveEstGas * window.keyTools.currentNetworkConfig.gas_price}`, 'ether'));
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
    let form_data = { product: { eth_address: values.eth_address, name: values.name, create_bot_product_tx: create_bot_product_tx, network_id: window.keyTools.currentNetworkConfig.network_id}}
    axios.post('/api/products', form_data)
      .then(function (response) {
        if (response.status == 200) {
          if (response.data.products){
            dispatch(appendProducts(response.data.products));
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

export const fetchProducts = () => (dispatch, getState) => {
  if (getState().products.fetchInProgress) return
  dispatch(setFetchInProgress(true));
  axios.get('/api/products', { params: {network_id: window.keyTools.currentNetworkConfig.network_id} })
    .then(function (response) {
      if (response.status == 200) {
        if (response.data.products) {
          dispatch(appendProducts(response.data.products));
        }
        if (response.data.errors) {
          console.log(response.data.errors)
          dispatch(setErrors(response.data.errors));
        }
      }
      else {
        console.log("fetchProducts from DB failed!")
        console.log(response.data)
        dispatch(setErrors([`fetchProducts failed! HTTP status: ${response.status}`]));
      }
      dispatch(setFetchInProgress(false));
    })
    .catch(function (error) {
      console.log("fetchProducts failed!" + error)
      dispatch(setErrors([`fetchProducts failed! ${error.toString()}`]));
      dispatch(setFetchInProgress(false));
    })
}
