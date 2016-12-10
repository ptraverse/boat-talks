import React, { Component } from 'react';
import './Map.css';
/* global L, JNC, $ */

class Map extends Component {        
    
    componentDidMount() {
      
        /*Initial Map Drawing START */
        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }

        $('#map').focus();
      
        var userCenter = [49.2, -123.5];
        var skew = true;        
        if (skew) {
            var xAdj = 0.25;
            var yAdj = 0.5;
            userCenter[0] = getRandom(userCenter[0] - xAdj, userCenter[0] + xAdj);
            userCenter[1] = getRandom(userCenter[1] - yAdj, userCenter[1] + yAdj);
        }
        var zoom = 10;
          
        var map = L.map('map');
        map.setView(userCenter, zoom);        

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

        L.marker(userCenter).addTo(map);
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
