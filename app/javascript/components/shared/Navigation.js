import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import  NetworkSwitcher from './NetworkSwitcher';
import * as userActions from '../../actions/userActions'

class Navigation extends React.Component {

  componentDidMount(){
    this.props.checkAuth();
  }

  signedInNav() {
    return ([
      <ul className="nav navbar-nav" key={1}>
        <LinkContainer exact to="/">
          <NavItem eventKey={1}>Developer</NavItem>
        </LinkContainer>
        <LinkContainer exact to="/products">
          <NavItem eventKey={2}>Products</NavItem>
        </LinkContainer>
        <LinkContainer to="/wallet/ethereum">
          <NavItem eventKey={3}>Wallet</NavItem>
        </LinkContainer>
        <LinkContainer to="/settings">
          <NavItem eventKey={4}>Settings</NavItem>
        </LinkContainer>
        {window.keyTools.currentNetwork == 'kovan' &&
          <LinkContainer to="/about">
            <NavItem eventKey={5}>About</NavItem>
          </LinkContainer>
        }
        <LinkContainer to="/help">
          <NavItem eventKey={6}>Help</NavItem>
        </LinkContainer>
        <li className="visible-xs"></li>
      </ul>,
      <ul className="nav navbar-nav navbar-right" key={2}>
        <NetworkSwitcher/>
        <LinkContainer to="#" onClick={() => this.props.logOut()}>
          <NavItem >Sign Out</NavItem>
        </LinkContainer>
      </ul>
    ])
  }

  signedOutNav() {
    return ([
      <ul className="nav navbar-nav" key={1}>
        {window.keyTools.currentNetwork == 'kovan' &&
          <LinkContainer to="/about">
            <NavItem eventKey={5}>About</NavItem>
          </LinkContainer>
        }
        <LinkContainer to="/help">
          <NavItem eventKey={6}>Help</NavItem>
        </LinkContainer>
      </ul>,
      <ul className="nav navbar-nav navbar-right" key={2}>
        <NetworkSwitcher />
        <LinkContainer to="/sign_up">
          <NavItem eventKey={1}>Sign Up</NavItem>
        </LinkContainer>
        <LinkContainer to="/sign_in">
          <NavItem eventKey={2}>Sign In</NavItem>
        </LinkContainer>
      </ul>
    ])
  }
  render() {

    return (
      <Navbar inverse fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/"></a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          { this.props.user.signedIn ? this.signedInNav() : this.signedOutNav() }
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    wallet: state.wallet
  }
}

const mapDispatchToProps = dispatch => {
  return {
    checkAuth: () => {
      dispatch(userActions.checkAuth());
    },
    logOut: () => {
      dispatch(userActions.logOut());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Navigation))
