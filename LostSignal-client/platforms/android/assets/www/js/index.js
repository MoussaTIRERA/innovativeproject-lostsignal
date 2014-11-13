

var app = {
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, true);
        alert('znowu tez smiec nie chodzi...');
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');


        var deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) {
            alert("result = " + result);
        }, function() {
            alert("error");
        });

        var network = checkConnection();

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

        alert('UUID: ' + device.uuid + '\n' + 'Cordova: ' + device.cordova + '\n' + 'Model ' + device.model + '\n' + 'Platform: ' + device.platform +
        ' ' + 'Version: ' + device.version + '\nNetwork: ' + network);
        navigator.notification.vibrate(2500);
        navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
        var options = { frequency: 10000 };
        var wifi = navigator.wifi.watchAccessPoints(onSuccessCallBack, onErrorCallBack, options);
        window.MacAddress.getMacAddress(
            function(macAddress) {alert(macAddress);},function(fail) {alert(fail);}
        );
        alert('UUID: ' + cordova.plugins.uid.UUID + '\n IMEI: ' + cordova.plugins.uid.IMEI + '\n IMSI: ' + cordova.plugins.uid.IMSI +
        '\n ICCID: ' + cordova.plugins.uid.ICCID );


    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        alert('Received Event: ' + id);
    }
};

function checkConnection() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return states[networkState];
}

function onSuccessCallBack() {
    wifiinfo.getBSSID(
        function(BSSID) {
            alert('BSSID: ' + BSSID);
        },
        function() {
            alert('error');
        } );
    wifiinfo.getSSID(
        function(SSID) {
            alert('SSID: ' + SSID);
        },
        function() {
            alert('error');
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


function retBSSID() {

}



app.initialize();