import React, { Component } from 'react';
import './Map.css';
/* global L, JNC, $ */

class Map extends Component {        
    
    constructor(props) {
        super(props);
        this.state = {            
            'lat': '',
            'lon': '',            
            'zoom': 10
        };
        this.watchID = null;
        this.getCenterObj = this.getCenterObj.bind(this);        
    }     

    getCenterObj() {
        return [this.state.lat, this.state.lon];
    }

    componentDidMount() {
      
        /*Initial Map Drawing START */
        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }        

        $('#map').focus();        
        var map = L.map('map');                    

        // only enable the navionics map on the domain the key is tied to
        if (window.location.href.indexOf('boat-talks-c9-nodejs-ptraverse.c9users.io') !== -1) {
            var overlay = new JNC.Leaflet.NavionicsOverlay({
                navKey: 'Navionics_webapi_02834',
                chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
                isTransparent: true,
                zIndex: 1
            });
            overlay.addTo(map);
        } else {
            var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
                maxZoom: 18,
                // attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            });
            OpenStreetMap_BlackAndWhite.addTo(map);
            //does this even work?
            var OpenSeaMap = L.tileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
                // attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors',
                opacity: 0.5
            });        
            OpenSeaMap.addTo(map);
        }
                
        navigator.geolocation.getCurrentPosition(            
            (position) => {              
                console.log('navigator got position!');  
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                console.log('getting center...: ');
                console.log(this.getCenterObj());
                map.setView(this.getCenterObj(), this.state.zoom);
                var selfMarker = L.AwesomeMarkers.icon({
                    icon: 'user',    
                    iconColor: 'white',
                    markerColor: 'cadetblue',
                    prefix: 'fa'
                });
                L.marker(this.getCenterObj(), {icon: selfMarker}).addTo(map);
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );                
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
                icon: 'user',    
                iconColor: 'cadetblue',
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
