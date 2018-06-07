import React, { Component } from 'react';
import {connect} from 'react-redux'

class HelpPage extends Component {


  render() {

    return (
      <div>
        <div>
          <h1>Help</h1>
          <div className="centered">
            <h3 >Item #1</h3>
          </div>
          <div className="centered">
            <h3 >Item #2</h3>
          </div>
          <div className="centered">
            <h3 >Item #3</h3>
          </div>
        </div>
      </div>
    )
  }
}

export default HelpPage;
