import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator, Image } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

//import firebase from 'firebase';

//import Binance from 'binance-api-react-native';
var CryptoJS = require("crypto-js");
const fetch = require('node-fetch');
	

import * as firebase from 'firebase';
import {firebaseConfig} from '../config'
if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
}


class LoadingExchangeScreen extends Component {

	componentDidMount(){
		this.checkIfLoggedIn();
	}

	//checkIfLoggedIn = () =>{
	async checkIfLoggedIn() {
		
				
				var user = firebase.auth().currentUser;
				console.log('USER:')
				//console.log(user);
				
				
					//console.log(user.uid);
				
				//var user__='';
				
				//get apikeys...
					var snapshot = await firebase.database().ref('/users/'+user.uid).once('value');
				//if (snapshot){
					var ak = (snapshot.val() && snapshot.val().a_k) || '';
						var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
						//var plaintext_ak = bytes_ak.toString(CryptoJS.enc.Utf8);
						
					var sk = (snapshot.val() && snapshot.val().s_k) || '';
						var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
						//var plaintext_sk = bytes_sk.toString(CryptoJS.enc.Utf8);
						
						if ((ak) && (sk) ){
							
							let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
							let responseST = await response.json();
							//console.log('SERVER TIME:'+responseST.serverTime);
							
							//var body = '';
							//var path = "/api/v3/account";
							//var signature = CryptoJS.HmacSHA256(timeStampChosen+'GET'+path+body, 'e2464cd36ef476201c2b9b5508f8345fc19087ea64f7fa4c625fe4f7fb5fa2dc').toString(CryptoJS.enc.Hex);
							//let response = await fetch( 	'https://api.binance.com'+path,{ headers: { 'X-VALR-API-KEY': '82f5947bba969a51e8c0a0bb9a75a6d783372a446a93c41e102740c05676a148', 'X-VALR-SIGNATURE': signature, 'X-VALR-TIMESTAMP': timeStampChosen, }, } );
							//let responseJson = await response.json();
							//console.log(responseJson);
							
			///-------------------------------------------------------------------------------------------------------------------------
							
							//var bytes_ak  = CryptoJS.AES.decrypt(userDet[0].a_k, '#yB*32_Ppz'+userDet[0].username+'gpwo12(');
							//var bytes_sk  = CryptoJS.AES.decrypt(userDet[0].s_k, '#yB*32_Ppz'+userDet[0].username+'gpwo12(');
	
							var dataQueryString = 'recvWindow=20000&timestamp='+responseST.serverTime;
							var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
							var url = 'https://api.binance.com/api/v3/account?'+dataQueryString+'&signature='+signature;
							//var url = 'https://api.binance.com/sapi/v1/margin/allPairs?'+dataQueryString;
							
							let responseB = await fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } );
							let responseJson = await responseB.json();
							//console.log(responseJson);
							
							var accInfo = responseJson;
							
						//	console.log('It clearly recognizes something...')
							
							//alert(' AK:'+ak+' & sk:'+sk);
							
						
							//var client2 =  Binance({
							//	apiKey: plaintext_ak,
							//	apiSecret: plaintext_sk,
							//})	
							
							//var accInfo = await client2.accountInfo({useServerTime:true,}).catch((error)=>console.log(error));;
							//console.log('ACCOUNT INFO BELOW:::');
							//console.log(accInfo);
							//console.log('ak:'+ak+' & _sk:'+sk);
						
							if (typeof accInfo!=='undefined'){
						//		
								console.log('Navigating you to dashboard...');
								///this.props.navigation.navigate('HomeTabNavigator');
								this.props.navigation.navigate('Home');
							}
							else {
								this.props.navigation.navigate('Account');
								console.log('NO API KEYS REDIRECT TO ACCOUNT 01');
							}
							
							
						}
						else {
							this.props.navigation.navigate('Account');
							console.log('NO API KEYS REDIRECT TO ACCOUNT 02');
						}
						
				//}
				
				
				
				
				
			
		
		
	}

	render(){
		return(
			<View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: 'white'}}>
			
			<Image style={styles.image} source={require('../media/logo4.png')} />
			<Text style={{padding:10}}>Linking your exchange account</Text>
				<ActivityIndicator size="large" style={{padding:10}} />
			</View>
		);
	}
}

export default LoadingExchangeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
        width: 250,
        height: 250,
        
    },
});
