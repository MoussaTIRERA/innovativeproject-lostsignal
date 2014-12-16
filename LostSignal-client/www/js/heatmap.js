var hmap, heatmap;
var pointArray;
var dataPoints = [];

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
        data: pointArray
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

$(document).on( "click", '#navButton', function() {
    alert("Nawiguję...");

    var drawCircle = {
        strokeColor: 'black',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.35,
        map: hmap,
        center: lastPostition,
        radius: 100
    };
    // Add the circle for this city to the map.
    cityCircle = new google.maps.Circle(drawCircle)
});

$(document).on( "click", '#centerHeatmap', function() {
    hmap.setCenter(lastPostition);
});