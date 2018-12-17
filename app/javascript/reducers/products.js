import { ProductsActions } from '../actions/productsActions.js'
import update from 'immutability-helper';
import {normalizeProducts} from '../helpers/JsonNormalizer';

let products_list = default_props && default_props.developer ? normalizeProducts(default_props.developer.products) : {byAddress: {}, allIds: []}
const initialState = {
  inProgress: false,
  registration_steps: {
    check_balance: {status: 'not_used', text: 'Checking balance'},
    load_to_ipfs: {status: 'waiting', text: 'Loading metadata to IPFS'},
    approve: {status: 'waiting', text: 'Approving BOT token transaction'},
    add_bot: {status: 'waiting', text: 'Registering AI product in BotChain'},
    store_in_db: { status: 'not_used', text: 'Storing product in local database'}
  },
  stepsOrder: ['check_balance', 'load_to_ipfs', 'approve', 'add_bot', 'store_in_db'],
  entryPrice: null,
  addBotTxId: null,
  byAddress: products_list.byAddress, 
  allIds: products_list.allIds,
  errors: []
}

const uniqueArray = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
};

const products = (state = initialState, action) => {
  switch (action.type) {
  case ProductsActions.RESET_STATE:
    let new_state = { ...initialState, ...{ entryPrice: state.entryPrice, byAddress: state.byAddress, allIds: state.allIds } }
    return update(state, { $set: new_state });
  case ProductsActions.APPEND:
    return update(state, { byAddress: { $merge: action.products.byAddress }, allIds: { $set: uniqueArray([...state.allIds, ...action.products.allIds]) } });
  case ProductsActions.SET_PROGRESS:
    return update(state, { registration_steps: { [action.step]: { status: { $set: action.status }} } })
  case ProductsActions.SET_ATTRIBUTE:
    return update(state, { [action.key]: { $set: action.value } });
  default:
    return state
  }
}

export default products;
