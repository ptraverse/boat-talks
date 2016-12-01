import React, { Component } from 'react';
import './Map.css';
/* global L, JNC, $ */

class Map extends Component {        
    
    componentDidMount() {
      
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
        
        var base = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        base.addTo(map);

        console.log(JNC);
        console.log(JNC.Leaflet);
        console.log(JNC.Leaflet.NavionicsOverlay);

        var overlay = new JNC.Leaflet.NavionicsOverlay({
            navKey: 'Navionics_webapi_02834',
            chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
            isTransparent: false,
            zIndex: 1
        });
        overlay.addTo(map);

        // var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 19,
        //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        // });
        // OpenStreetMap_Mapnik.addTo(map);
        // var OpenSeaMap = L.tileLayer('http://t1.openseamap.org/seamark/{z}/{x}/{y}.png', {
        //     attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
        // });        
        // OpenSeaMap.addTo(map);

        L.marker(userCenter).addTo(map);
    }
  
    render() {
        return (
            <div id="map">
            </div>
        );
    }

    
}

export default Map;
