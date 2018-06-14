import React from 'react'
import {connect} from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

class Nav extends React.Component {

  signedInNav() {
    return ([
      <NavLink to="/" key={1}>Register</NavLink>,
      <div className='menu-item' key={2}>{this.props.user.currentUser}
        <b>&#8964;</b>
        <ul className="submenu">
          <span className="triangle-up"></span>
          <li><b>{this.props.wallet.tokenBalance}</b><br/>BOTC</li>
          <li>
            <NavLink to="/settings">Settings</NavLink>
          </li>
          <li>
            <NavLink to="/wallet">Wallet</NavLink>
          </li>
          <li>
            <NavLink to="/help">Help</NavLink>
          </li>
          <li>
            <a href="/sign_out" data-method="delete">Logout</a>
          </li>
        </ul>
      </div>
    ])
  }

  signedOutNav() {
    return ([
      <NavLink className='menu-item' to="/sign_up" key={1}>Sign Up</NavLink>,
      <NavLink className='menu-item' to="/sign_in" key={2}>Sign In</NavLink>
    ])
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
