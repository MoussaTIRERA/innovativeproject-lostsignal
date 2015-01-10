var hmap, heatmap;
var pointArray;
var dataPoints = [    {location: new google.maps.LatLng(40.33,-111.57),weight: 15},
    {location: new google.maps.LatLng(47.68,-122.12),weight: 13},
    {location: new google.maps.LatLng(40.21,-111.61),weight: 8},
    {location: new google.maps.LatLng(42.73,-73.67),weight: 7},
    {location: new google.maps.LatLng(42.8,-73.92),weight: 7},
    {location: new google.maps.LatLng(39.87,-83.07),weight: 7},
    {location: new google.maps.LatLng(47.11,-88.56),weight: 7},
    {location: new google.maps.LatLng(55.95,-131.96),weight: 1}];

var triangleCoords = [
    new google.maps.LatLng(25.774, -80.190),
    new google.maps.LatLng(18.466, -66.118),
    new google.maps.LatLng(32.321, -64.757)
];



function heatmap_initialize() {

    db_navigate.transaction(queryDB_navigation, errorCB_nav_heatmap, successCB);

    var mapOptions = {
        center: new google.maps.LatLng(51.110022, 17.036365),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    hmap = new google.maps.Map(document.getElementById('heatmap-canvas'),
        mapOptions);

    pointArray = new google.maps.MVCArray(dataPoints);

    heatmap = new google.maps.visualization.HeatmapLayer({
        map: hmap,
        data: pointArray,
        radius:5,
        opacity: 0.5
    });
}

function heatmap_populate() {
    //add points from navigate_db to the heatmap
}

function setPointOnHeatmap(latitude, longitude, signal) {

    var myLatlng = new google.maps.LatLng(latitude,longitude);

    var infowindow = new google.maps.InfoWindow({
        content: '<p style="color:black">Location found using HTML5.</p>' +
        '<p style="color:black">Actual position:' + myLatlng +'</p>' +
        '<p style="color:black">Date: ' + new Date() + '</p>'
        +'<p style="color:black">Signal strength: ' + signal + '</p>'
    });

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: hmap
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(hmap,marker);
    });

    dataPoints.push({location: myLatlng, weight: signal});
    pointArray = new google.maps.MVCArray(dataPoints);
    heatmap.setData(pointArray);
}

function setTriangleCoord() {
    alert(lastPostition);
}

$(document).on( "click", '#navButton', function() {
    alert("Nawiguję...");
    search_nearest(lastPosition);

    var drawCircle = {
        strokeColor: 'black',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.35,
        map: hmap,
        center: lastPostition,
        radius: 10
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(drawCircle)
    var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };

    // Create the polyline and add the symbol via the 'icons' property.

    var lineCoordinates = [
        lastPostition,
        new google.maps.LatLng(51.130022, 17.036365)
    ];

    var line = new google.maps.Polyline({
        path: lineCoordinates,
        icons: [{
            icon: lineSymbol,
            offset: '100%'
        }],
        map: hmap
    });
});

$(document).on( "click", '#centerHeatmap', function() {
    hmap.setCenter(lastPostition);
});