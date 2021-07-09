import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

//import React from 'react';

import React, {Fragment,useEffect} from "react";

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert,
  AppRegistry,
} from 'react-native';


import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';

//import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';

import { Icon } from 'react-native-elements';



//import firestore from 'firebase/firestore';
//import 'firebase/firestore';


import * as firebase from 'firebase';
import {firebaseConfig} from './config'


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

import HomeScreen from './Components/Home';
import DetailsScreen from './Components/Details';
import Account from './Components/Account';
import LoadingScreen from './Components/LoadingScreen';
import LoadingExchangeScreen from './Components/LoadingExchangeScreen';
import AddScreen from './Components/AddScreen';
import PositionScreen from './Components/PositionScreen';
import SignOut from './Components/SignOut';
import SignUpScreen from './Components/SignUpScreen';
import WelcomeScreen from './Components/WelcomeScreen';

//import PositionScreen from './Styles/Styles';
var styles_ = require('./Styles/Styles');
import ColorPalette  from './Styles/ColorPalette';


//import {Ionicons} from "@expo/vector-icons"; //react-native-vector-icons   react-native-elements

//import { MaterialCommunityIcons } from 'react-native-vector-icons';

//const isFocused = useIsFocused();


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const Drawer = createDrawerNavigator();




const AccountScreen = ({ navigation}) => {
	
	return (
		<View style={[ styles_.backgroundCol_, {  flex:1, alignItems:"center", justifyContent:"center"},]}>
			<Text>AccountScreen</Text>
			
		</View>
	)
};


//const AddScreen = props => (
//	<View style={{ backgroundColor: '#17202A', flex:1, alignItems:"center", justifyContent:"center"}}>
//		<Text>AddScreen</Text>
//	</View>
//)

//const PositionScreen = props => (
//	<View style={{ backgroundColor: '#17202A', flex:1, alignItems:"center", justifyContent:"center"}}>
//		<Text>PositionScreen</Text>
//	</View>
//)

/* const DetailsScreen = props => (



	<View style={ [styles_.backgroundCol_, {  flex:1, alignItems:"center", justifyContent:"center"}, ]}>
		<Text>DetailsScreen</Text>
	</View>
) */

const HomeStackNavigator = ({navigation, routes}) => {
	return (
		<HomeStack.Navigator 
			screenOptions={{
					gestureEnabled: true,
					gestureDirection: "horizontal",
					//other things here...
					headerTintColor: ColorPalette.fontColA_,
					headerStyle: [styles_.backgroundCol_, {
						
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0, // remove shadow on iOS
					},],
					
		}} >
			<HomeStack.Screen name="Home" component={HomeScreen} />
			<HomeStack.Screen  name="Details" component={DetailsScreen} />
		</HomeStack.Navigator>
	)
}


const HomeTabNavigator = () => (
	<Tab.Navigator 
	
	
		tabBarOptions= {{
				showLabel: true,
				activeTintColor: ColorPalette.lightLogo_,
				inactiveTintColor: ColorPalette.dimLogo_,
				style: [ styles_.backgroundCol_, {
					borderTopColor: "transparent",
					elevation: 0, // remove shadow on Android
					shadowOpacity: 0, // remove shadow on iOS
					
				},],
				indicatorStyle: {
					height: 0
				},
				showIcon: true
			}}
			
		screenOptions={({route}) => ({
		
		
			

			tabBarIcon:({color, size}) => {
				let iconName
				if (route.name=='Home'){
					iconName = 'home'
					
				}
				else if (route.name=='Positions'){
					iconName = 'trending-up'
					
				}
				else if (route.name=='New'){
					iconName = 'add'
					
				}
				return <Icon name={iconName} size={size} color={color} />
			}
			
			
			
		})}>
		<Tab.Screen name="Home" component={HomeStackNavigator} />
		<Tab.Screen name="Positions" component={PositionScreen} />
		<Tab.Screen name="New" component={AddScreen} />
	</Tab.Navigator>
	
	
)

