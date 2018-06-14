/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "babel-polyfill"

import React from 'react'
import { render } from 'react-dom'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware  } from 'redux'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import rootReducer from './reducers'
import Developer from './containers/Developer'
import Settings from './containers/Settings'
import Help from './containers/Help'
import SignUp from './containers/SignUp'
import SignIn from './containers/SignIn'
import Wallet from './containers/Wallet'
import Nav from './components/shared/Nav'
import KeyTools from './blockchain/KeyTools'

const loggerMiddleware = createLogger()

window.keyTools = new KeyTools(window.app_config.geth_rpc);

let initialState = {
    user: {
        currentUser: window.app_config.current_user,
        signedIn: (window.app_config.current_user!=''),
        inProgress: false,
        errors: [],
        encryptedMnemonic: (window.app_config.encrypted_mnemonic),
        eth_address: (window.app_config.eth_address)
    }
};

let store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware, loggerMiddleware));

if(document.getElementById('app')) {
    render(
        <Provider store={store}>
            <Router>
                <div>
                    <Nav />
                    <Route exact path="/" component={Developer}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/help" component={Help}/>
                    <Route path='/sign_up' component={SignUp} />
                    <Route path='/sign_in' component={SignIn} />
                    <Route path='/wallet' component={Wallet} />
                </div>
            </Router>
        </Provider>,
    document.getElementById('app')
    )
}
