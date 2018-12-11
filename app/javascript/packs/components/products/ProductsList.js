import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

class ProductsList extends Component {
  
  render() {
    return (<div>
      <h1>BotChain Products</h1>
      <Table striped hover>
        <thead>
          <tr>
            <th>ETH Address</th>
            <th>Product Name</th>
            <th>Date Registered</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.props.products.list.map((row, i) => (
            <tr key={i}>
              <td>{row.eth_address}</td>
              <td>{row.name}</td>
              <td>{row.created_at}</td>
              <td>{row.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>)
  }
}

ProductsList.propTypes = {
  products: PropTypes.object.isRequired
};

export default ProductsList;
