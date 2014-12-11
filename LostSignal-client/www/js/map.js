var map;
var parameters;
var startLatlng;
var row;

function initialize() {

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
        startLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

    }, function() {
        handleNoGeolocation(true);
    });


    var mapOptions = {
        center: startLatlng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };


    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);


    setInterval(getInfo(),5000);
//    map.setCenter(pos);

}

function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        alert('Error: The Geolocation service failed.');

    } else {
        alert('Error: The Geolocation service failed1.');
    }
}

function getInfo() {

    //getFromDB()  get and set markers from DB

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                position.coords.longitude);
            var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            var infowindow = new google.maps.InfoWindow({
                content: '<p style="color:black">Location found using HTML5.</p>' +
                '<p style="color:black">Actual position:' + pos +'</p>' +
                '<p style="color:black">Date: ' + new Date() + '</p>'
                //'<p style="color:black">Signal strength: ' + getSigStr() + '</p>'
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });


            var view1 = document.getElementById('position');
            var view2 = document.getElementById('date');

            parameters = position.coords.latitude + ' ' + position.coords.longitude;
            //alert(parameters);
            view1.innerHTML = parameters;
            view2.innerHTML = new Date();



            map.setCenter(pos);
        }, function() {
            handleNoGeolocation(true);
        });

    } else {
        handleNoGeolocation(false);

        var view1 = document.getElementById('position');

        var onSuccess = function(position) {
            parameters = position.coords.latitude +' ' + position.coords.longitude +' 1';

            view1.innerHTML = parameters;
        };

        function onError() {
            alert('Brak zasięgu WiFi, pakietu oraz GPS!');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }

}

function getFromDB() {

    // get coordinates and signal strength

    // set connection with DB

    var record; // get one record

    /*for(var i = 0; i<dlugosc_bazy; i++) {
        record = wynik_z_bazy;

        var myLatlng = new google.maps.LatLng(record.latitude,record.longitude);

        var infowindow = new google.maps.InfoWindow({
            content: '<p style="color:black">Location found using HTML5.</p>' +
            '<p style="color:black">Actual position:' + pos + '</p>' +
            '<p style="color:black">Date: ' + new Date() + '</p>'
            //'<p style="color:black">Signal strength: ' + getSigStr() + '</p>'
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map
        });
        google.maps.event.addListener(marker, 'click', function () {
            infowindow.open(map, marker);
        });

    }*/
}


google.maps.event.addDomListener(window, 'load', initialize);