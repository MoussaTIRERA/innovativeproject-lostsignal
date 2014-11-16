var macaddr = '';
var ssid = '';
var bssid = '';
var data = '';
var obj = '';


var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady, true);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        var wifi = navigator.wifi.getAccessPoints(onSuccessCallBack, onErrorCallBack);
        /*navigator.splashscreen.show();
        setTimeout(function() {
                    }, 10000);
*/
        window.plugin.backgroundMode.enable();
        getDatas();
        setInterval(getDatas, 10000);

        //var network = checkConnection();

        /*wifiinfo.getBSSID(
            function(BSSID) {
                alert('BSSID: ' + BSSID);
            },
            function() {
                alert('error');
            } );
        wifiinfo.getSSID(
            function(SSID) {
                alert('SSID: ' + SSID);            },
            function() {
                alert('error');
            } );
*/

        /*alert('UUID: ' + device.uuid + '\n' + 'Cordova: ' + device.cordova + '\n' + 'Model ' + device.model + '\n' + 'Platform: ' + device.platform +
        ' ' + 'Version: ' + device.version + '\nNetwork: ' + network);
        navigator.notification.vibrate(2500);
        navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
        var options = { frequency: 10000 };
        var wifi = navigator.wifi.watchAccessPoints(onSuccessCallBack, onErrorCallBack, options);
        window.MacAddress.getMacAddress(
            function(macAddress) {alert(macAddress);},function(fail) {alert(fail);}
        );
        alert('UUID: ' + cordova.plugins.uid.UUID + '\n IMEI: ' + cordova.plugins.uid.IMEI + '\n IMSI: ' + cordova.plugins.uid.IMSI +
        '\n ICCID: ' + cordova.plugins.uid.ICCID );*/


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


function getDatas() {


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


            //window.plugins.cellularsignal.enable();
            var network = checkConnection();
            getMac();

            data = position.coords.latitude + ';' + position.coords.longitude + ';' + device.model + ';' + device.uuid + ';' + bssid + ';' + ssid + ';'
            + cordova.plugins.uid.MAC + ';' + cordova.plugins.uid.IMEI + ';' + cordova.plugins.uid.IMSI + ';' + cordova.plugins.uid.ICCID + ';' + network + ';' + Date();

            //alert(macaddr);
        }, function() {
            handleNoGeolocation(true);
        });

    } else {
        handleNoGeolocation(false);
        function onError() {
            alert('Brak zasięgu WiFi, pakietu oraz GPS!');
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    if(data != '') {
        alert(data);
        //alert(obj);
    }

}


function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI]     = 'WiFi';
    states[Connection.CELL_2G]  = '2G';
    states[Connection.CELL_3G]  = '3G';
    states[Connection.CELL_4G]  = '4G';
    states[Connection.CELL]     = 'Cell';
    states[Connection.NONE]     = 'No';

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



function onSuccess(acceleration) {
    alert('Acceleration X: ' + acceleration.x + '\n' +
    'Acceleration Y: ' + acceleration.y + '\n' +
    'Acceleration Z: ' + acceleration.z + '\n' +
    'Timestamp: '      + acceleration.timestamp + '\n');
};

function onError() {
    alert('Acceleration error!');
};

function getMac() {
        window.MacAddress.getMacAddress(function (macAddress) {
            macaddr = macAddress;
        }, function (fail) {
            alert(fail);
        });
}
function refreshPage() {
    $.mobile.changePage(
        window.location.href,
        {
            allowSamePageTransition : true,
            transition              : 'none',
            showLoadMsg             : false,
            reloadPage              : true
        }
    );
}

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


app.initialize();