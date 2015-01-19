var ssid = '';
var bssid = '';
var data = '';
var obj = '';
var lastPostition;
var currentSignal;
var bestPosition;
var Position;



//global function to get signal strength
function getsignal(currentsignal) {
    window.signal = currentsignal;          //global variable used in getDatas
    //alert("signal power: " + signal);
}

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        get_data_from_serwer(myCallback);

        db_navigate = window.sqlitePlugin.openDatabase("Database", "1.0", "PhoneGap_db", 100);
        //callback from server
        function myCallback(result) {
            var reply = JSON.parse(result);
            for (var i=0; i<reply.length; i++) {
                data_to_navigate = "";
                data_to_navigate = reply[i].provider + ';' + reply[i].signal + ';' + reply[i].latitude + ';' +  reply[i].longitude;
                //alert("provider: " + reply[i].provider);
                //alert("signal: " + reply[i].signal);
                //alert("latitude: " + reply[i].latitude);
                //alert("longitude: " + reply[i].longitude);
                //alert(data_to_navigate);

            }

            map_initialize();           // app works better when maps are initialized here
            heatmap_populate();  //alert the heatmap that the points are ready

            heatmap_initialize();
            document.getElementById("navButt").disabled = false;
            document.getElementById("showmapButt").disabled = false;
        }


        cellularsignal.enable("getsignal");
        cellularsignal.disable();
        db = window.sqlitePlugin.openDatabase("Database", "1.0", "PhoneGap_db", 100);
        //db.transaction(populateDB, errorCB, successCB);

        var wifi = navigator.wifi.getAccessPoints(onSuccessCallBack, onErrorCallBack);

        //getDatas();
        setInterval(getDatas, 15000);

    },
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
//alert('Received Event: ' + id);
    }
};

function getDatas(signal) {
    var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");

    deviceInfo.get(function(result) {
        obj = result;
        //alert(result.account0Name);
        //alert("result = " + result);
        //alert(result.deviceId + '\n' + result.netCountry + '\n' + result.netName + '\n' + result.simNo);
        //alert(result["deviceID"] + '\n' + result["netCountry"] + '\n' + result["netName"] + '\n' + result["simNo"]);
    }, function() {
        alert("error");
    });

    function onSuccess1(heading) {
        alert('Heading: ' + heading.magneticHeading);
    };

    function onError1(error) {
        alert('CompassError: ' + error.code);
    };

    var options = {
        frequency: 1000
    }; // Update every 3 seconds

    //var watchID = navigator.compass.watchHeading(onSuccess1, onError1, options);


    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            cellularsignal.enable("getsignal");
            cellularsignal.disable();
            Position = position;
            lastPostition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            var lati = position.coords.latitude;
            var longi = position.coords.longitude;
            var network = checkConnection();
            data = position.coords.latitude + ';' + position.coords.longitude + ';' + device.model + ';' + device.uuid + ';' + bssid + ';' + ssid + ';'
            + cordova.plugins.uid.MAC + ';' + cordova.plugins.uid.IMEI + ';' + cordova.plugins.uid.IMSI + ';' + cordova.plugins.uid.ICCID + ';' + network + ';' +Math.floor(Date.now() / 1000) + ';' + window.signal;
            currentSignal = window.signal;
            data_to_navigate = "" + ';' + window.signal + ';' + position.coords.latitude + ';' + position.coords.longitude;
            db.transaction(populateDB, errorCB, successCB);
            db_navigate.transaction(populateDB_navigation, errorCB_nav, successCB);
            //alert("sprawdzenie->  " + data);

            setPointOnHeatmap(lati, longi, window.signal);
            setPointsOnMap(lati, longi, window.signal);
        }, handleNoGeolocation );
    } else {
        handleNoGeolocation();
        function onError() {
            alert('Brak zasięgu WiFi, pakietu oraz GPS!');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
}

function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI] = 'WiFi';
    states[Connection.CELL_2G] = '2G';
    states[Connection.CELL_3G] = '3G';
    states[Connection.CELL_4G] = '4G';
    states[Connection.CELL] = 'Cell';
    states[Connection.NONE] = 'No network connection';
    return states[networkState];
}
function onSuccessCallBack() {
    wifiinfo.getBSSID(
        function(BSSID) {
            bssid = BSSID;
        },
        function() {
        } );
    wifiinfo.getSSID(
        function(SSID) {
            ssid = SSID;
        },
        function() {
        } );
};
function onErrorCallBack() {
    alert('Network error!');
};

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

// background service button logic

$('select#flag').change(function() {

    var myswitch = $(this);
    var show     = myswitch[0].selectedIndex == 1 ? true:false;

    if(show) {
        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.configure({ text:'Lost signal background service'});
    }
    else {
        cordova.plugins.backgroundMode.disable();
        alert('off');
    }
});

function closeAPP() {
    alert("Closing application...");
    db_navigate.transaction(queryDB_cleanDatabaseNav, errorCB, successCB);
    db.transaction(queryDB_cleanDatabaseLost, errorCB, successCB);
    setTimeout(function() {
        navigator.app.exitApp();
        window.clearTimeout();
    },1000);
}


app.initialize();
