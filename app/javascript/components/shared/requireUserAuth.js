import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Loader from '../Loader';

export default function requireUserAuth (WrappedComponent) {

  class UserAuth extends Component {

    render () {
  
      if (this.props.user.signedIn === false) {
        if (this.props.user.authChecked){
          return <Redirect to="/sign_in" />
        }
        else{
          return (
            <div className="white-container">
              <div className='inner-container help'>
                <Loader visible={true} message="Loading" />
              </div>
            </div>
          )
        }
      }

      return <WrappedComponent { ...this.props }/>

    }
  }
  
  const mapStateToProps = state => {
    return {
      user: state.user
    }
  }

  UserAuth = connect(mapStateToProps)(UserAuth)
  return UserAuth

}
