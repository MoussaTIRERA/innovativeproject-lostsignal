var map;

function map_initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(51.110022, 17.036365),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
}

function setPointsOnMap(latitude,longitude, signal) {

    var myLatlng = new google.maps.LatLng(latitude,longitude);

    var infowindow = new google.maps.InfoWindow({
        content: '<p style="color:black">Location found using HTML5.</p>' +
        '<p style="color:black">Actual position:' + myLatlng + '</p>' +
        '<p style="color:black">Date: ' + new Date() + '</p>'
        +'<p style="color:black">Signal strength: ' + signal + '</p>'
    });
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });
    google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
    });
}

$(document).on( "click", '#centerMap', function() {
    map.setCenter(lastPostition);
});

$(document).on( "click", '#showmapButt', function() {

    screen.lockOrientation('landscape');
    setTimeout(function(){screen.unlockOrientation();},1000);
});