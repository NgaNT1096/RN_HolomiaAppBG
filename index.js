/**
 * @format
 */
 import React , { useState, useEffect } from 'react';
import {AppRegistry,LogBox, Linking} from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import {name as appName} from './app.json';
import { setHeartBeat, store } from './store';
import Echo from 'laravel-echo/dist/echo';
import socketio from 'socket.io-client';
import AppLink from 'react-native-app-link';

import IntentLauncher, { IntentConstant } from 'react-native-android-intent-launcher'

const count = 1;
IntentLauncher.startActivity({
  action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
  data: 'package:com.instagram.lite'
})
const MyHeadlessTask = async () => {

    const urlLink = "https://google.com";
    var connectionOptions =  {
        "force new connection" : true,
        "reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
        "timeout" : 10000,                  //before connect_error and connect_timeout are emitted.
        "transports" : ["websocket"]
    };

      var socket = socketio('http://192.168.1.74:3000',connectionOptions);
      socket.on("message_1:App\\Events\\MessagePushed", function(message){
      console.log("socket io react native");
      // check if app is installed by package name
      IntentLauncher.isAppInstalled('com.instagram.lite')
      .then((result) => {
        console.log('isAppInstalled yes');
      })
      .catch((error) => console.warn('isAppInstalled: no', error));
    
      // open another app by package name
      IntentLauncher.startAppByPackageName('com.instagram.lite')
        .then((result) => {
          console.log('startAppByPackageName started');
        })
        .catch((error) => console.warn('startAppByPackageName: could not open', error));
      
      const downloadURL = "https://www.your.com/download"
      
      IntentLauncher.isPackageInstalled('com.instagram.lite')
        .then(isInstalled => {
          if (isInstalled) 
            IntentLauncher.openApp(appInfo.package, options)
          else if (downloadURL) 
            Linking.openURL(downloadURL)
              .catch(err => console.error("An error occurred", err))
          else
            console.log("There is no path to download the app")
        })

      });
      socket.on("connect", () => {
        console.log(socket); // true
      });
      socket.on("data", () => { 
        console.log("socket data");
       });
       socket.io.on("reconnect", () => {
        console.log("reconnect socket data");
      });
    }

  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
  ]);
  const RNRedux = () => (
    <Provider store={store}>
      <App />
    </Provider>
  );
// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => RNRedux);
AppRegistry.registerHeadlessTask('Heartbeat', () =>  MyHeadlessTask);