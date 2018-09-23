import React, { Component } from 'react';
import Tooltip from '../form/Tooltip';
import { Link } from 'react-router-dom'

class MetadataTooltip extends Component {

  render() {
    return (
      <Tooltip {...this.props} >
        Learn more about <a href="/faq#question_7" target="_blank">hosting your own Developer Metadata</a>.
      </Tooltip>
    );
  }
}

export default MetadataTooltip;
