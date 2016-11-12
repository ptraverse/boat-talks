
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
  var webapi = new JNC.Views.BoatingNavionicsMap({
      zoom: 12,
      tagId: '#map_div',
      center: userCenter,
      navKey: 'Navionics_webapi_02834'
  });
  webapi.showSonarControl(false);
  
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