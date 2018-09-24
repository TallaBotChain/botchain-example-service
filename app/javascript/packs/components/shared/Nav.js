import React from 'react'
import {connect} from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

class Nav extends React.Component {

  signedInNav() {
    return ([
      <div>
        <NavLink to="/" key={1}>Register</NavLink>
        <NavLink to="/wallet" key={2}>Wallet</NavLink>
        <NavLink to="/settings" key={3}>Settings</NavLink>
        <NavLink to="/help" key={4}>Help</NavLink>
      </div>,
      <div className="right-nav">
        <a href="/sign_out" data-method="delete">Sign Out</a>
      </div>
    ])
  }

  signedOutNav() {
    return (
      <div className="right-nav">
        <NavLink to="/sign_up" key={1}>Sign Up</NavLink>
        <NavLink to="/sign_in" key={2}>Sign In</NavLink>
      </div>
    )
  }
  render() {

    return (
      <nav>
        <a href='/' className="logo">Botchain</a>
        { this.props.user.signedIn ? this.signedInNav() : this.signedOutNav() }
      </nav>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    wallet: state.wallet
  }
}

export default withRouter(connect(mapStateToProps)(Nav))
