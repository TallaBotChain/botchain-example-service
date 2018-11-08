import React from 'react'
import PropTypes from 'prop-types'

class Alerts extends React.Component {

  render() {
    let alertMessages = Array.isArray(this.props.alerts) ? this.props.alerts : (this.props.alerts ? [this.props.alerts] : []);
    let alert_type = this.props.alert_type ? this.props.alert_type : 'alert-info'
    return <div className={alertMessages.length > 0 ? alert_type : 'hidden'} >
      {alertMessages.map(function(message,index){
        return <p key={index}>{message}</p>;
      })}
    </div>
  }
}

Alerts.propTypes = {
  alerts: PropTypes.array,
  alert_type: PropTypes.string
};

export default Alerts;
