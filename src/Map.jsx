import React, { Component } from 'react';
import './Map.css';
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
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
        /* END HTML5 Geolocation */

        /* Socket.io interactions START*/
        socket.on('connect', () => {
            console.log('frontend - connected from Map component');
        });
        socket.on('event', function(data){
            console.log('frontend - received event');
        });
        socket.on('move', function(data){
            console.log('frontend - received MOVE');
            // let otherMarker = L.AwesomeMarkers.icon({
            //     icon: 'user',
            //     iconColor: 'white',
            //     markerColor: 'cadetblue',
            //     prefix: 'fa'
            // });
            // L.marker([data.lat, data.lon], {icon: otherMarker}).addTo(map);
        });
        socket.on('rosterUpdate', function(data) {
            console.log('frontend - received roster update!');
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
            console.log('i dont have this naymore');
            console.log(this);
            let name = this.getName();
            _.each(data, function(index, sock) {
                console.log('adding socket from roster: ');
                console.log(index);
                console.log(socket);
                let markerCenter = [sock.lat, sock.lon];
                if (sock.name == name) {
                    let icon = {
                      icon: selfMarker
                    }
                } else {
                    let icon = {
                      icon: otherMarker
                    }
                }
                L.marker(markerCenter, icon).addTo(map);
            });
        });
        socket.on('disconnect', function(){
            console.log('frontend - disconnecting');
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
