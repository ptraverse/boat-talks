import React, { Component } from 'react';
import './Map.css';
/* global L, JNC, $ */

class Map extends Component {

    constructor(props) {
        super(props);
        this.state = {
            'lat': '49.15',
            'lon': '-123.2',
            'zoom': 10
        };

        this.getCenterObj = this.getCenterObj.bind(this);
    }

    getCenterObj() {
        return [this.state.lat, this.state.lon];
    }

    componentDidMount() {
        var socket = io();

        /*Initial Map Drawing START */
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
            });
            OpenStreetMap_BlackAndWhite.addTo(map);
            var OpenSeaMap = L.tileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
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
                var skew = true;
                if (skew) {
                    var xAdj = 0.25;
                    var yAdj = 0.5;
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
                var selfMarker = L.AwesomeMarkers.icon({
                    icon: 'user',
                    iconColor: 'white',
                    markerColor: 'blue',
                    prefix: 'fa'
                });
                // move map to actual user center location
                map.setView(this.getCenterObj(), this.state.zoom);
                L.marker(this.getCenterObj(), {icon: selfMarker}).addTo(map);
                var center = this.getCenterObj();
                var data = {
                  'lat': center[0],
                  'lon': center[1]
                };
                // broadcast move to everyone else
                socket.emit('move', data);
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        console.log("END Navigator Geolocation");
        /* END HTML5 Geolocation */

        /* Socket.io interactions START*/
        socket.on('connect', () => {
            console.log('frontend connected from Map component');
        });
        socket.on('event', function(data){
            console.log('frontend received event');
        });
        socket.on('move', function(data){
            console.log('frontend received MOVE');
            var otherMarker = L.AwesomeMarkers.icon({
                icon: 'user',
                iconColor: 'white',
                markerColor: 'cadetblue',
                prefix: 'fa'
            });
            L.marker([data.lat, data.lon], {icon: otherMarker}).addTo(map);
        });
        socket.on('disconnect', function(){
            console.log('frontend disconnected');
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
