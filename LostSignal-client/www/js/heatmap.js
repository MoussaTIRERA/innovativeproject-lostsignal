var hmap, heatmap;
var pointArray;
var dataPoints = {
    max: 8,
    points: []
};


function heatmap_initialize() {
    db_navigate.transaction(queryDB_navigation, errorCB_nav_heatmap, successCB);

    var mapOptions = {
        center: new google.maps.LatLng(51.110022, 17.036365),
        zoom: 13
        //mapTypeId: google.maps.MapTypeId.HYBRID
    };

    hmap = new google.maps.Map(document.getElementById('heatmap-canvas'),
        mapOptions);

    //pointArray = new google.maps.MVCArray(dataPoints);

    /*heatmap = new google.maps.visualization.HeatmapLayer({
        map: hmap,
        data: pointArray,
        radius:5,
        opacity: 0.5
    });
    google.maps.event.addListener(hmap, 'dblclick', function()
    {
        navigate();
    });*/

    heatmap = new HeatmapOverlay(map,
        {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 100,
            "maxOpacity": 50,
            // scales the radius based on map zoom
            "scaleRadius": true,
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'lat',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'lng',
            // which field name in your data represents the data value - default "value"
            valueField: 'count'
        }
    );

    var testData = {
        data: [{lat: 51.110022, lng:17.036365, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
};

heatmap.setData(testData);
}

function heatmap_populate() {
    //add points from navigate_db to the heatmap
}

function setPointOnHeatmap(latitude, longitude, signal) {

    var myLatlng = new google.maps.LatLng(latitude,longitude);

    /*var infowindow = new google.maps.InfoWindow({
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
    })*/;

    dataPoints.points.push({lat: latitude, lng: longitude, count: signal});
    //pointArray = new google.maps.MVCArray(dataPoints);
    heatmap.setData(dataPoints);
}

$(document).on( "click", '#navButton', function() {
    setTimeout(function(){
        actual_lat = Position.coords.latitude;
        actual_long = Position.coords.longitude;
        db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);
    },3000);
});

$(document).on( "click", '#navButt', function() {


    alert("For navigate You need to click 'Get best point' button and then double click on the map. Thanks for patience.");
    screen.lockOrientation('landscape');
    setTimeout(function(){
        screen.unlockOrientation();
        window.clearTimeout();
    },1000);
});


$(document).on( "click", '#centerHeatmap', function() {
    hmap.setCenter(lastPostition);
});