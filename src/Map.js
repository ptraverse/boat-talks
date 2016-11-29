import React, { Component } from 'react';
import './Map.css'
/* global L, JNC, $ */

class Map extends Component {
    componentDidMount() {
      
        $('#map').focus();
      
        var userCenter = [49.1, -121.2];
        var zoom = 5;
          
        var map = L.map('map');
        map.setView(userCenter, zoom);
        
        var overlay = new JNC.Leaflet.NavionicsOverlay({
            navKey: 'Navionics_webapi_02834',
            chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
            isTransparent: false,
            zIndex: 1
        });
        overlay.addTo(map);
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
