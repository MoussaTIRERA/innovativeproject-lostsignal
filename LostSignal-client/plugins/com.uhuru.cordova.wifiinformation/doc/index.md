<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# com.uhuru.cordova.wifiinformation

This cordova plugin allows to get information specific to the wifi connection.

## Installation

    cordova plugin add https://github.com/aoltra/WifiInformation

## Supported Platforms

- Android

# WifiInfo

> The `wifiinfo` object provides information about the wifi connection.

## Functions

- wifiinfo.getBSSID()

### Quick Example

    function getBSSID() {

        var networkState = navigator.connection.type;

        if (networkState == Connection.WIFI) {
            wifiinfo.getBSSID(
                function(BSSID) { 
                    console.log("BSSID: " + BSSID); 
                },
                function(error) { 
                    console.log("Error wifiinfo: " + error); 
                } );   
        }

    }



> This example uses the org.apache.cordova.network-information plugin
