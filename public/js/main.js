var socket = io.connect();

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
  
  var userCenter = [ crd.latitude, crd.longitude ];
  var zoom = 15;
  
  var map = L.map('map_div');
  map.setView(userCenter, zoom);
  
  var overlay = new JNC.Leaflet.NavionicsOverlay({
      navKey: 'Navionics_webapi_02834',
      chartType: JNC.NAVIONICS_CHARTS.NAUTICAL,
      isTransparent: false,
      zIndex: 1
  });
  overlay.addTo(map);
  L.marker(userCenter).addTo(map);
  
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

function drawMarker(lat, lon) {
  console.log('before drawing marker');
  var map = L.map('map_div');
  var marker = L.marker([lat, lon]);
  console.log(map);
  marker.addTo(map);
  console.log('after drawing marker');
  
  return false;
}


socket.on('server event', function (data) {
  console.log(data);
  socket.emit('client event', { socket: 'io' });
});

var socketEmitClientEven = function(data) {
  socket.emit('client event', data); 
}

getLocation();