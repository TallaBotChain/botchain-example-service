import DeveloperRegistry from '../blockchain/DeveloperRegistry';
import CurationCouncil from '../blockchain/CurationCouncil';
import BotCoin from '../blockchain/BotCoin';
import { start as startTxObserver } from './txObserverActions';
import TxStatus from '../helpers/TxStatus'
import axios from 'axios';
import * as WalletActions from './walletActions';

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
    if (!approved){
      dispatch(fetchVoteFinalBlock());
      dispatch(fetchCurrentBlock());
    }
  }
  else{
    dispatch(fetchRegistrationProcessEstGas());
  }
}

const fetchVoteFinalBlock = () => async (dispatch) => {
  let council = new CurationCouncil(window.app_config.curation_council_contract);
  let voteId = await council.getRegistrationVoteId();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteId', value: voteId });
  let voteFinalBlock = await council.getVoteFinalBlock(voteId);
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'voteFinalBlock', value: voteFinalBlock });
}

const fetchCurrentBlock = () => async (dispatch) => {
  let council = new CurationCouncil(window.app_config.curation_council_contract);
  let currentBlock = await council.getCurrentBlock();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'currentBlock', value: currentBlock });
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
    dispatch(startTxObserver(txId, addDeveloperTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setErrors( ["Not signed. Request cancelled."] ));
  }
}

export const resetTxs = () => (dispatch) => {
  dispatch({ type: DeveloperActions.RESET_STATE });
}

const addDeveloperTxMined = (status) => (dispatch) => {
  if (status == TxStatus.SUCCEED) {
    console.log("Mined addDeveloper transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxMined', value: true });
  }
}

export const createRegistrationVote = () => (dispatch) => {
  let council = new CurationCouncil(window.app_config.curation_council_contract);
  console.log('Registering Vote');
  council.createRegistrationVote()
    .then((tx_id) => {
      dispatch(startTxObserver(tx_id, registrationVoteTxMined))
      return dispatch(setRegistrationVoteTxId(tx_id));
    }).catch((err) => {
      console.log(err);
      dispatch(setErrors(["Not submitted. Request cancelled."]));
    });
}

const registrationVoteTxMined = (status) => (dispatch) => {
  if (status == TxStatus.SUCCEED) {
    console.log("Mined registrationVote transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteTxMined', value: true });
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'successfullyAdded', value: true });
  }
}

const setRegistrationVoteTxId = (tx_id) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteTxId', value: tx_id }
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
  return new Promise((resolve, reject) => {
    dispatch(setIpfsInProgress(true));
    const config = { headers: { 'content-type': 'multipart/form-data' } };
    const formData = new FormData()
    formData.append('file', JSON.stringify(values))

    axios.post('https://ipfs.infura.io:5001/api/v0/add?pin=true', formData, config)
    .then(function (response) {
      if (response.status == 200 && response.data['Hash']){
        dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'ipfsHash', value: response.data['Hash'] });
        dispatch(setIpfsInProgress(false));
        resolve(response.data['Hash'])
      }
      else{
        console.log("Failed to add file to Infura IPFS. Status: " + response.status)
        dispatch(setErrors(["Upload metadata to IPFS is failed."]));
        dispatch(setIpfsInProgress(false));
        reject(response.status)
      }
    })
    .catch(function (error) {
      console.log("Failed to add file to Infura IPFS" + error)
      dispatch(setErrors(["Upload metadata to IPFS is failed."]));
      dispatch(setIpfsInProgress(false));
      reject(error)
    })
  })
}

export const fetchRegistrationProcessEstGas = () => async (dispatch, getState) => {
  let botCoin = new BotCoin();
  let chargingContract = window.app_config.developer_registry_contract;
  let amount = getState().developer.entryPrice;
  let approveEstGas = await botCoin.approveEstGas(amount, chargingContract);
  let approveFee = parseFloat(botCoin.web3.utils.fromWei(`${approveEstGas * window.app_config.gas_price}`, 'ether'));
  dispatch(WalletActions.setApproveFee(approveFee));

  let registry = new DeveloperRegistry(window.app_config.developer_registry_contract);
  let addDeveloperEstGas = await registry.addDeveloperEstGas('QmXjFZZ3YJDkFvhhsRkTA5Y5MrtDfAMGHPFdfFbZZR9ivX'); // ipfshash just for calc price
  let addDeveloperFee = parseFloat(botCoin.web3.utils.fromWei(`${addDeveloperEstGas * window.app_config.gas_price}`, 'ether'));
  dispatch(WalletActions.setAddDeveloperFee(addDeveloperFee));

  let createRegistrationVoteFee = getState().wallet.createRegistrationVoteFee;

  let registrationFee = approveFee + addDeveloperFee + createRegistrationVoteFee
  console.log(`registrationFee: ${registrationFee}`);
  dispatch(WalletActions.setRegistrationFee(registrationFee));
}
