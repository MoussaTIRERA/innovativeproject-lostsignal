var hmap, heatmap;
var pointArray;
var dataPoints = [

];

function heatmap_initialize() {

    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.HYBRID
    };

    //

    hmap = new google.maps.Map(document.getElementById('heatmap-canvas'),
        mapOptions);

    //setDatas();



    pointArray = new google.maps.MVCArray(dataPoints);

    heatmap = new google.maps.visualization.HeatmapLayer({
        map: hmap,
        data: pointArray
    });
    setInterval(getHeatInfo(),5000);
}

function heatmap_populate() {
    //add points from navigate_db to the heatmap
}

function setDatas() {

    // set connection with DB
    var record; // one record from DB

    /*for(var i = 0; i<ilosc_danych_z_bazy; i++) {
        var lati = latitude_from_DB;   // FLOAT
        var longi = longitude_from_DB;   // FLOAT
        var signal = signal_from_DB  // INTEGER
        var myLatlng = new google.maps.LatLng(lati,longi);
        dataPoints.push({location: myLatlng, weight: signal});
    }*/

    pointArray = new google.maps.MVCArray(dataPoints);
    heatmap.setData(pointArray);
}

function getHeatInfo() {

    alert("dodano");
    /*if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var myLatlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            //dataPoints.push({location: myLatlng, weight: currentSignal});
            dataPoints.push(myLatlng);
            pointArray = new google.maps.MVCArray(dataPoints);
            heatmap.setData(pointArray);

            var infowindow = new google.maps.InfoWindow({
                content: '<p style="color:black">Location found using HTML5.</p>' +
                '<p style="color:black">Actual position:' + myLatlng +'</p>' +
                '<p style="color:black">Date: ' + new Date() + '</p>'
                //+'<p style="color:black">Signal strength: ' + currentSignal + '</p>'
            });

            var marker = new google.maps.Marker({
                position: myLatlng,
                map: hmap
            });
            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(hmap,marker);
            });
            //hmap.setCenter(myLatlng);
        }, handleNoGeolocation);

    } else {
        handleNoGeolocation();

        var onSuccess = function(position) {

        };

        function onError() {
            alert('Brak zasięgu WiFi, pakietu oraz GPS!');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }*/
}