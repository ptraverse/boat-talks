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

        function getRandom(min, max) {
          return Math.random() * (max - min) + min;
        }

        console.log("START Navigator Geolocation");
        navigator.geolocation.getCurrentPosition(
            (position) => {
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
                console.log('double cheking setState worked: ');
                console.log(this.getCenterObj());
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        console.log("END Navigator Geolocation");

        this.getCenterObj = this.getCenterObj.bind(this);
    }

    getCenterObj() {
        return [this.state.lat, this.state.lon];
    }

    componentWillMount() {
        console.log('START component will mount');
        console.log('END component will mount');
    }

    componentDidMount() {

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
        // draw the map centered on user loc.
        map.setView(this.getCenterObj(), this.state.zoom);
        var selfMarker = L.AwesomeMarkers.icon({
            icon: 'user',
            iconColor: 'white',
            markerColor: 'cadetblue',
            prefix: 'fa'
        });
        L.marker(this.getCenterObj(), {icon: selfMarker}).addTo(map);
        /*Initial Map Drawing END */


        /* Socket.io interactions START*/
        var socket = io();
        socket.on('connect', () => {
            console.log('frontend socket.io connected from Map component, identifying as foobar, moving');
            var center = this.getCenterObj();
            var data = {
                'lat': center[0],
                'lon': center[1]
            };
            console.log('latbug !?');
            console.log(JSON.stringify(center));
            console.log(JSON.stringify(data));
            socket.emit('move', data);
        });
        socket.on('event', function(data){
            console.log('frontend socket.io event');
        });
        socket.on('move', function(data){
            console.log('frontend socket.io MOVE');
            console.log(JSON.stringify(data));
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
