var map;
var parameters;
var row;

function map_initialize() {

    var mapOptions = {
        center: lastPostition,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };


    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    getFromDB();
    setInterval(getInfo(),5000);
//    map.setCenter(pos);

}

// Extract info from geoloc error or alert that no geoloc is available
function handleNoGeolocation(error) {
    if (error != null) {
        alert('Error: The Geolocation service failed. \n' +
              'code: ' + error.code + '\n' +
              'msg: ' + error.message);

    } else {
        alert('No geoloc service');
    }
}

function getInfo() {

    //getFromDB()  get and set markers from DB

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            //alert(currentSignal);
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
        }, handleNoGeolocation);

    } else {
        handleNoGeolocation();

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
