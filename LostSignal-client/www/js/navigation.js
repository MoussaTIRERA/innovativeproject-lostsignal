var watchID;


function navigate() {
    var options = {
        frequency: 1000
    };
    watchID = navigator.compass.watchHeading(onSuccess1, onError1, options);

}

function onSuccess1(heading) {
    var distance = getDistance(Position.coords.latitude,Position.coords.longitude,bestLat,bestLng);
    if(distance < 20) {
        //alert("You are on the spot!");
        var onSpot = document.getElementById('destination');
        onSpot.innerHTML = 'You are on the spot!';
    }

    var nav = azimuth(Position.coords.latitude,Position.coords.longitude,bestLat,bestLng);


    var direction = Math.round(360-heading.magneticHeading-nav);
    var angle = document.getElementById('heading');
    var azim = document.getElementById('azimuth');
    var dist = document.getElementById('distance');

    angle.innerHTML = 'Heading:' + direction;
    azim.innerHTML = 'Azimuth:' + Math.round(nav);
    dist.innerHTML = 'Distance:' + distance + ' m' ;


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


function getDistance(x1,y1,x2,y2) {
    var dz=12756.274;
    var y, x, distance;
    y = (y2-y1)*Math.cos(x1*Math.PI/180.0);
    x = (x2-x1);
    distance = Math.sqrt(y*y+x*x)*Math.PI*dz/360.0;//[km]
    distance = Math.round((distance * 1000)); // conversion to meters
    return distance;
}

$(document).on( "click", '#runCompass', function() {
    if(bestPosition == null) {
        setTimeout(function(){
            actual_lat = Position.coords.latitude;
            actual_long = Position.coords.longitude;
            db_navigate.transaction(populateDB_searchNearestPoint, errorCB_nav, successCB);

        },3000);


        if(bestMarker != null)
            bestMarker.setMap(null);

        setTimeout(function() {
            var infowindow = new google.maps.InfoWindow({
                content: '<p style="color:black">Location found using HTML5.</p>' +
                '<p style="color:black">Actual position:' + bestPosition +'</p>' +
                '<p style="color:black">Date: ' + new Date() + '</p>'
                +'<p style="color:black">Signal strength: ' + signal + '</p>'
            });

            bestMarker = new google.maps.Marker({
                position: bestPosition,
                animation: google.maps.Animation.DROP,
                map: hmap,
                icon: 'img/bestPointImg.png'
            });
            google.maps.event.addListener(bestMarker, 'click', function() {
                infowindow.open(hmap,bestMarker);
            });
        }, 5000);
    }
    var onSpot = document.getElementById('destination');
    onSpot.innerHTML = '';
    alert("Calibrate Your compass then click 'Ok'");
    setTimeout(function(){
        navigate();
    },3000);
});