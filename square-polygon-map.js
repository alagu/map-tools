function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getBoundsZoomLevel(bounds, mapDim) {
    var WORLD_DIM = { height: 256, width: 256 };
    var ZOOM_MAX = 21;

    function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }

    function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
    }

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

    var lngDiff = ne.lng() - sw.lng();
    var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

    var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
    var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

    return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

function initialize() {

  var top = getParameterByName('top') || 12.980802;
  var bottom = getParameterByName('bottom') || 12.973776;
  var left = getParameterByName('left') || 77.568855;
  var right = getParameterByName('right') || 77.574424;

  
  // Define the LatLng coordinates for the polygon's path.
  var triangleCoords = [
    new google.maps.LatLng(top, right),
    new google.maps.LatLng(top, left),
    new google.maps.LatLng(bottom, left),
    new google.maps.LatLng(bottom, right)
  ];


  var latlngbounds = new google.maps.LatLngBounds();
  for (var i = 0; i < triangleCoords.length; i++) {
    latlngbounds.extend(triangleCoords[i]);
  }

  var mapDiv = document.getElementById('map-canvas');
  var mapDim = { height: mapDiv.clientHeight, width: mapDiv.clientWidth };

  var mapOptions = {
    zoom: getBoundsZoomLevel(latlngbounds, mapDim),
    center: latlngbounds.getCenter()
  };

  var squarePolygon;


  var map = new google.maps.Map(mapDiv, mapOptions);

  // Construct the polygon.
  squarePolygon = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: '#0000FF',
    strokeOpacity: 0.7,
    strokeWeight: 1,
    fillColor: '#0000FF',
    fillOpacity: 0.1
  });

  squarePolygon.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);