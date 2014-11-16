var wifiinfo = {
  
    getBSSID: function (successCallback, errorCallback) {
        cordova.exec(successCallback, 
            errorCallback,
            "WifiInformation",
            "getBSSID",
            []
        );
    },
    
    getSSID: function (successCallback, errorCallback) {
        cordova.exec(successCallback,
            errorCallback,
            "WifiInformation",
            "getSSID",
            []
        ); 
    }
};

module.exports = wifiinfo;