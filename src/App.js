import React, { Component } from 'react';
import Map from './Map';
// import NavBar from './NavBar';
// import logo from './logo.svg';
// import helm from './helm.svg';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
// import Container from 'muicss/lib/react/container';
import './App.sass';

class App extends Component {
  render() {
    return (
      <div className="App">        
          <Appbar>
            <div className="Appbar">      
              {/* <img src={helm} className="App-logo" alt="logo" /> */}
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
