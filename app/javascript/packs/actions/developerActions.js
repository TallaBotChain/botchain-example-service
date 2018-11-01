import DeveloperRegistry from '../blockchain/DeveloperRegistry';
import CurationCouncil from '../blockchain/CurationCouncil';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../helpers/TxStatus'
import axios from 'axios';

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

export const addDeveloper = (ipfsHash) => async (dispatch) => {
  console.log("Developer registry contract:", window.app_config.developer_registry_contract);
  let registry = new DeveloperRegistry(window.app_config.developer_registry_contract);
  try {
    let txId = await registry.addDeveloper(ipfsHash);
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

const addTxMined = (status) => async (dispatch) => {
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxMined', value: true });
  if(status == TxStatus.SUCCEED){
    // call CurationCouncil ( this is temporary )
    let council = new CurationCouncil(window.app_config.curation_council_contract);
    let voteTxId = await council.createRegistrationVote();
    console.log("create vote tx id:", voteTxId);
    //
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

const setIpfsInProgress = (status) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'ipfsInProgress', value: status }
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

export const addMetadata2IPFS = (values) => (dispatch) => {
  dispatch(setIpfsInProgress(true));
  const config = { headers: { 'content-type': 'multipart/form-data' } };
  const formData = new FormData()
  formData.append('file', JSON.stringify(values))
  
  axios.post('https://ipfs.infura.io:5001/api/v0/add?pin=true', formData, config)
  .then(function (response) {
    if (response.status == 200 && response.data['Hash']){
      dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'ipfsHash', value: response.data['Hash'] });
      dispatch(setIpfsInProgress(false));
    }
    else{
      console.log("Failed to add file to Infura IPFS. Status: " + response.status)
      dispatch(setErrors(["Upload metadata to IPFS is failed."]));
      dispatch(setIpfsInProgress(false));
    }
  })
  .catch(function (error) {
    console.log("Failed to add file to Infura IPFS" + error)
    dispatch(setErrors(["Upload metadata to IPFS is failed."]));
    dispatch(setIpfsInProgress(false));
  })
}
