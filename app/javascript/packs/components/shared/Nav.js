import React from 'react'
import {connect} from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

class Nav extends React.Component {

  render() {

    return (
      <nav>
        <a href='/' className="logo">Botchain</a>
        <div className='menu-item'>Developer <b>&#8964;</b>
          <ul className="submenu">
            <li>
              <NavLink to="/">Register</NavLink>
            </li>
          </ul>
        </div>
        <div className='menu-item'>{this.props.user.currentUser} <b>&#8964;</b>
          <ul className="submenu">
            <li>
              <NavLink to="/settings">Settings</NavLink>
              <br/>
              <NavLink to="/wallet">Wallet</NavLink>
              <br/>
              <NavLink to="/help">Help</NavLink>
              <br/>
              <a href="/sign_out" data-method="delete">Logout</a>
            </li>
          </ul>
        </div>
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
