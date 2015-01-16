getParameterByName = (name) ->
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  results = regex.exec(location.search)
  (if results is null then "" else decodeURIComponent(results[1].replace(/\+/g, " ")))
getBoundsZoomLevel = (bounds, mapDim) ->
  latRad = (lat) ->
    sin = Math.sin(lat * Math.PI / 180)
    radX2 = Math.log((1 + sin) / (1 - sin)) / 2
    Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2
  zoom = (mapPx, worldPx, fraction) ->
    Math.floor Math.log(mapPx / worldPx / fraction) / Math.LN2
  WORLD_DIM =
    height: 256
    width: 256

  ZOOM_MAX = 21
  ne = bounds.getNorthEast()
  sw = bounds.getSouthWest()
  latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI
  lngDiff = ne.lng() - sw.lng()
  lngFraction = ((if (lngDiff < 0) then (lngDiff + 360) else lngDiff)) / 360
  latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction)
  lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction)
  Math.min latZoom, lngZoom, ZOOM_MAX
initialize = ->
  top = getParameterByName("top") or 12.980802
  bottom = getParameterByName("bottom") or 12.973776
  left = getParameterByName("left") or 77.568855
  right = getParameterByName("right") or 77.574424

  # Define the LatLng coordinates for the polygon's path.
  triangleCoords = [
    new google.maps.LatLng(top, right)
    new google.maps.LatLng(top, left)
    new google.maps.LatLng(bottom, left)
    new google.maps.LatLng(bottom, right)
  ]
  latlngbounds = new google.maps.LatLngBounds()
  i = 0

  while i < triangleCoords.length
    latlngbounds.extend triangleCoords[i]
    i++
  mapDiv = document.getElementById("map-canvas")
  mapDim =
    height: mapDiv.clientHeight
    width: mapDiv.clientWidth

  mapOptions =
    zoom: getBoundsZoomLevel(latlngbounds, mapDim)
    center: latlngbounds.getCenter()

  squarePolygon = undefined
  map = new google.maps.Map(mapDiv, mapOptions)

  # Construct the polygon.
  squarePolygon = new google.maps.Polygon(
    paths: triangleCoords
    strokeColor: "#0000FF"
    strokeOpacity: 0.7
    strokeWeight: 1
    fillColor: "#0000FF"
    fillOpacity: 0.1
  )
  squarePolygon.setMap map
  return
google.maps.event.addDomListener window, "load", initialize
