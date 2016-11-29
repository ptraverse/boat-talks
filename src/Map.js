import React, { Component } from 'react';
import './Map.css'
/* global L, JNC, $ */

class Map extends Component {
    componentDidMount() {
      
        $('#map').focus();
      
        var userCenter = [49.2, -123.5];
        var zoom = 10;
          
        var map = L.map('map');
        map.setView(userCenter, zoom);
        
        // var overlay = new JNC.Leaflet.NavionicsOverlay({
        //     navKey: 'Navionics_webapi_02834',
        //     chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
        //     isTransparent: false,
        //     zIndex: 1
        // });
        // overlay.addTo(map);

        var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        });
        var OpenSeaMap = L.tileLayer('http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
            attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
        });
        OpenStreetMap_Mapnik.addTo(map);
        OpenSeaMap.addTo(map);

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
