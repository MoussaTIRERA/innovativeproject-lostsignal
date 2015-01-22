var watchID;
var direction;
var szczecin = new google.maps.LatLng(53.4200000, 14.5877800);
var warszawa = new google.maps.LatLng(52.2604880, 21.0210514);

function navigate() {
    var options = {
        frequency: 2000
    };
    watchID = navigator.compass.watchHeading(onSuccess1, onError1, options);

}




function onSuccess1(heading) {
    if(bestPosition == lastPostition)
        alert("Jestes u celu");

    var nav = azimuth(Position.coords.latitude,Position.coords.longitude,bestLat,bestLng);

    //var nav = google.maps.geometry.spherical.computeHeading(lastPostition,bestPosition).toFixed(2);
    direction = heading.magneticHeading-nav;
    var angle = document.getElementById('heading');
    angle.innerHTML = 'Heading:' + direction;
    $("#directionArrow").rotate(direction);
};

function onError1(error) {
    alert('CompassError: ' + error.code);
};

var options = {
    frequency: 2000
};

function azimuth(x1,y1,x2,y2) {
    var x = x2-x1;
    var y = y2-y1;
    var result = Math.atan2(x,y)*200.0/Math.PI;
    if(result<0)
        result +=400.0;
    return result;
}




$(document).on( "click", '#runCompass', function() {
    if(bestPosition == null) {
        setTimeout(function(){
            actual_lat = Position.coords.latitude;
            actual_long = Position.coords.longitude;
            db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);

        },1000);
    }
    setTimeout(function(){
        navigate();
    },3000);
});