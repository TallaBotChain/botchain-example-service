import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import developer from './developer'
import txObserver from './txObserver'
import user from './user'


const reducer = combineReducers({
  form,
  developer,
  txObserver,
  user
})

export default reducer
