import React, { Component } from 'react';
import './Map.css';
/* global L, JNC, $ */

class Map extends Component {        
    
    constructor(props) {
        super(props);
        this.state = {
            'center': [49.2, -123.5],
            'zoom': 10
        };
    }  


    componentDidMount() {
      
        /*Initial Map Drawing START */
        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }

        $('#map').focus();
              
        var skew = true;        
        if (skew) {
            var xAdj = 0.25;
            var yAdj = 0.5;
            this.state.center[0] = getRandom(this.state.center[0] - xAdj, this.state.center[0] + xAdj);
            this.state.center[1] = getRandom(this.state.center[1] - yAdj, this.state.center[1] + yAdj);
        }        
          
        var map = L.map('map');
        map.setView(this.state.center, this.state.zoom);        

        // only enable the navionics map on the domain the key is tied to
        if (window.location.href.indexOf('boat-talks-c9-nodejs-ptraverse.c9users.io') !== -1) {
            var overlay = new JNC.Leaflet.NavionicsOverlay({
                navKey: 'Navionics_webapi_02834',
                chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
                isTransparent: false,
                zIndex: 1
            });
            overlay.addTo(map);
        } else {
            var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
                maxZoom: 18,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            OpenStreetMap_BlackAndWhite.addTo(map);
            //does this even work?
            var OpenSeaMap = L.tileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
                attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            });        
            OpenSeaMap.addTo(map);
        }
        var selfMarker = L.AwesomeMarkers.icon({
                icon: 'user',    
                iconColor: 'blue',
                prefix: 'fa'
        });
        L.marker(this.state.center, {icon: selfMarker}).addTo(map);        
        /*Initial Map Drawing END */


        /* Socket.io interactions START*/
        var socket = io();
        socket.on('connect', function(){
            console.log('frontend socket.io connected from Map component, identifying as foo');                                    
        });
        socket.on('event', function(data){
            console.log('frontend socket.io event');
        });
        socket.on('move', function(data){
            console.log('frontend socket.io MOVE: ' + data.name + ' ' + data.lat + ' ' +  data.lon);
            var otherMarker = L.AwesomeMarkers.icon({
                icon: 'users',    
                iconColor: 'red',
                prefix: 'fa'
            });
            console.log('drawing other marker');
            L.marker([data.lat, data.lon], {icon: otherMarker}).addTo(map);            
            
        });
        socket.on('disconnect', function(){
            console.log('frontend socket.io disconnected');
        });
        /* Socket.io END */
    }
  
    render() {
        return (
            <div id="map">
            </div>
        );
    }

    
}

export default Map;
