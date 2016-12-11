import React, { Component } from 'react';
import Map from './Map.jsx';
// import NavBar from './NavBar.jsx';
// import logo from './logo.svg';
// import helm from './helm.svg';
import Appbar from 'muicss/lib/react/appbar';
import Button from 'muicss/lib/react/button';
// import Container from 'muicss/lib/react/container';
import './App.sass';
/* global io */

class App extends Component {

  componentDidMount() {
      var socket = io();
      socket.on('connect', function(){
         console.log('frontend socket.io connected from App component, identifying as foo');
         socket.emit('identify', 'foo');
      });
      socket.on('event', function(data){
        console.log('frontend socket.io event');
      });
      socket.on('disconnect', function(){
        console.log('frontend socket.io disconnected');
      });
  }

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
