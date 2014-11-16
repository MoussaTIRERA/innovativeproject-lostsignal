package com.uhuru.cordova.wifiinformation;  
  
import org.apache.cordova.CallbackContext;  
import org.apache.cordova.CordovaPlugin;  
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaInterface;
import org.json.JSONArray;  
import org.json.JSONException;  
import org.json.JSONObject;  
import android.net.wifi.WifiManager;
import android.net.wifi.WifiInfo;
import android.content.Context;

import android.util.Log;
  
public class WifiInformation extends CordovaPlugin {  
  
	private static final String LOG_TAG = "WifiInformation";

	public static final String ACTION_BSSID = "getBSSID";
    public static final String ACTION_SSID = "getSSID";

 	private interface WifiOp {
        void run() throws Exception;
    }

    private Context context;

	/**
	 * Executes the request and returns whether the action was valid.
	 *
	 * @param action 			The action to execute.
	 * @param args 				JSONArray of arguments for the plugin.
	 * @param callbackContext	The callback context used when calling back into JavaScript.
	 * @return True if the action was valid, false otherwise.
	 */
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) {
 		
        try {
            
            WifiManager wifiManager = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
            WifiInfo wifiInfo = wifiManager.getConnectionInfo();
            String info = "";
            
            if (action.equals(ACTION_BSSID)) {
                info = wifiInfo.getBSSID();
                Log.d(LOG_TAG, "BSSID: " + info);
                callbackContext.success(info);
                        
                return true;
            }
            
             if (action.equals(ACTION_SSID)) {
                info = wifiInfo.getSSID();
                Log.d(LOG_TAG, "SSID: " + info);
                callbackContext.success(info);
                        
                return true;
            }

            return false;
        }
        catch (Exception e) {

            callbackContext.error(e.getMessage());
            return false;
        }
    }

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    	super.initialize(cordova, webView);

        context = cordova.getActivity().getApplicationContext();
    }

}