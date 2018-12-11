import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import developer from './developer'
import txObserver from './txObserver'
import user from './user'
import wallet from './wallet'
import ethereum from './ethereum'
import history from './history'
import products from './products'


const reducer = combineReducers({
  form,
  developer,
  txObserver,
  user,
  wallet,
  ethereum,
  history,
  products
})

export default reducer
