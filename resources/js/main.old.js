var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

function success(pos) {
  var crd = pos.coords;

  console.log('Your current position is:');
  console.log('Latitude : ' + crd.latitude);
  console.log('Longitude: ' + crd.longitude);
  // console.log('More or less ' + crd.accuracy + ' meters.');
  
  var userCenter = [ crd.longitude, crd.latitude ];
  var zoom = 14;
  var map = L.map('map_div');
  map.setView(userCenter, zoom);
  var overlay = new JNC.Leaflet.LeafletNavionicsOverlay({
      navKey: 'Navionics_webapi_02834',
      chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
      isTransparent: true,
      zIndex: 1
  });
  overlay.addTo(map);

  // var leafletOverlayNauticalNonTransparent = L.map('nautical-non-transparent-map-container');
  // leafletOverlayNauticalNonTransparent.setView(coord, zoom);
  // (new JNC.Leaflet.NavionicsOverlay({
  //     navKey: 'Navionics_webapi_02834',
  //     chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
  //     isTransparent: false,
  //     zIndex: 1
  // })).addTo(leafletOverlayNauticalNonTransparent);
  // L.marker(coord).addTo(leafletOverlayNauticalNonTransparent);

};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

getLocation();