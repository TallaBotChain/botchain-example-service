import React, { Component }  from 'react';

class Tooltip extends Component {
  render() {
    return (
      <div className='tooltip1'>
        <div>
          <span></span>
          <div className='popup'>
            {this.props.children}
          </div>
        </div>
      </div>
      )
  }
}

export default Tooltip;
