import React from 'react'
import {connect} from 'react-redux'
import { NavLink, withRouter } from 'react-router-dom'

class Nav extends React.Component {

  render() {

    return (
      <nav>
        <a href='/' className="logo">Botchain</a>
        <div className='menu-item'>Developer
          <ul className="submenu">
            <span className="triangle-up"></span>
            <li>
              <NavLink to="/developer">Register</NavLink>
            </li>
          </ul>
        </div>
        <div className='menu-item'>{window.app_config.current_user}
          <ul className="submenu">
          <span className="triangle-up"></span>
            <li>
              <NavLink to="/settings">Settings</NavLink>
            </li>
            <li>
              <NavLink to="/help">Help</NavLink>
            </li>
            <li>
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
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(Nav))
