import React, { Component } from 'react';
import {connect} from 'react-redux'

class HelpPage extends Component {


  render() {

    return (
      <div className="white-container">
        <div className='inner-container help'>
          <h1>Help</h1>
          <h3 className="green-text">
            Subhead
          </h3>
          <p>
            The main help content and documentation will go here.
            More content that is part of the help etc. will go here. Some latin text to fill it: Pharetra lorem at laoreet commodo. Proin non neque ac risus accumsan porttitor nec non metus. Aenean accumsan viverra hendrerit. Nullam porta, nunc porta ultricies pellentesque, ante leo bibendum leo, eu mollis purus sapien vel nulla.
          </p>
        </div>
        <div className="sidebar">
          <h3>Sidebar</h3>
          <ul>
            <li>
              <a href="">How to Register</a>
            </li>
            <li>
              <a href="">How to Submit Bot</a>
            </li>
            <li>
              <a href="">Developer Metadata</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default HelpPage;
