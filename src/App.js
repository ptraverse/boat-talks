import React, { Component } from 'react';
import Map from './Map'
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>BOAT TALKS</h2>
        </div>
        <Map/>
      </div>
    );
  }
}

export default App;
