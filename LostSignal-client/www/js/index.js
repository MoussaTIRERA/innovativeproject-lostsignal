var ssid = '';
var bssid = '';
var data = '';
var obj = '';
var lastPostition;
var currentSignal;

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

        get_data_from_serwer(myCallback, 1, 1);

        db_navigate = window.sqlitePlugin.openDatabase("Database", "1.0", "PhoneGap_db", 100);
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
                db_navigate.transaction(populateDB_navigation, errorCB_nav, successCB);
            }

            heatmap_populate();  //alert the heatmap that the points are ready
            map_initialize();           // app works better when maps are initialized here
            heatmap_initialize();
            document.getElementById("navButt").disabled = false;
            document.getElementById("showmapButt").disabled = false;
        }


        cellularsignal.enable("getsignal");
        cellularsignal.disable();
        db = window.sqlitePlugin.openDatabase("Database", "1.0", "PhoneGap_db", 100);
        //db.transaction(populateDB, errorCB, successCB);

        var wifi = navigator.wifi.getAccessPoints(onSuccessCallBack, onErrorCallBack);

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
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            cellularsignal.enable("getsignal");
            cellularsignal.disable();

            lastPostition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var network = checkConnection();
            data = position.coords.latitude + ';' + position.coords.longitude + ';' + device.model + ';' + device.uuid + ';' + bssid + ';' + ssid + ';'
            + cordova.plugins.uid.MAC + ';' + cordova.plugins.uid.IMEI + ';' + cordova.plugins.uid.IMSI + ';' + cordova.plugins.uid.ICCID + ';' + network + ';' + Date.now() + ';' + window.signal;
            currentSignal = window.signal;
            data_to_navigate = "" + ';' + window.signal + ';' + position.coords.latitude + ';' + position.coords.longitude;
            db.transaction(populateDB, errorCB, successCB);
            db_navigate.transaction(populateDB_navigation, errorCB_nav, successCB);
            //alert("sprawdzenie->  " + data);
        }, handleNoGeolocation );
    } else {
        handleNoGeolocation();
        function onError() {
            alert('Brak zasięgu WiFi, pakietu oraz GPS!');
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
}
// drop, create, insert into navigate table - table use to navigate user to point
function populateDB_navigation(tx) {
        var substr = data_to_navigate.split(';');
        var provider_db = substr[0];
        var signal_db = substr[1];
        var latitude_db = substr[2];
        var longitude_db = substr[3];
        //alert(provider_db + " " + signal_db + " " + latitude_db + " " + longitude_db);
        //tx.executeSql('DROP TABLE IF EXISTS navigation_table');
        tx.executeSql('CREATE TABLE IF NOT EXISTS navigation_table (id integer primary key, provider text, signal integer, latitude text, longitude text)');
        tx.executeSql('INSERT INTO navigation_table (provider, signal, latitude, longitude) VALUES (?,?,?,?)', [provider_db, signal_db, latitude_db, longitude_db]);
        //queryDB_navigation(tx);

}
// drop, create, insert into table - table to store coordinates and signal strength and send to server
function populateDB(tx) {
    //alert("into populate");
    var substr = data.split(';');
    var latitude_db = substr[0];
    var longitude_db = substr[1];
    var model_db = substr[2];
    var uuid_db = substr[3];
    var bssid_db = substr[4];
    var ssid_db = substr[5];
    var mac_db = substr[6];
    var imei_db = substr[7];
    var imsi_db = substr[8];
    var iccid_db = substr[9];
    var network_db = substr[10];
    var date_db = substr[11];
    var currentSignal_db = substr[12];

//alert(substr[0] + " " + substr[1]+ " " + substr[2]+ " " + substr[3]+ " " + substr[4]+ " " + substr[5]+ " " + substr[6]
//+ " " + substr[7]+ " " + substr[8]+ " " + substr[9]+ " " + substr[10]+ " " + substr[11]);
    tx.executeSql('DROP TABLE IF EXISTS lostsignal_table');
    tx.executeSql('CREATE TABLE IF NOT EXISTS lostsignal_table (id integer primary key, latitude text, longitude text, model text, uuid text, bssid text, ssid text, mac text, imei text, imsi text, iccid text, network text, date text, signal text)');
    tx.executeSql('INSERT INTO lostsignal_table (latitude, longitude, model, uuid, bssid, ssid, mac, imei, imsi, iccid, network, date, signal) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [latitude_db, longitude_db, model_db, uuid_db, bssid_db, ssid_db, mac_db, imei_db, imsi_db, iccid_db, network_db, date_db, currentSignal_db]);
    //queryDB(tx);
}

// form the query in populate_navigation
function queryDB_navigation(tx) {
    tx.executeSql("SELECT id, provider, signal, latitude, longitude from navigation_table;", [], querySuccess, errorCB_nav);
}

// form the query
function queryDB(tx) {
    tx.executeSql("SELECT id, latitude, longitude, model, uuid, bssid, ssid, mac, imei, imsi, iccid, network, date, signal from lostsignal_table;", [], createJSON, errorCB);
}

// Function to check database and display the results
//usage tx.executeSql("SELECT id from lostsignal_table;", [], querySuccess, errorCB); in queryDB
function querySuccess(tx, results) {
    var len = results.rows.length;
    //alert("results.rows.length: " + results.rows.length);
//results from database
    for (var i = 0; i < len; i++) { // loop as many times as there are row results
        //var record = "";
        var latitude = results.rows.item(i).latitude;
        var longitude = results.rows.item(i).longitude;
        var signal = results.rows.item(i).signal;
        //alert(results.rows.item(i).id);
        //alert(results.rows.item(i).latitude);
        //alert(results.rows.item(i).longitude);
        //record = results.rows.item(i).id + ';' + results.rows.item(i).latitude + ';' + results.rows.item(i).longitude + ';';
        setDatas(latitude, longitude, signal);
        //getFromDB(latitude, longitude, signal);
    }
}
// Function to create JSON from database tables
function createJSON(tx, results)
{
    var len = results.rows.length;
    //alert("results.rows.length: " + results.rows.length);
    var my_JSON_object = "";
    for (var i = 0; i < len; i++) { // loop as many times as there are row results
        my_JSON_object = my_JSON_object + JSON.stringify({id: results.rows.item(i).id, latitude: results.rows.item(i).latitude, longitude: results.rows.item(i).longitude, model: results.rows.item(i).model, uuid: results.rows.item(i).uuid, bssid: results.rows.item(i).bssid, ssid: results.rows.item(i).ssid,
            mac: results.rows.item(i).mac, imei: results.rows.item(i).imei, imsi: results.rows.item(i).imsi, iccid: results.rows.item(i).iccid, network: results.rows.item(i).network, date: results.rows.item(i).date, signal: results.rows.item(i).signal});
    }
    //alert(my_JSON_object);
    send_JSON_to_serwer(my_JSON_object);
}


//function to recive data from server- provider, coordinates and signal strength
function get_data_from_serwer(callback, lon, lat, provider)
{
    if (lon == null || lat == null) {
        alert('this should never happen');
        return;
    }

    var queryobject;
    if (provider == null) {
        queryobject = { longitude: lon, latitude: lat, provider: provider }
    } else {
        queryobject = { longitude: lon, latitude: lat }
    }

    //alert(my_JSON_object);
    $.ajax({
        type       : "GET",
        url        : "https://polar-falls-4829.herokuapp.com",
        data       : queryobject,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        success    : function(response) {
            //alert("Response " + response);
            var reply = JSON.stringify(response);
            callback(reply);
        },
        error      : function(response) {
            alert('Not working! Data cannot be received from server');
        }
    });
}


// Function to send JSON from database to server
//url actually is http://ip.jsontest.com just to check if it works
function send_JSON_to_serwer(my_JSON_object)
{
    //alert(my_JSON_object);
    $.ajax({
        type       : "POST",
        url        : "https://polar-falls-4829.herokuapp.com",
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : my_JSON_object,
        dataType   : 'json',
        success    : function(response) {
            //alert(JSON.stringify(response));
        },
        error      : function(response) {
            alert('Not working! Data cannot be send to server or wrong response from server');
        }
    });
}

// Transaction error callback
function errorCB(err) {
    alert("err_sending");
}
// Transaction error callback
function errorCB_nav(err) {
    alert("err_nav");
}
// Transaction error callback
function errorCB_nav_heatmap(err) {
    alert("err_nav_heatmap");
}
// Success error callback
function successCB() {
    //alert("success");
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


function refreshPage() {
    jQuery.mobile.pageContainer.pagecontainer('change', window.location.href, {
        allowSamePageTransition: true,
        transition: 'none',
        reloadPage: true
// 'reload' parameter not working yet: //github.com/jquery/jquery-mobile/issues/7406
    });
}
// Run it with .on
$(document).on( "click", '#refresh', function() {
    refreshPage();
});

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

$(document).on( "click", '#navButton', function() {
    alert("Nawiguję...");
});



app.initialize();
