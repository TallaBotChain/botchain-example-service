import { ProductsActions } from '../actions/productsActions.js'
import update from 'immutability-helper';
import {normalizeProducts} from '../helpers/JsonNormalizer';
import BotRegistrationSteps from '../helpers/BotRegistrationSteps'
import StepStatus from '../helpers/StepStatus'

let products_list = default_props && default_props.developer ? normalizeProducts(default_props.developer.products) : {byAddress: {}, allIds: []}
const steps_order = ['LOAD_TO_IPFS', 'APPROVE', 'ADD_BOT'];
let registration_steps = {}
steps_order.map((step) => {
  registration_steps[BotRegistrationSteps[step].id] = StepStatus.WAITING
})
const initialState = {
  inProgress: false,
  registration_steps: registration_steps,
  stepsOrder: steps_order,
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
    return update(state, { registration_steps: { [action.step]: { $set: action.status } } })
  case ProductsActions.SET_ATTRIBUTE:
    return update(state, { [action.key]: { $set: action.value } });
  default:
    return state
  }
}

export default products;
