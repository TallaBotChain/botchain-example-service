import React from 'react'
import {connect} from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

class Nav extends React.Component {

  signedInNav() {
    return ([
      <div className='menu-item'>Developer
        <ul className="submenu">
          <span className="triangle-up"></span>
          <li>
            <NavLink to="/">Register</NavLink>
          </li>
        </ul>
      </div>,
      <div className='menu-item'>{this.props.user.currentUser}
        <ul className="submenu">
          <span className="triangle-up"></span>
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
      <NavLink className='menu-item' to="/sign_up">Sign Up</NavLink>,
      <NavLink className='menu-item' to="/sign_in">Sign In</NavLink>
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
    developerRecord: state.developerRecord,
    auth: state.auth,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(Nav))
