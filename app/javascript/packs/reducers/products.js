import { ProductsActions } from '../actions/productsActions.js'
import update from 'immutability-helper';

let products_list = default_props && default_props.developer ? default_props.developer.products : []
const initialState = {
  inProgress: false,
  statuses: {
    check_balance: {status: 'not_used', text: 'Checking balance'},
    load_to_ipfs: {status: 'waiting', text: 'Loading metadata to IPFS'},
    approve: {status: 'waiting', text: 'Approving BOT token transaction'},
    add_bot: {status: 'waiting', text: 'Registering AI product in BotChain'},
    store_in_db: { status: 'not_used', text: 'Storing product in local database'}
  },
  statusesOrder: ['check_balance', 'load_to_ipfs', 'approve', 'add_bot', 'store_in_db'],
  entryPrice: null,
  addBotTxId: null,
  list: products_list,
  errors: []
}

const products = (state = initialState, action) => {
  switch (action.type) {
  case ProductsActions.RESET_STATE:
    let new_state = { ...initialState, ...{ entryPrice: state.entryPrice, list: state.list } }
    return update(state, { $set: new_state });
  case ProductsActions.SET_PROGRESS:
    return update(state, { statuses: { [action.status_name]: { status: { $set: action.status }} } })
  case ProductsActions.SET_ATTRIBUTE:
    return update(state, { [action.key]: { $set: action.value } });
  default:
    return state
  }
}

export default products;
