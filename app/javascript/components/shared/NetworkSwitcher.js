import React from 'react';
import { NavDropdown, MenuItem } from 'react-bootstrap';

class NetworkSwitcher extends React.Component {

  constructor(props) {
    super(props);
    this.state = { switchingNetwork: false };
  }

  handleSelect(eventKey, event) {
    event.preventDefault();
    this.setState({switchingNetwork: true})
    window.keyTools.currentNetwork = eventKey;
    location.reload(); 
  }

  renderLoader(){
    return(
      <NavDropdown eventKey={7} title="Switching Network" id="networks-dropdown" className="network-switcher"></NavDropdown>
    )
  }

  render() {
    if (this.state.switchingNetwork) return this.renderLoader();
    const current_network = window.keyTools.currentNetwork;
    const networks = window.app_config.eth_networks.networks;

    return (
      <NavDropdown eventKey={7} title={networks[current_network].network_name} id="networks-dropdown" className={`network-switcher ${current_network}`} onSelect={(k,e) => this.handleSelect(k,e)}>
        {Object.keys(networks).map((key) => {
          return (<MenuItem key={networks[key].network_id} eventKey={key} className={key}>{networks[key].network_name}</MenuItem>)
        })}
      </NavDropdown>
    )
  }
}

export default NetworkSwitcher;
