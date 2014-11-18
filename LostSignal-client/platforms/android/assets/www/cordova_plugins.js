cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.vliesaputra.deviceinformation/www/deviceinformation.js",
        "id": "com.vliesaputra.deviceinformation.DeviceInformation",
        "clobbers": [
            "cordova.plugins.deviceInformation"
        ]
    },
    {
        "file": "plugins/nl.nielsad.cordova.wifiscanner/www/AccessPoint.js",
        "id": "nl.nielsad.cordova.wifiscanner.AccessPoint",
        "clobbers": [
            "AccessPoint"
        ]
    },
    {
        "file": "plugins/nl.nielsad.cordova.wifiscanner/www/WifiScanner.js",
        "id": "nl.nielsad.cordova.wifiscanner.wifi",
        "clobbers": [
            "navigator.wifi"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/Acceleration.js",
        "id": "org.apache.cordova.device-motion.Acceleration",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/accelerometer.js",
        "id": "org.apache.cordova.device-motion.accelerometer",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "file": "plugins/com.badrit.MacAddress/www/MacAddress.js",
        "id": "com.badrit.MacAddress.MacAddress",
        "clobbers": [
            "window.MacAddress"
        ]
    },
    {
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "id": "com.pylonproducts.wifiwizard.WifiWizard",
        "runs": true
    },
    {
        "file": "plugins/org.hygieiasoft.cordova.uid/www/uid.js",
        "id": "org.hygieiasoft.cordova.uid.uid",
        "clobbers": [
            "cordova.plugins.uid"
        ]
    },
    {
        "file": "plugins/com.uhuru.cordova.wifiinformation/www/wifiinfo.js",
        "id": "com.uhuru.cordova.wifiinformation.wifiinfo",
        "clobbers": [
            "wifiinfo"
        ]
    },
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundService.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService"
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.background-mode/www/background-mode.js",
        "id": "de.appplant.cordova.plugin.background-mode.BackgroundMode",
        "clobbers": [
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.IbcCellularSignal/www/cellularsignal.js",
        "id": "com.phonegap.plugins.IbcCellularSignal.cellularsignal",
        "clobbers": [
            "cellularsignal"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.splashscreen/www/splashscreen.js",
        "id": "org.apache.cordova.splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/com.brodysoft.sqlitePlugin/www/SQLitePlugin.js",
        "id": "com.brodysoft.sqlitePlugin.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.vliesaputra.deviceinformation": "1.0.1",
    "nl.nielsad.cordova.wifiscanner": "0.0.1",
    "org.apache.cordova.device-motion": "0.2.10",
    "org.apache.cordova.device": "0.2.12",
    "org.apache.cordova.geolocation": "0.3.10",
    "org.apache.cordova.network-information": "0.2.13",
    "org.apache.cordova.vibration": "0.3.11",
    "com.badrit.MacAddress": "0.1.0",
    "com.pylonproducts.wifiwizard": "0.2.6",
    "org.hygieiasoft.cordova.uid": "1.1.0",
    "com.uhuru.cordova.wifiinformation": "0.1.2",
    "com.red_folder.phonegap.plugin.backgroundservice": "2.0.0",
    "de.appplant.cordova.plugin.background-mode": "0.5.0",
    "com.phonegap.plugins.IbcCellularSignal": "0.1.0",
    "org.apache.cordova.splashscreen": "0.3.4",
    "com.brodysoft.sqlitePlugin": "1.0.3"
}
// BOTTOM OF METADATA
});