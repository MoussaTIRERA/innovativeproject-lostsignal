var watchID;


function navigate() {
    var options = {
        frequency: 1000
    };
    watchID = navigator.compass.watchHeading(onSuccess1, onError1, options);

}

function onSuccess1(heading) {
    if(bestPosition == lastPostition)
        alert("Jestes u celu");

    var nav = azimuth(Position.coords.latitude,Position.coords.longitude,bestLat,bestLng);


    var direction = Math.round(360-heading.magneticHeading-nav);
    var angle = document.getElementById('heading');
    var azim = document.getElementById('azimuth');

    angle.innerHTML = 'Heading:' + direction;
    azim.innerHTML = 'Azimuth:' + Math.round(nav);


    $("#directionArrow").rotate(direction);
};

function onError1(error) {
    alert('CompassError: ' + error.code);
};

function azimuth(x1,y1,x2,y2) {
    var pi = 4.0*Math.atan(1.0);
    var rs = 180.0/pi;
    var a,az;

    x = x2-x1;
    y = y2-y1;

    if(x == 0) {
        if (y > 0)
            a = pi / 2;
        else
            a = 1.5*pi;
    }
    else {
        a = Math.atan(y/x);
        if(x < 0)
            a += pi;
        else {
            if(y<0)
                a += 2*pi;
        }
    }
    if(x != 0)
        az = a*rs;

    return az;
}

$(document).on( "click", '#runCompass', function() {
    if(bestPosition == null) {
        setTimeout(function(){
            actual_lat = Position.coords.latitude;
            actual_long = Position.coords.longitude;
            db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);

        },1000);
    }
    alert("Calibrate Your compass then click 'Ok'");
    setTimeout(function(){
        navigate();
    },3000);
});