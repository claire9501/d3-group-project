// Add Techtonic Plate Later as an option
var techtonicLayer = L.layerGroup();
// Function: Add temperature data after clicking marker on map
async function techtonic() {
    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(techtonicData) {

        L.geoJSON(techtonicData, {
            color: 'orange',
            weight: 2
        }).addTo(techtonicLayer);
    })
};
techtonic();

// Clean box1 before loading new data. If not cleaned, clean again-- info will overlap if not. 
function cleanBox() {
    var svgArea = d3.select("div.viz").selectAll("*").remove();
    if (!svgArea.empty()) {
        svgArea.remove();
    };
    // console.log('cleaned.....')
};

// Function: Add temperature data after clicking marker on map
function update_data(d_lat) {
    d3.json(`site/update/${d_lat}`, function(d) {
        // console.log(d)
        var box1 = d3.select("div.viz");

        var tRow = box1.append("div").attr("class", "row");

        var tData = tRow.append("div").attr("class", "col").attr("id", "magnitude_info");
        tData.html(`<span class='mag_title'>MAGNITUDE</span><p class='mag-number'> ${d[3]['magnitude']} </p><div class='small_details'>City:  ${d[3]['city']}</div>`)

        var tData2 = tRow.append("div").attr("class", "col-7").attr("id", "weather_info");
        tData2.html(`<h3>Temperatures </h3>
        <ul> <li><p class='date'>${d[3]['date']['month_day_year']}</p>${d[3]['maxtemp']}° / ${d[3]['mintemp']}°    |    Avg: ${d[3]['avgtemp']}° <a href="#" class="tooltip-test" title="Day of Earthquake"><img src="../static/images/noun_Earthquake_709338.svg" width="20px" ></a></li>
        <li><p class='date'>${d[2]['date']['month_day_year']}</p>${d[2]['maxtemp']}° / ${d[2]['mintemp']}°    |    Avg: ${d[2]['avgtemp']}°</li>
        <li><p class='date'>${d[1]['date']['month_day_year']}</p>${d[1]['maxtemp']}° / ${d[1]['mintemp']}°    |    Avg: ${d[1]['avgtemp']}°</li>
        <li><p class='date'>${d[0]['date']['month_day_year']}</p>${d[0]['maxtemp']}° / ${d[0]['mintemp']}°    |    Avg: ${d[0]['avgtemp']}°</li></ul><br><span class='date'>(high/low)</span>
        `)

    });
};

