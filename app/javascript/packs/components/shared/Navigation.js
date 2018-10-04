import React from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

class Navigation extends React.Component {

  signedInNav() {
    return ([
      <Nav>
        <LinkContainer exact to="/" key={1}>
          <NavItem eventKey={1}>Register</NavItem>
        </LinkContainer>
        <LinkContainer to="/wallet/ethereum" key={2}>
          <NavItem eventKey={2}>Wallet</NavItem>
        </LinkContainer>
        <LinkContainer to="/settings" key={3}>
          <NavItem eventKey={3}>Settings</NavItem>
        </LinkContainer>
        <LinkContainer to="/help" key={4}>
          <NavItem eventKey={4}>Help</NavItem>
        </LinkContainer>
        <li className="visible-xs"></li>
      </Nav>,
      <Nav pullRight>
        <LinkContainer to="/sign_out" data-method="delete">
          <NavItem >Sign Out</NavItem>
        </LinkContainer>
      </Nav>
    ])
  }

  signedOutNav() {
    return (
      <Nav pullRight>
        <LinkContainer to="/sign_up" key={1}>
          <NavItem eventKey={1}>Sign Up</NavItem>
        </LinkContainer>
        <LinkContainer to="/sign_in" key={2}>
          <NavItem eventKey={2}>Sign In</NavItem>
        </LinkContainer>
      </Nav>
    )
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

export default withRouter(connect(mapStateToProps)(Navigation))
