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

/** Sets developer entry ID
 * @param value - developer entry ID
 **/
const setDeveloperEntryId = (value) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'developerId', value: value }
}

/** Sets registration vote final block for developer
 * @param value - final block for vote
 **/
const setRegistrationVoteFinalBlock = (value) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'voteFinalBlock', value: value }
}

/** Sets developer's registration status
 * @param value - string with registration status
 **/
const setRegistrationStatus = (value) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationStatus', value: value }
}

/** Sets developer registration status for current network
 * @param registrations - array with registrations info by networks from DB
 **/
export const setRegistrationStatusForCurrentNetwork = (registrations) => (dispatch) => {
  let current_network_id = window.keyTools.currentNetworkConfig.network_id
  if (registrations[current_network_id]) {
    dispatch(setDeveloperEntryId(registrations[current_network_id].entry_id));
    dispatch(setRegistrationVoteFinalBlock(registrations[current_network_id].vote_final_block));
    dispatch(setRegistrationStatus(registrations[current_network_id].status));
  }
}

/** Fetch developerId for currentAccount from DeveloperRegistry */
export const fetchDeveloperId = () => async (dispatch, getState) => {
  let registry = new DeveloperRegistry();
  let developerId = getState().developer.developerId;
  if (developerId == 0){
    developerId = await registry.getDeveloperId();
    dispatch(setDeveloperEntryId(developerId));
  }
  if( developerId > 0 ) {
    let approved = await registry.getDeveloperApproval(developerId);
    if (approved) dispatch(setRegistrationStatus('approved'))
    if (!approved){
      dispatch(fetchVoteFinalBlock());
      dispatch(fetchCurrentBlock());
    }
  }
  else{
    dispatch(fetchRegistrationProcessEstGas());
    dispatch(setRegistrationStatus('not_registered'))
  }
}

/** Fetch voteFinalBlock from CurationCouncil */
const fetchVoteFinalBlock = () => async (dispatch, getState) => {
  let voteFinalBlock = getState().developer.voteFinalBlock;
  if (voteFinalBlock != null) return;
  let council = new CurationCouncil();
  let voteId = await council.getRegistrationVoteId();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteId', value: voteId });
  voteFinalBlock = await council.getVoteFinalBlock(voteId);
  dispatch(setRegistrationVoteFinalBlock(voteFinalBlock));
}

/** Fetch current block from CurationCouncil */
const fetchCurrentBlock = () => async (dispatch) => {
  let council = new CurationCouncil();
  let currentBlock = await council.getCurrentBlock();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'currentBlock', value: currentBlock });
}

/** Fetch entryPrice from DeveloperRegistry */
export const fetchEntryPrice = () => async (dispatch) => {
  let registry = new DeveloperRegistry();
  let price = await registry.getEntryPrice();
  let botCoin = new BotCoin();
  dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'entryPrice', value: botCoin.convertToHuman(price) });
}

/** setErrors
 * @param errors - array of errors
 **/
const setErrors = (errors)  => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'errors', value: errors }
}

/** Add developer in DeveloperRegistry
 * @param ipfsHash - IPFS hash string
 **/
export const addDeveloper = (ipfsHash) => async (dispatch) => {
  console.log("Developer registry contract:", window.keyTools.currentNetworkConfig.developer_registry_contract);
  let registry = new DeveloperRegistry();
  try {
    let txId = await registry.addDeveloper(ipfsHash);
    dispatch( { type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxId', value: txId });
    dispatch(startTxObserver(txId, addDeveloperTxMined));
  }catch(e) {
    console.log(e);
    dispatch( setErrors( ["Not signed. Request cancelled."] ));
  }
}

/** Resets redux state for developer */
export const resetTxs = () => (dispatch) => {
  dispatch({ type: DeveloperActions.RESET_STATE });
}

/** Process mined addDeveloper transaction */
const addDeveloperTxMined = (status) => (dispatch) => {
  if (status == TxStatus.SUCCEED) {
    console.log("Mined addDeveloper transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'addDeveloperTxMined', value: true });
  }
}

/** create RegistrationVote in CurationCouncilRegistry */
export const createRegistrationVote = () => (dispatch) => {
  let council = new CurationCouncil();
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

/** Process mined RegistrationVote transaction */
const registrationVoteTxMined = (status) => (dispatch) => {
  if (status == TxStatus.SUCCEED) {
    console.log("Mined registrationVote transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteTxMined', value: true });
    dispatch(setRegistrationStatus('not_approved'))
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'successfullyAdded', value: true });
  }
}

/** Sets RegistrationVote transaction id
 * @param tx_id - transaction hash
 **/
const setRegistrationVoteTxId = (tx_id) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'registrationVoteTxId', value: tx_id }
}

/** Process mined BotCoin.Approve transaction */
const payTxMined = (status) => (dispatch) => {
  if(status == TxStatus.SUCCEED){
    console.log("Mined approval transaction");
    dispatch({ type: DeveloperActions.SET_ATTRIBUTE, key: 'allowanceTxMined', value: true });
  }
}

/** Sets BotCoin.Approve transaction id
 * @param tx_id - transaction hash
 **/
const setPayTxId = (tx_id) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'allowanceTxId', value: tx_id }
}


/** Sets in progress flag used to display in progress message or animation
 * @param status - boolean value, true if request is in progress
 **/
const setIpfsInProgress = (status) => {
  return { type: DeveloperActions.SET_ATTRIBUTE, key: 'ipfsInProgress', value: status }
}

/** Calls approve method of ERC20 contract to let DeveloperRegistry smart contract withdraw funds */
export const approvePayment = () => (dispatch, getState) => {
  let botCoin = new BotCoin();
  let chargingContract = window.keyTools.currentNetworkConfig.developer_registry_contract;
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

/** Upload developer metadata to IPFS 
 * @param values - developer metadata as JS object
**/
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

/** Fetch Estimate Gas for whole registration process */
const fetchRegistrationProcessEstGas = () => async (dispatch, getState) => {
  let botCoin = new BotCoin();
  let chargingContract = window.keyTools.currentNetworkConfig.developer_registry_contract;
  let amount = getState().developer.entryPrice;
  let approveEstGas = await botCoin.approveEstGas(amount, chargingContract);
  let approveFee = parseFloat(botCoin.web3.utils.fromWei(`${approveEstGas * window.keyTools.currentNetworkConfig.gas_price}`, 'ether'));
  dispatch(WalletActions.setApproveFee(approveFee));

  let registry = new DeveloperRegistry();
  let addDeveloperEstGas = await registry.addDeveloperEstGas('QmXjFZZ3YJDkFvhhsRkTA5Y5MrtDfAMGHPFdfFbZZR9ivX'); // fake ipfs hash used only for gas estimation!
  let addDeveloperFee = parseFloat(botCoin.web3.utils.fromWei(`${addDeveloperEstGas * window.keyTools.currentNetworkConfig.gas_price}`, 'ether'));
  dispatch(WalletActions.setAddDeveloperFee(addDeveloperFee));

  let createRegistrationVoteFee = getState().wallet.createRegistrationVoteFee;

  let registrationFee = approveFee + addDeveloperFee + createRegistrationVoteFee
  console.log(`registrationFee: ${registrationFee}`);
  dispatch(WalletActions.setRegistrationFee(registrationFee));
}
