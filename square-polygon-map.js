function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function initialize() {

  var top = getParameterByName('top') || 12.980802;
  var bottom = getParameterByName('bottom') || 12.973776;
  var left = getParameterByName('left') || 77.568855;
  var right = getParameterByName('right') || 77.574424;

  var mapOptions = {
    zoom: 10,
    center: new google.maps.LatLng(top, right)
  };

  var bermudaTriangle;

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Define the LatLng coordinates for the polygon's path.
  var triangleCoords = [
    new google.maps.LatLng(top, right),
    new google.maps.LatLng(top, left),
    new google.maps.LatLng(bottom, left),
    new google.maps.LatLng(bottom, right)
  ];

  // Construct the polygon.
  bermudaTriangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#0000FF',
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: '#0000FF',
    fillOpacity: 0.1
  });

  bermudaTriangle.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);