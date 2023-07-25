// store geojson url into variable called "url"
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// make the initial map object
let myMap = L.map("map", {
    center: [45.52, -122.67],
    zoom: 4
  });

// add tile layer (the background map image) to our map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// get data from json and add it to map
d3.json(queryUrl).then(function (data) {

    // function to get appropriate colors for the depth
    function markerColor(depth) {
        // conditional to determine the appropriate colors
        if (depth < 10) 
            return "lightgreen";
        else if (depth < 30) 
            return "greenyellow";
        else if (depth < 50)    
            return "yellow";
        else if (depth < 70) 
            return "orange";
        else if (depth < 90) 
            return "orangered";
        else 
            return "red";
    }

    // function to style features for markers
    function markerStyle(feature) {
        return {
            color: "black",
            // fill color passing in the depth data into markerColor function
            fillColor: markerColor(feature.geometry.coordinates[2]),
            // scale magnitude by a factor of 4 to make it easier to see on map
            radius: feature.properties.mag*4,
            weight: 0.7,
            opacity: .9,
            fillOpacity: .9
        };
    }

    // create pop-up data for each marker
    function  onEachFeature(feature, layer) {
        // choose which data you would like in the pop-up
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Depth: " + feature.geometry.coordinates[2] + "<br>Location: " + feature.properties.place + "<br>Time: " + Date(feature.properties.time))
    }

    // add data to map
    L.geoJson(data, {
        
        // call the onEachFeature function for pop-ups
        onEachFeature: onEachFeature,
        
        // call pointToLayer to spawn layers passing in feature and latlng
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        
        // call markerStyle function
        style: markerStyle,

    // add earthquake data to map
    }).addTo(myMap);
})
