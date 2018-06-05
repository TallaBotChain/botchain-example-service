import { combineReducers } from 'redux'
import { reducer as form } from 'redux-form'
import developer from './developer'
import txObserver from './txObserver'


const reducer = combineReducers({
  developer,
  txObserver
})

export default reducer
