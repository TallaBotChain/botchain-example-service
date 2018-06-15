import DeveloperRegistry from '../blockchain/DeveloperRegistry';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import { UrlShortener } from "../helpers/UrlShortener";
import TxStatus from '../helpers/TxStatus'

export const DeveloperActions = {
  RESET_STATE: "DEVELOPER_RESET_STATE",
  SET_ATTRIBUTE: "DEVELOPER_SET_ATTRIBUTE"
}

export const fetchDeveloperId = () => async (dispatch, getState) => {
  let registry = new DeveloperRegistry(window.app_config.developer_registry_contract);
  let developerId = await registry.getDeveloperId();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'developerId', value: developerId });
  if( developerId > 0 ) {
    let approved = await registry.getDeveloperApproval(developerId);
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'developerApproval', value: approved });
  }
}

export const fetchEntryPrice = () => async (dispatch) => {
  let registry = new DeveloperRegistry(window.app_config.developer_registry_contract);
  let price = await registry.getEntryPrice();
  let botCoin = new BotCoin();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'entryPrice', value: botCoin.convertToHuman(price) });
}

const setErrors = (errors)  => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

export const allowTransfer = () => {}
export const checkTransferAllowance = () => {}

export const addDeveloper = (url, metadata) => async (dispatch) => {
  let shorten_url = url
  if (url.length > 32) {
    shorten_url = await UrlShortener.shorten(url);
  }
  //NOTE: metadata here is a json string, not an object
  console.log("addDeveloper with url:", shorten_url, " metadata:", metadata);
  console.log("Developer registry contract:", window.app_config.developer_registry_contract);
  let registry = new DeveloperRegistry(window.app_config.developer_registry_contract);
  try {
    let txId = await registry.addDeveloper(shorten_url, metadata);
    dispatch( { type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxId', value: txId });
    dispatch(startTxObserver(txId, addTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setErrors( ["Not signed. Request cancelled."] ));
  }
}

export const resetTxs = () => (dispatch) => {
  dispatch({ type: DeveloperActions.RESET_STATE });
}

const addTxMined = (status) => (dispatch) => {
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'successfullyAdded', value: true });
  } else {
    dispatch( setErrors( ["Add developer transaction failed."] ));
  }
}

const payTxMined = (status) => (dispatch) => {
  if(status == TxStatus.SUCCEED){
    console.log("Mined approval transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'allowanceTxMined', value: true });
  }
}

const setPayTxId = (tx_id) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'allowanceTxId', value: tx_id }
}

export const approvePayment = () => (dispatch, getState) => {
  let botCoin = new BotCoin();
  let chargingContract = window.app_config.developer_registry_contract;
  let amount = getState().developer.entryPrice;
  console.log("Approving for amount ", amount);
  botCoin.approve(amount, chargingContract)
  .then( (tx_id) => {
    dispatch(startTxObserver(tx_id, payTxMined))
    return dispatch( setPayTxId(tx_id) );
  }).catch( (err)=> {
    console.log(err);
    dispatch( setErrors( ["Not approved. Request cancelled."] ));
  });
}
