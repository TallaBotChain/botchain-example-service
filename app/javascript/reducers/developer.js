import { DeveloperActions } from '../actions/developerActions.js'

import update from 'immutability-helper';

let [developer_entry_id, registration_vote_final_block, registration_status] = [0, null, 'not_approved']
if(default_props && default_props.developer){
  developer_entry_id = default_props.developer.developer_entry_id;
  registration_vote_final_block = default_props.developer.registration_vote_final_block;
  registration_status = default_props.developer.registration_status;
}
const initialState = {
  entryPrice: null,
  inProgress: false,
  allowanceTxId: null,
  allowanceTxMined: false,
  addDeveloperTxId: null,
  addDeveloperTxMined: false,
  registrationVoteTxId: null,
  registrationVoteTxMined: false,
  successfullyAdded: false,
  developerId: developer_entry_id,
  registrationVoteId: null,
  voteFinalBlock: registration_vote_final_block,
  registrationStatus: registration_status,
  currentBlock: null,
  ipfsInProgress: false,
  ipfsHash: null,
  errors: []
}

const developer = (state = initialState, action) => {
  switch (action.type) {
    case DeveloperActions.RESET_STATE:
      let new_state = { ...initialState, ...{ entryPrice: state.entryPrice, developerId: state.developerId, registrationStatus: state.registrationStatus, voteFinalBlock: state.voteFinalBlock}}
      return update(state, {$set: new_state});
    case DeveloperActions.SET_ATTRIBUTE:
      return update(state, {[action.key]: {$set: action.value}});
    default:
      return state
  }
}

export default developer;
