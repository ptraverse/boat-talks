import React, { Component } from 'react';
import './ChatInput.css';
/* global L, JNC, $ */

export default class ChatInput extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <input type="text" placeholder="place-holder" />
    );
  }

}
