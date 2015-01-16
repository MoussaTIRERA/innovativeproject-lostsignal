var hmap, heatmap;
var pointArray;
var dataPoints = [];
var orientation = 0;


function heatmap_initialize() {
    orientation = 0;
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
    google.maps.event.addListener(hmap, 'dblclick', function()
    {
        navigate();
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
    actual_lat = Position.coords.latitude;
    actual_long = Position.coords.longitude;
    db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);
});

$(document).on( "click", '#navButt', function() {


    alert("For navigate You need to click 'Get best point' button and then double click on the map. Thanks for patience.");
    screen.lockOrientation('landscape');
    setTimeout(function(){screen.unlockOrientation();},1000);
});


$(document).on( "click", '#centerHeatmap', function() {
    hmap.setCenter(lastPostition);
});