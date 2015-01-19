var serverUrl = 'https://lostsignal.herokuapp.com';

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
// drop, create, insert into table - table to store coordinates, signal strength and other parameters and send to server
function populateDB(tx) {
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

    /*
     alert(substr[0] + " " + substr[1]+ " " + substr[2]+ " " + substr[3]+ " " + substr[4]+ " " + substr[5]+ " " + substr[6]
     + " " + substr[7]+ " " + substr[8]+ " " + substr[9]+ " " + substr[10]+ " " + substr[11]);
     */
    //tx.executeSql('DROP TABLE IF EXISTS lostsignal_table');
    tx.executeSql('CREATE TABLE IF NOT EXISTS lostsignal_table (id integer primary key, latitude text, longitude text, model text, uuid text, bssid text, ssid text, mac text, imei text, imsi text, iccid text, network text, date text, signal text, provider text)');
    tx.executeSql('INSERT INTO lostsignal_table (latitude, longitude, model, uuid, bssid, ssid, mac, imei, imsi, iccid, network, date, signal, provider) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [latitude_db, longitude_db, model_db, uuid_db, bssid_db, ssid_db, mac_db, imei_db, imsi_db, iccid_db, network_db, date_db, currentSignal_db, imsi_db.substr(0, 5)]);
    queryDB(tx);
}

function populateDB_searchNearestPoint(tx)
{
    queryDB_search(tx);
}

//function to drop navigation_table when app is closing
function dropTable_cleanDatabaseNav(tx)
{
    alert("cleaning navDatabase");
    tx.executeSql('DROP TABLE IF EXISTS navigation_table');
    queryDB_cleanNav(tx);
}

//function to drop lostsignal_table when app is closing
function dropTable_cleanDatabaseLost(tx)
{
    alert("Cleaning LostDatabase");
    tx.executeSql('DROP TABLE IF EXISTS lostsignal_table');
    queryDB_cleanLost(tx);
}

// form the query in populate_navigation- just to select everything from database
function queryDB_navigation(tx) {
    tx.executeSql("SELECT id, provider, signal, latitude, longitude from navigation_table;", [], querySuccess, errorCB_nav);
}

function queryDB_search(tx)  {
    alert("searching nearest point");
    tx.executeSql("SELECT * FROM navigation_table", [], nearestPoint, errorCB_nav);
}

function queryDB_cleanNav(tx)  {
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='navigation_table';", [], cleaned, errorCB_clean);
}

function queryDB_cleanLost(tx)  {
    tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='lostsignal_table';", [], cleaned, errorCB_clean);
}

// form the queryDB in populateDB- select everything from database
function queryDB(tx) {
    tx.executeSql("SELECT latitude, longitude from lostsignal_table;", [], createJSON, errorCB);
}

//Function return nearest point from actual position
function nearestPoint(tx, results){
    var len = results.rows.length;
    var minLat = results.rows.item(0).latitude;
    var minLong = results.rows.item(0).longitude;
    var minDistance = Math.sqrt(Math.pow(minLat - actual_lat, 2) + Math.pow(minLong - actual_long, 2));
    for (var i = 1; i < len; i++) {
        var latitude = results.rows.item(i).latitude;
        var longitude = results.rows.item(i).longitude;
        if(Math.sqrt(Math.pow(latitude - actual_lat, 2) + Math.pow(longitude - actual_long, 2)) < minDistance)
        {
            minLat = latitude;
            minLong = longitude;
        }
    }
    bestPosition = new google.maps.LatLng(minLat,minLong);
    alert(bestPosition);
    alert("Found nearest point");
}

//function to inform that table does not exists
function cleaned(tx, results) {
    var len = results.rows.length;
    if(len==0)
        alert("Database empty");
}

// Function to check database and display the results
//usage tx.executeSql("SELECT id from lostsignal_table;", [], querySuccess, errorCB); in queryDB
function querySuccess(tx, results) {
    var len = results.rows.length;
    //alert("results.rows.length: " + results.rows.length);
    for (var i = 0; i < len; i++) {
        var latitude = results.rows.item(i).latitude;
        var longitude = results.rows.item(i).longitude;
        var signal = results.rows.item(i).signal;
        setPointOnHeatmap(latitude, longitude, signal);
        setPointsOnMap(latitude, longitude, signal);
    }
}
// Function to create JSON from database tables
function createJSON(tx, results) {
    var len = results.rows.length;
    var items = [];
    for (var i = 0; i < len; i++) { // loop as many times as there are row results
        items.push(JSON.stringify(results.rows.item(i)));
    }
    //alert(my_JSON_object);
    send_JSON_to_serwer('[' + items.join(',') + ']');
}

//function to recive data from server- provider, coordinates and signal strength
function get_data_from_serwer(callback, lon, lat, provider) {
    // temporarily commented out for sending dump requests
    //if (lon == null || lat == null) {
    //    alert('this should never happen');
    //    return;
    //}

    var queryobject;
    if (provider == null) {
        queryobject = { longitude: lon, latitude: lat, provider: provider }
    } else {
        queryobject = { longitude: lon, latitude: lat }
    }

    //alert(my_JSON_object);
    $.ajax({
        type       : "GET",
        url        : serverUrl,
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
function send_JSON_to_serwer(my_JSON_object) {
    //alert(my_JSON_object);
    $.ajax({
        type       : "POST",
        url        : serverUrl,
        crossDomain: true,
        beforeSend : function() {$.mobile.loading('show')},
        complete   : function() {$.mobile.loading('hide')},
        data       : my_JSON_object,
        dataType   : 'json',
        contentType: 'application/json; charset=UTF-8',
        success    : function(response) {
            //alert(JSON.stringify(response));
        },
        error      : function(response) {
            alert('Not working! Data cannot be send to server or wrong response from server');
        }
    });
}

// Transaction error callback from database which store parameters
function errorCB(err) {
    alert("err_sending");
}
// Transaction error callback from database which store parameters
function errorCB_clean(err) {
    alert("err_cleaning");
}
// Transaction error callback from navigation_database
function errorCB_nav(err) {
    alert("err_nav");
}
// Transaction error callback from heatmap
function errorCB_nav_heatmap(err) {
    alert("err_nav_heatmap");
}
// Transaction error callback from heatmap
function errorCB_cleaning(err) {
    alert("can't clean database");
}
// Success callback
function successCB() {
}
// Success callback used in cleaning database
function successCB_cleanedDB() {
}