/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware  } from 'redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import rootReducer from '../reducers'
import Developer from '../containers/Developer'
import ProductsContainer from '../containers/products/ProductsContainer'
import NewProduct from '../containers/products/NewProduct'
import Settings from '../containers/Settings'
import Help from '../containers/Help'
import About from '../containers/About'
import SignUp from '../containers/SignUp'
import SignIn from '../containers/SignIn'
import WalletBotcoin from '../containers/WalletBotcoin'
import WalletEthereum from '../containers/WalletEthereum'
import Navigation from '../components/shared/Navigation'
import KeyTools from '../blockchain/KeyTools'
import requireUserAuth from '../components/shared/requireUserAuth';

const loggerMiddleware = createLogger()

window.keyTools = new KeyTools();

let initialState = {
  user: {
    currentUser: '',
    signedIn: false,
    inProgress: false,
    errors: [],
    alerts: [],
    encryptedMnemonic: null,
    ethAddress: null,
    authChecked: false
  }
};

let store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware, loggerMiddleware));

if(document.getElementById('app')) {
  render(
    <Provider store={store}>
      <Router>
        <div>
          <Navigation />
          <Route exact path="/" component={requireUserAuth(Developer)}/>
          <Route exact path="/products" component={requireUserAuth(ProductsContainer)} />
          <Route path="/products/new" component={requireUserAuth(NewProduct)} />
          <Route path="/settings" component={requireUserAuth(Settings)}/>
          <Route path="/about" component={About} />
          <Route path="/help" component={Help}/>
          <Route path='/sign_up' component={SignUp} />
          <Route path='/sign_in' component={SignIn} />
          <Route path='/wallet/botcoin' component={requireUserAuth(WalletBotcoin)} />
          <Route path='/wallet/ethereum' component={requireUserAuth(WalletEthereum)} />
        </div>
      </Router>
    </Provider>,
    document.getElementById('app')
  )
}