function getHeaderTitle(route){
	//const routeName= route.state ? route.state.routes[route.state.index].name : 'Home';
	//const routeName= route.state ? route.state.routes[route.state.index].name : 'Home';
	const routeName = getFocusedRouteNameFromRoute(route);
	
	switch(routeName){
		case 'Home':
			return 'Home';
		case 'Positions':
			return 'Positions';
		case 'New':
			return 'New';			
	}
}

 /* function shouldHeaderBeShown(route){
	//const routeName = route.state? route.state.routes[route.state.index].name:'Home'
	const routeName = getFocusedRouteNameFromRoute(route);
	
	switch(routeName){
		case 'Home':
			return false;
	}
}  */

 const shouldHeaderBeShown = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route);
	
	/* console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
	console.log('getFocusedRouteNameFromRoute  getFocusedRouteNameFromRoute  getFocusedRouteNameFromRoute  getFocusedRouteNameFromRoute   getFocusedRouteNameFromRoute  below:');
	console.log(routeName); */
	
    const hideOnScreens = ['Home'];
	if (routeName){
		if(hideOnScreens.indexOf(routeName) > -1) return false;
		return true;
	}
	else {
		
		/* console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
		console.log('NO ROUTE NAME'); */
		
		
		return false;
		
	}
    
  } 

const StackNav = () => {
  return (
    <Stack.Navigator
				screenOptions={{
					gestureEnabled: false,
					gestureDirection: "horizontal",
					//other things here...
					headerTintColor:ColorPalette.fontColA_,
					headerStyle: [styles_.backgroundCol_,{
						elevation: 0, // remove shadow on Android
						shadowOpacity: 0, // remove shadow on iOS
					},],
				}}
				headerMode="float"
				amination="fade"
			>
			
				<Stack.Screen options={ ({route})=> ({
					//title: 'ACCOUNT',
					headerShown:false,
				}) } name="LoadingA" component={LoadingScreen} />		
				
				<Stack.Screen options={ ({route})=> ({
					//title: 'ACCOUNT',
					headerShown:false,
				}) } name="LoadExchange" component={LoadingExchangeScreen} />		
				
			
				<Stack.Screen options={ ({route})=> ({
					title: getHeaderTitle(route),
					headerShown:shouldHeaderBeShown(route),
				}) } name="Home" component={HomeTabNavigator} />
				
				<Stack.Screen options={ ({route})=> ({
					title: getHeaderTitle(route),
					headerShown:shouldHeaderBeShown(route),
				}) } name="Account" component={Account} />
				
				<Stack.Screen options={ ({route})=> ({
					title: getHeaderTitle(route),
					headerShown:shouldHeaderBeShown(route),
				}) } name="SignUpScreen" component={SignUpScreen} />
				
					<Stack.Screen options={ ({route})=> ({
					title: getHeaderTitle(route),
					headerShown:shouldHeaderBeShown(route),
				}) } name="WelcomeScreen" component={WelcomeScreen} />
				
				
				
				
			
			</Stack.Navigator>
  );
};

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  //const userId = auth().currentUser.uid;
  //const userId = firebase.auth().currentUser;
  var user = firebase.auth().currentUser;
  //var user = firebase.auth().currentUser;

  // Add the token to the users datastore
  /* await firebase.firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    }); */
	
	//firebase.database().ref('/users/'+user.uid+'/').update({
	firebase.database().ref('/users/'+user.uid+'/').update({
		tokens: token,
	})
	
}

export default function App(){
	
	messaging().setBackgroundMessageHandler(async remoteMessage => {
		console.log('Message handled in the background!', remoteMessage);
	  });
	  
	  AppRegistry.registerComponent('app', () => App);
	  
	useEffect(() => {
		requestUserPermission();
		const unsubscribe = messaging().onMessage(async remoteMessage => {
		  Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
		});
		return unsubscribe;
		
		return messaging().onTokenRefresh(token => {
		  saveTokenToDatabase(token);
		});
		
	}, []);
	
	requestUserPermission = async () => {
		
		console.log('requestUserPermission requestUserPermission requestUserPermission');
		
		const authStatus = await messaging().requestPermission();
		const enabled =
		  authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
		  authStatus === messaging.AuthorizationStatus.PROVISIONAL;
		if (enabled) {
		  getFcmToken() //<---- Add this
		  console.log('Authorization status:', authStatus);
		}
	  }
	  
	  getFcmToken = async () => {
		const fcmToken = await messaging().getToken();
		
		 // Get the device token
			/* messaging()
			  .getToken()
			  .then(token => {
				return saveTokenToDatabase(token);
			  }); */
		
		
		 if (fcmToken) {
			console.log(fcmToken);
			console.log("Your Firebase Token is:", fcmToken);
			saveTokenToDatabase(fcmToken);
		} else {
		 console.log("Failed", "No token received");
		} 
	  }
	
	
	return (
		<NavigationContainer>
			<Drawer.Navigator initialRouteName="Home">
				<Drawer.Screen name="Home" component={StackNav} />
				<Drawer.Screen name="Account" component={Account} />
				<Drawer.Screen name="Sign Out" component={SignOut} />
			</Drawer.Navigator>
			
		</NavigationContainer>
	)
}


const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});