// ###############################################################################
// Function: Generate Analysis Chart by map
async function analysisChart() {

    var svgWidth = 350;
    var svgHeight = 180;

    var margin = {
        top: 10,
        right: 5,
        bottom: 0,
        left: 50
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;



    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
        .select(".chart")
        .append("svg")
        .attr("width", 200)
        .attr("height", svgHeight);


    // Append an SVG group
    // Move graph group- holds everything besides svg area
    var chartGroup = svg.append("g")
        .attr("transform", `translate(60, 27)`)
        .attr("class", `group_chart`);



    // Initial Params
    var chosenXAxis = "magnitude";

    // function used for updating x-scale var upon click on axis label
    function xScale(eqdata, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
            .domain([d3.min(eqdata, d => d[chosenXAxis]) * .95,
                d3.max(eqdata, d => d[chosenXAxis])
                // d3.max(eqdata, d => d[chosenXAxis]) * 1.2
            ])
            .range([0, width]);

        return xLinearScale;

    }

    // function used for updating xAxis var upon click on axis label
    function renderAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);

        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);

        return xAxis;
    }

    // function used for updating circles group with a transition to
    // new circles
    function renderCircles(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
            .duration(1000)
            .attr("cx", d => newXScale(d[chosenXAxis]));

        return circlesGroup;
    }

    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, circlesGroup) {

        var label;

        // if (chosenXAxis === "magnitude") {
        //     label = "Magnitude:";
        // } else {
        //     label = " ";
        // }

        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`Magnitide: ${d.magnitude}<br>
                Temp Diff: ${d.difference}°`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
                toolTip.show(data);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
                toolTip.hide(data);
            });

        return circlesGroup;
    }
    // ##########################
    // Grid Lines
    // gridlines in x axis function
    function make_x_gridlines(xLinearScale) {
        return d3.axisBottom(xLinearScale)
            .ticks(8)
    }

    // gridlines in y axis function
    function make_y_gridlines(yLinearScale) {
        return d3.axisLeft(yLinearScale)
            .ticks(1)
    }


    d3.json(`site/chart`, function(eqdata) {
        console.log(eqdata);


        var data_array = eqdata;
        var percents_ = data_array[data_array.length - 1];
        console.log(percents_);

        // parse data
        eqdata.forEach(function(data) {
            data.difference = +data.difference;
            data.magnitude = +data.magnitude;

        });

        // xLinearScale function above csv import
        var xLinearScale = xScale(eqdata, chosenXAxis);

        // Create y scale function
        var yLinearScale = d3.scaleLinear()
            .domain([-15, d3.max(eqdata, d => d.difference)])
            .range([height, 0]);

        // ######################
        // Gridlines
        // add the X gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(60,197)")
            .call(make_x_gridlines(xLinearScale)
                .tickSize(-height)
                .tickFormat("")
            )

        // add the Y gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", "translate(60,27)")
            .call(make_y_gridlines(yLinearScale)
                .tickSize(-width)
                .tickFormat("")
            )


        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);


        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);



        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(eqdata)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d.difference))
            .attr("r", 2)
            .attr("fill", "#F3AD78")
            .attr("opacity", ".3");

        // Create group for two x-axis labels
        var labelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 10})`);

        var magnitudeLabel = labelsGroup.append("text")
            .attr("x", -75)
            .attr("y", 25)
            .attr("value", "magnitude") // value to grab for event listener
            .attr("color", "#083e66")
            .classed("axis-text", true)
            .text("Magnitude / All earthquakes");

        // append y axis
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 8 - margin.left)
            .attr("x", 10 - (height))
            .attr("dy", "1em")
            .classed("axis-text", true)
            .text("Temperature Difference");
        console.log(eqdata);


        // title
        chartGroup.append("text")
            .attr("y", -20)
            .attr("x", -30)
            .attr("dy", ".9em")
            .classed("axis-text", true)
            .text(`Day of Quake Temp. & 3 days before Temp. / Highest Temp Diff.`)

        // append up count
        chartGroup.append("text")
            .attr("y", 68)
            .attr("x", 190)
            .attr("dy", ".9em")
            .classed("axis-text", true)
            .text(`Above Zero: ${percents_["abovezeropercent"]}`)

        // append zero count
        chartGroup.append("text")
            .attr("y", 80)
            .attr("x", 190)
            .attr("dy", ".9em")
            .classed("axis-text", true)
            .text(`At Zero:    ${percents_["atzeropercent"]}`);
        chartGroup.append("text")
            .attr("y", 92)
            .attr("x", 190)
            .attr("dy", ".9em")
            .classed("axis-text", true)
            .text(`Below Zero:    ${percents_["belowzeropercent"]}`);
        // //A color scale
        // var colorScale = d3.scale.linear()
        //     .range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c",
        //         "#f9d057", "#f29e2e", "#e76818", "#d7191c"
        //     ]);
        // append initial circles
        // var colorScale2 = chartGroup.select("colorbar")
        //     .data(colorScale.range())
        //     .enter()
        //     .append("colorbar")
        //     .attr("cx", 100)
        //     .attr("cy", 50)
        //     .attr("offset", function(d, i) { return i / (colorScale.range().length - 1); })
        //     .attr("stop-color", function(d) { return d; });



        // //Append multiple color stops by using D3's data/enter step
        // chartGroup.selectAll("stop")
        //     .data(colorScale.range())
        //     .enter().append("stop")
        //     .attr("offset", function(d, i) { return i / (colorScale.range().length - 1); })
        //     .attr("stop-color", function(d) { return d; });


        // updateToolTip function above csv import
        var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

        // x axis labels event listener
        labelsGroup.selectAll("text")
            .on("click", function() {
                // get value of selection
                var value = d3.select(this).attr("value");
                if (value !== chosenXAxis) {

                    // replaces chosenXAxis with value
                    chosenXAxis = value;

                    // console.log(chosenXAxis)

                    // functions here found above csv import
                    // updates x scale for new data
                    xLinearScale = xScale(eqdata, chosenXAxis);

                    // updates x axis with transition
                    xAxis = renderAxes(xLinearScale, xAxis);

                    // updates circles with new x values
                    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                    // updates tooltips with new info
                    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                    // changes classes to change bold text
                    if (chosenXAxis === "num_albums") {
                        // albumsLabel
                        //     .classed("active", true)
                        //     .classed("inactive", false);
                        magnitudeLabel
                            .classed("active", false)
                            .classed("inactive", true);
                    } else {
                        // albumsLabel
                        //     .classed("active", false)
                        //     .classed("inactive", true);
                        magnitudeLabel
                            .classed("active", true)
                            .classed("inactive", false);
                    }
                }
            });
    })


};
analysisChart().then(result => {
    console.log(result); // This is not called because of the error
}).catch(error => {
    console.log(error); // Error: Oh dear! It's broken!
});


// ###############################################################################

// Function: Generate Facts 
function factsRow() {
    d3.json(`site/facts`, function(d) {
        // console.log(d)
        var box1 = d3.select("div#fact-boxes");

        var tRow = box1.append("div").attr("class", "row align-items-center");


        var tData = tRow.append("td").attr("class", "facts1").attr("id", "above6");
        tData.html(`<h1 id='facts'>0</h1> <h4>earthquakes<br>above 6.0</h4> `)

        var tData2 = tRow.append("td").attr("class", "facts1").attr("id", "highest_recorded_eq");
        tData2.html(`<span class='small_details'>magnitude of</span> <h1>${d[0].highest_magnitude}</h1><h4>in ${d[0]['highest_location']}<br>on ${d[0]['date']['month_day']} is the<br>highest recorded
        `)

    });
};
factsRow();

// Function: Generate table for latest earthquakes
function factsBoxesOpen() {
    d3.json(`site/factsLatestQuake`, function(d) {
        // console.log(d)
        var tbody = d3.select("#target-table-display");

        var tRow = tbody.append("tr").attr("class", "tr-data").attr("id", "");
        tRow.html(`<td>${d[0]['date']['month_day']}</td><td>${d[0]['country']}</td><td>${d[0]['region']}</td><td>${d[0]['magnitude']}</td><td>${d[0]['maxtemp']}</td><td>${d[0]['mintemp']}</td><td>${d[0]['avgtemp']}</td>`)
        var tRow = tbody.append("tr").attr("class", "tr-data").attr("id", "");
        tRow.html(`<td>${d[1]['date']['month_day']}</td><td>${d[1]['country']}</td><td>${d[1]['region']}</td><td>${d[1]['magnitude']}</td><td>${d[1]['maxtemp']}</td><td>${d[1]['mintemp']}</td><td>${d[1]['avgtemp']}</td>`)
        var tRow = tbody.append("tr").attr("class", "tr-data").attr("id", "");
        tRow.html(`<td>${d[2]['date']['month_day']}</td><td>${d[2]['country']}</td><td>${d[2]['region']}</td><td>${d[2]['magnitude']}</td><td>${d[2]['maxtemp']}</td><td>${d[2]['mintemp']}</td><td>${d[2]['avgtemp']}</td>`)
        var tRow = tbody.append("tr").attr("class", "tr-data").attr("id", "");
        tRow.html(`<td>${d[3]['date']['month_day']}</td><td>${d[3]['country']}</td><td>${d[3]['region']}</td><td>${d[3]['magnitude']}</td><td>${d[3]['maxtemp']}</td><td>${d[3]['mintemp']}</td><td>${d[3]['avgtemp']}</td>`)
        var tRow = tbody.append("tr").attr("class", "tr-data").attr("id", "");
        tRow.html(`<td>${d[4]['date']['month_day']}</td><td>${d[4]['country']}</td><td>${d[4]['region']}</td><td>${d[4]['magnitude']}</td><td>${d[4]['maxtemp']}</td><td>${d[4]['mintemp']}</td><td>${d[4]['avgtemp']}</td>`)




    });
};
factsBoxesOpen();



$(document).ready(function() {
    $('[data-toggle="tooltip"]').each(function() {
        new Tooltip($(this), {
            placement: 'top',
        });
    });
});

// API call for earthquake data
var data = d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson", function(data) {


    var features = data.features;
    var techtonicArray = [];
    var earthquakeMarkers = [];
    var heatArray = [];

    for (var i = 0; i < features.length; i++) {
        // create custom icon
        var earthquakeIcon = L.icon({
            iconUrl: '../static/images/noun_Earthquake_709338.svg',
            iconSize: [features[i].properties.mag * 6, features[i].properties.mag * 14], // size of the icon
            popupAnchor: [0, -15]
        });


        // create popup contents
        var customPopup = `<b>Location:</b> <context id='location'> ${features[i].properties.place} </context> <br> <b>Magnitude:</b>  <context id='magnitude'> ${features[i].properties.mag} </context> <hr> <p class='littledetails'>Lat: <context id='lat'>${features[i].geometry.coordinates[1]} </context>, Long:<context id='long'>${features[i].geometry.coordinates[0]}</context>, 
    
        <p>`;
        // Date: <context id='date'> ${timeConverter(features[i].properties.time)}, ${features[i].properties.time} </context>
        // specify popup options 
        var customOptions = {
            'maxWidth': '500',
            'className': getStyle(features[i].properties.mag)
        }

        function getStyle(d) {
            if (4.9 > d) {
                return 'custom';
            } else if (5.5 > d) {
                return 'custom2';
            } else if (d > 5.51) {
                return 'custom3';
            }
        };

        // loop through the cities array, create a new marker, push it to the cityMarkers array
        earthquakeMarkers.push(
            L.marker([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]], { icon: earthquakeIcon })
            .bindPopup(customPopup, customOptions)
            .on('click', function(d, i) {
                d = d3.select("div.leaflet-popup-content > #location").html();
                d2 = d3.select("div.leaflet-popup-content > #magnitude").html();
                d_lat = d3.select("p.littledetails > #lat").html();
                console.log(d_lat);
                cleanBox();
                update_data(d_lat);
                // analysisChart();
            })
        );

        if (location) {
            techtonicArray.push([]);
        }

        if (location) {
            heatArray.push([features[i].geometry.coordinates[1], features[i].geometry.coordinates[0]]);
        }
    };


    var earthquakeLayer = L.layerGroup(earthquakeMarkers);

    var heat = L.heatLayer(heatArray, {
        minOpacity: .20,
        radius: 55,
        blur: 20,
        max: 1.0
    });

    // Define variables for our tile layers
    var light = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        minZoom: 3,
        id: "light-v10",
        accessToken: API_KEY
    });

    var dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        minZoom: 3,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
        Light: light,
        Dark: dark
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
        'Earthquakes': earthquakeLayer,
        'Techtonic Plates': techtonicLayer,
        'Heat Map': heat
    };

    // Create map object and set default layers
    var myMap = L.map("map", {
        center: [34.0522, -118.2437],
        zoom: 4,
        zoomControl: false,
        passive: true,
        layers: [light, earthquakeLayer]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend ");


        var legendInfo = `<h2>${features.length}</h2> Earthquakes<br>/ 30 days`;

        div.innerHTML = legendInfo;

        div.innerHTML += " <br>Magnitude: <ul class='range1'> 4.5 - 4.9</ul><ul class='range2'> 5.0 - 5.5 </ul><ul class='range3'> 5.6+ </ul> ";
        return div;

    };
    // Adding legend to the map
    legend.addTo(myMap);


    L.control.zoom({
        position: 'bottomright'
    }).addTo(myMap);


    // ########################################
    // Water Mark
    // ##########################################
    L.Control.Watermark = L.Control.extend({
        onAdd: function(map) {
            var img = L.DomUtil.create('img');

            img.src = '../static/images/logo.png';
            img.style.width = '25px';

            return img;
        },
        onRemove: function(map) {
            // Nothing to do here
        }
    });
    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    }
    L.control.watermark({ position: 'topleft' }).addTo(myMap);


});