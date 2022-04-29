import React, { useRef,useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Image,Linking,AppState,FlatList
} from 'react-native';
import { connect } from 'react-redux';
import Heartbeat from './Heartbeat';
import heart from './heart.png';
const supportedURL = "https://google.com";
import RNInstalledApplication from 'react-native-installed-application';
// import Echo from 'laravel-echo/dist/echo';
import socketIOClient from 'socket.io-client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  view: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'gray',
    padding: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 12,
  },
  image_list:{
    height: 50,
    width: 50
  }
});


const App = ({ heartBeat }) => {
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const imageSize = heartBeat ? 150 : 100;
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
      // Update the document title using the browser API
    useEffect(() => {
          //   global.echo.channel("sovled-conversation").listen("SovledConversationEvent", e => {
          // console.log(`You clicked ${count} times`);
          // });
        const subscription = AppState.addEventListener("change", nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === "active"
        ) {
          console.log("App has come to the foreground!");
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
        console.log("AppState", appState.current);
      });

      return () => {
        subscription.remove();
      };
    }, []);
    const getApplication = ()=>{
      RNInstalledApplication.getNonSystemApps()
     
      .then(apps => {
        setData(apps)
        console.log(apps);
        // <Item title={item.title} />
      })
      .catch(error => {
        console.log(error);
      });
    }
    const Item = ({ title,img_src  }) => (
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Image style={{ height: 50, width: 50 }} source={{uri: `data:image/gif;base64,${img_src}`}} />
      </View>
    );
    const renderItem = ({ item }) => (
      <Item title={item.appName} img_src={item.icon}/>
    );


  return (
    <View style={styles.container}>
      <View style={styles.view}>
        <TouchableOpacity style={styles.button} onPress={() => Heartbeat.startService()}>
          <Text style={styles.instructions}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Heartbeat.stopService()}>
          <Text style={styles.instructions}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => Heartbeat.startService()}>
          <Text style={styles.instructions}>Open App</Text>
        </TouchableOpacity>
        <Text>Current state is: {appStateVisible}</Text>
        <TouchableOpacity onPress={()=> getApplication()}>
        <Text>Hello World</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );


};

const mapStateToProps = store => ({
  heartBeat: store.App.heartBeat,
});

export default connect(mapStateToProps)(App);
