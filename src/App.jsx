import React, { Component } from 'react';
import Map from './Map.jsx';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
import './App.sass';

class App extends Component {

  render() {
    return (
      <div className="App">
          <Appbar>
            <div className="Appbar">
              <Button color="primary">Map</Button>|
              <Button color="primary">Chat</Button>|
              <Button color="primary">Profile</Button>
            </div>
          </Appbar>
          <Map/>
      </div>
    );
  }
}

export default App;
