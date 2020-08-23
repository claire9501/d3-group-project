// var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-07-05T07:00&endtime=2019-07-06T07:00&minmagnitude=5"
// var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2010-01-09T07:00&endtime=2010-01-10T07:00&minmagnitude=4"
// var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2010-04-04T07:00&endtime=2010-04-05T07:00&minmagnitude=5"
var url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2011-03-11T00:00&endtime=2011-03-12T00:00&minmagnitude=6"

d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array

    // // create custom icon
    // var earthquakeIcon = L.icon({
    //      iconUrl: '../../static/images/noun_Earthquake_709338.svg',
    //      iconSize: [38, 95], // size of the icon
    // //     popupAnchor: [0, -15]
    //  });
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(quakes, points) {
            return L.marker(points)
        },
        onEachFeature: function(quakes, points) {
            points.bindPopup("<h3>" + quakes.properties.place + " | Magnitude " + quakes.properties.mag +
                "</h3><hr><p>" + new Date(quakes.properties.time) + "</p>");
        }
    });
    // var temps_data = "../../data/py/CA_temps_2019Jul05.json";
    // var temps_data = "../../data/py/CA_temps_2010Jan09.json";
    // var temps_data = "../../data/py/CA_temps_2010Apr04.json";
    var temps_data = "../static/Jap_temps_2011Mar11.json";

    d3.json(temps_data, function(response) {

        console.log(response);
        var markers = []
        for (var i = 0; i < response.length; i++) {
            var lat = response[i].Latitude;
            var lon = response[i].Longitude;

            if (location) {
                markers.push([lat, lon, response[i].Temp_Difference * 100]);
            }
        }
        var temps = L.heatLayer(markers, {
            radius: 28,
            blur: 35
        })
        createMap(earthquakes, temps);
    });
}

function createMap(earthquakes, temps) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        Temperatures: temps
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap2 = L.map("ronamap", {
        center: [
            // 37, -120
            38, 140
        ],
        zoom: 7,
        // maxZoom: 8,
        layers: [streetmap, earthquakes, temps]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap2);

    var legend = L.control({ position: 'bottomright' })
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend2')
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "blue",
            "cyan",
            "lime",
            "yellow",
            "orange",
            "red"
        ];
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i>" +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + "<br>" : '+');
        }
        return div;
        return div
    };
    legend.addTo(myMap2);

}