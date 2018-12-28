import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Row, Col } from 'react-bootstrap';
import moment from 'moment';
import { Link } from 'react-router-dom';

class ProductsList extends Component {
  
  render() {
    return (<div>
      <Row>
        <Col sm={8}>
          <h1 className='green-text'>BotChain Products</h1>
        </Col>
        <Col sm={4}>
          <Link to='/products/new' className="orange-button cta-button pull-right">Register Product</Link>
        </Col>
      </Row>
      <Table striped hover>
        <thead>
          <tr>
            <th>Product ETH Address</th>
            <th>Product Name</th>
            <th>Date Registered</th>
            <th>Transaction</th>
          </tr>
        </thead>
        <tbody>
          {this.props.products.allIds.map((eth_address, i) => (
            <tr key={i}>
              <td>{this.props.products.byAddress[eth_address].eth_address}</td>
              <td>{this.props.products.byAddress[eth_address].name}</td>
              <td>{moment(this.props.products.byAddress[eth_address].created_at).format('MMM Do YYYY')}</td>
              <td><a href={`https://kovan.etherscan.io/tx/${this.props.products.byAddress[eth_address].create_bot_product_tx}`} target='_blank' rel='noreferrer noopener'>View in Etherscan</a></td>
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
