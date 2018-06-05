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
              <NavLink to="/developer">Register</NavLink>
            </li>
          </ul>
        </div>
        <NavLink to="/faq">FAQ</NavLink>
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
