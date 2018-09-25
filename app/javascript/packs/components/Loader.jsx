import React, { Component } from 'react';

export default (props) => ( props.visible ?
  <div class="lds-css ng-scope">
    <div class="lds-spinner">
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
