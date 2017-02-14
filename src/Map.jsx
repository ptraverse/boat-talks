import React, { Component } from 'react';
import './Map.css';
import ReactDOMServer from 'react-dom/server';
import ChatInput from './ChatInput.jsx'
/* global L, JNC, $ */

class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      'name': Math.floor((Math.random() * 100) + 1),
      'lat': '49.15',
      'lon': '-123.2',
      'zoom': 10
    };

    this.getCenterObj = this.getCenterObj.bind(this);
    this.getName = this.getName.bind(this);
  }

  getCenterObj() {
    return [this.state.lat, this.state.lon];
  }

  getName() {
    return this.state.name;
  }

  componentDidMount() {
    const socket = io();

    /*Initial Map Drawing START */
    $('#map').focus();
    let map = L.map('map');

    let foo = function() {
      alert('bar and foo!!');
    };

    // only enable the navionics map on the domain the key is tied to
    if (window.location.href.indexOf('boat-talks-c9-nodejs-ptraverse.c9users.io') !== -1) {
      let overlay = new JNC.Leaflet.NavionicsOverlay({
        navKey: 'Navionics_webapi_02834',
        chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
        isTransparent: true,
        zIndex: 1
      });
      overlay.addTo(map);
    } else {
      let OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
        maxZoom: 18,
      });
      OpenStreetMap_BlackAndWhite.addTo(map);
      let OpenSeaMap = L.tileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'NOT TO BE USED FOR NAVIGATION',
        opacity: 0.5
      });
      OpenSeaMap.addTo(map);
    }
    // draw the map initially centered on hardcoded location.
    map.setView(this.getCenterObj(), this.state.zoom);
    /*Initial Map Drawing END */

    /* START HTML5 Geolocation */
    function getRandom(min, max) {
      return Math.random() * (max - min) + min;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // add skew, for developing socket on a single machine
        let skew = true;
        if (skew) {
          let xAdj = 0.25;
          let yAdj = 0.5;
          this.setState({
            lat: getRandom(position.coords.latitude - xAdj, position.coords.latitude + xAdj),
            lon: getRandom(position.coords.longitude - yAdj, position.coords.longitude + yAdj)
          });
        } else {
          this.setState({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        }

        // move map to actual user center location
        map.setView(this.getCenterObj(), this.state.zoom);

        /* Identify with location */
        console.log('frontend - identifying with location as ' + this.state.name);
        let data = this.state;
        socket.emit('identifyWithLocation', data);
      },
      (error) => {
        alert('ERROR: FUCK  YOU GOOGLE' + JSON.stringify(error));
        console.log('ERROR FUCK YOU GOOGLE!');
        console.log(error);
        //FUCK YOU GOOGLE
        this.setState({
          lat: getRandom(48.427 - 0.5, 48.427 + 0.5),
          lon: getRandom(-123.38 - 0.25, -123.38 + 0.25)
        });
        map.setView(this.getCenterObj(), this.state.zoom);
        let data = this.state;
        socket.emit('identifyWithLocation', data);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
    /* END HTML5 Geolocation */

    /* Socket.io interactions START*/
    socket.on('connect', () => {
      console.log('frontend - connected from Map component');
    });
    socket.on('event', (data) => {
      console.log('frontend - received event');
    });
    socket.on('move', (data) => {
      console.log('frontend - received MOVE');
    });
    let name = this.state.name;
    console.log('letnamethisname is : ');
    console.log(name);
    socket.on('rosterUpdate', (data) => {
      console.log('frontend - received roster update!');
      let boats = new L.layerGroup();
      // Remove all existing boats
      map.eachLayer(function (layer) {
        // Keep the tile layers
        if (layer._leaflet_id != 22 && layer._leaflet_id != 24) {
          map.removeLayer(layer);
        }
      });

      let otherMarker = L.AwesomeMarkers.icon({
          icon: 'user',
          iconColor: 'white',
          markerColor: 'cadetblue',
          prefix: 'fa'
      });
      let selfMarker = L.AwesomeMarkers.icon({
          icon: 'user',
          iconColor: 'white',
          markerColor: 'blue',
          prefix: 'fa'
      });
      // Go through Roster and add markers to layer
      _.each(data, (sock) => {
        let markerCenter = [sock.lat, sock.lon];
        let selfIcon = L.AwesomeMarkers.icon({
          icon: 'user',
          iconColor: 'white',
          markerColor: 'cadetblue',
          prefix: 'fa'
        });
        let othersIcon = L.AwesomeMarkers.icon({
          icon: 'user',
          iconColor: 'white',
          markerColor: 'blue',
          prefix: 'fa'
        });
        let marker;
        if (sock.name == this.state.name) {
          marker = L.marker(markerCenter, {icon: selfIcon});
        } else {
          marker = L.marker(markerCenter, {icon: othersIcon});
        }
        // TODO use a react component here to do a chat form!
        // let popupContents = '<button onClick="">Chat</button></a>';
        // marker.bindPopup(popupContents, {
        //   showOnMouseOver: true
        // });
        var chatInput = ReactDOMServer.renderToStaticMarkup(React.createElement(ChatInput));
        marker.bindPopup(chatInput, {
          showOnMouseOver: true
        });
        //add marker to Markers
        marker.addTo(boats);
      });
      boats.addTo(map);
    });
    socket.on('disconnect', () => {
      console.log('frontend - disconnecting');
    });
    /* Socket.io END */
  } /* componentDidMount END */

  render() {
    return (
      <div id="map">
      </div>
    );
  }

}

export default Map;
