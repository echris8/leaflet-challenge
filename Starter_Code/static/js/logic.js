// We create the tile layer that will be the background of our map.
let basemap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'"
  );


// We create the map object.
let map = L.map("map", {
  center: [
    40.7, -94.5
  ],
  zoom: 3
});

// Then we add our 'basemap' tile layer to the map.
basemap.addTo(map);

// Here we make a call that retrieves our earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function determines the color of the marker based on the magnitude of the earthquake.
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#FF0000";
      case depth > 70:
        return "#FF4500";
      case depth > 50:
        return "#FFA500"; 
      case depth > 30:
        return "#FFF00";
      case depth > 10:
        return "#ADFF2F"; 
      default:
        return "#008000" 
    }
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 4;
  }

  // This function returns the style data for each of the earthquakes we plot on
  // the map. We pass the magnitude of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
        // USE STYLE ATTRIBUTES (e.g., opacity, fillOpacity, stroke, weight) 
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag)
    };
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    
    // We create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place
    );
    }
  }).addTo(map);

// Create a legend control object.
let legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  let div = L.DomUtil.create("div", "info legend");

  // Nice Legend formatting found at https://codepen.io/haakseth/pen/KQbjdO - a classmate shared this resource wtih me after discussing the project
  // The CSS to get this to work was also found there
  div.innerHTML += "<h4>Depth</h4>";
  div.innerHTML += '<i style="background: #FF0000"></i><span>>90  </span><br>';
  div.innerHTML += '<i style="background: #FF4500"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #FFA500"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #FFFF00"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #ADFF2F"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #008000"></i><span><10</span><br>';
  return div;
};

// Finally, we add our legend to the map.
legend.addTo(map);
});