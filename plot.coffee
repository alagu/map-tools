$(document).ready ->

  initialize =->
    mapDiv = document.getElementById("map-canvas")
    mapDim =
      height: mapDiv.clientHeight
      width: mapDiv.clientWidth

    mapOptions =
          center:
            lat: 23.5
            lng: 77
          zoom: 4
          panControl: true
          zoomControl: true
          scaleControl: true

    window.map = new google.maps.Map(mapDiv, mapOptions)

  google.maps.event.addDomListener window, "load", initialize

  add_marker = (title, lat, long, green)->
    myLatlng = new google.maps.LatLng(lat, long)
    marker = new google.maps.Marker(
      position: myLatlng
      map: window.map
      title: title
    )

    if green == true
      marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
    else
      marker.setIcon('http://maps.gstatic.com/mapfiles/markers2/measle.png')

    google.maps.event.addListener marker, "click", ->
      debugger
      $("#info-area").html(marker.title)
      return

  $("#plot-button").click ->
    csv = $("#plot-data")[0].value
    lines = csv.split("\n")
    for line, i in lines
      split_content = line.split(",")
      lat = split_content[0]
      long = split_content[1]
      title = split_content[2]
      if i == lines.length - 1
        add_marker(title, lat, long, true)
      else
        add_marker(title, lat, long)

    false
