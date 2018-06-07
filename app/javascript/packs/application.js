/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


import React from 'react'
import { render } from 'react-dom'
import { createLogger } from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware  } from 'redux'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import rootReducer from './reducers'
import Developer from './containers/Developer'
import Nav from './components/shared/Nav'
import KeyTools from './blockchain/KeyTools'

const loggerMiddleware = createLogger()


let store = createStore(rootReducer, {}, applyMiddleware(thunkMiddleware, loggerMiddleware));

window.keyTools = new KeyTools('https://kovan.infura.io/quylRadtDHfbMF9rF15R');

if(document.getElementById('app')) {
    render(
        <Provider store={store}>
            <Router>
                <div>
                    <Nav />
                    <Switch>
                        <Route exact path="/" component={Developer}/>
                    </Switch>
                </div>
            </Router>
        </Provider>,
        document.getElementById('app')
    )
}
