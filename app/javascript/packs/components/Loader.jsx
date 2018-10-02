import React, { Component } from 'react';

export default (props) => ( props.visible ?
  <div className="lds-css ng-scope">
    <div className="lds-spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    { props.message ? <span>{`${props.message}`}</span> : <div></div>}
  </div>  : <div></div>
);
