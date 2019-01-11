import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class NetworkSwitcher extends React.Component {

  handleSelect(eventKey, event) {
    event.preventDefault();
    window.keyTools.currentNetwork = eventKey;
    location.reload(); 
  }

  render() {
    const current_network = window.keyTools.currentNetwork;
    const networks = window.app_config.eth_networks.networks;

    return (
      <NavDropdown eventKey={7} title={networks[current_network].network_name} id="networks-dropdown" onSelect={(k,e) => this.handleSelect(k,e)}>
        {Object.keys(networks).map((key) => {
          return (<MenuItem key={networks[key].network_id} eventKey={key}> { networks[key].network_name}</MenuItem>)
        })}
      </NavDropdown>
    )
  }
}

export default NetworkSwitcher;
