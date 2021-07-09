import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Image, ScrollView, FlatList, Alert } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
//import { Icon } from 'react-native-elements';

//Button, Icon, Text
import {  Button, Icon, Text, Input, Item, Label } from 'native-base';

import firebase from 'firebase';
//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;  npm i xmlhttprequest
//var user = firebase.auth().currentUser;
var CryptoJS = require("crypto-js");

var styles_ = require('../Styles/Styles');

class PositionScreen extends Component {
	
	constructor(props){
		super(props);
		this.state ={
			//openBuyOrderJSON:[],
			//modal_BuyVisible: false,
			//algoStatus:'',
			mainJson_B:[],
			showAddBox:false,
			showAddBoxShort:false,
			showPrefBox:false,
			_LPCol:[styles_.dimLogoCol_],
			_SPCol:[styles_.dimLogoCol_],
			_PCOl:[styles_.dimLogoCol_],
			symBText:'',
			short_symBText:'',
			exchangeInfo:[],
			prices:[],
			accBal:[],
			M_accBal:[],
			userDet:[],
			mJOptions:[],
			
			openSellOrderJSON:[],
			openShortBuyOrderJSON:[],
			
			discPrice:'',
			bal:'',
		}
		
		//this.discPrice = this.discPrice.bind(this);
		//this.bal = this.bal.bind(this);
		//this.updateCoinSettings = this.updateCoinSettings.bind(this);
}

	 componentDidMount(){
		var user = firebase.auth().currentUser;
		
	
		
		
		//getAllLong coins
		//var user = firebase.auth().currentUser;
		
		
		this.getAllPrices();
		setInterval(() => {
				this.getAllPrices();
			}, 10000);
		
		this.runInitialSteps();		
		
		
	}
	
	async runInitialSteps(){
		var user = firebase.auth().currentUser;
		fetch('https://api.binance.com/api/v3/exchangeInfo')
			.then((response) => response.json())
			.then((json) => {
				//return json.movies;  		https://api.binance.com/api/v3/exchangeInfo
				this.setState({exchangeInfo:json})
				//exchangeInfo
				//console.log(' exchangeInfo below:');
				//console.log(this.state.exchangeInfo);
				console.log('firebase got value A')
			})
			.catch((error) => {
				console.error(error);
			});
			
			///I use exchangeInfo to check for if margin trading is allowed...
			
			///var snapshot_X = await firebase.database().ref('/Ins/_test__S/').once('value').catch((error)=>console.log(error));
			//	var ws_ws_json_Sim = (snapshot_X.val() && snapshot_X.val().ws_key) || [];
				
			firebase.database().ref('users/'+user.uid+'/').once('value', (snapshot) => {
				// do some stuff once
				var snapValVar = snapshot.val();
				//userDet
				this.setState({
					userDet: snapValVar,
				})
				
					this.updateOpenBuyOrders();
				
				console.log('firebase got value B')
				//console.log('userDet:-->');
				//console.log(this.state.userDet)
			});	
			
	
		await this.getAccBal();	
		await this.loadInitialData();
	}
	
	async getAccBal() {
		var user = firebase.auth().currentUser;
		
		console.log('getAccBal:::')
		/* console.log('getAllPrices function ran...................................')
		fetch('https://api.binance.com/api/v3/account')
			.then((response) => response.json())
			.then((json) => {
				//return json.movies;  		https://api.binance.com/api/v3/exchangeInfo
				this.setState({accBal:json})
				//exchangeInfo
				//console.log(' exchangeInfo below:');
				//console.log(this.state.exchangeInfo);
				console.log('firebase got value A')
			})
			.catch((error) => {
				console.error(error);
			}); */
			
		let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
				let responseST = await response.json();
				console.log('SERVER TIME:'+responseST.serverTime);
				
				var uDet = this.state.userDet;
				
				var ak = uDet.a_k;
				var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
				var sk = uDet.s_k;
				var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
				
				//since it is a once off event... i am going to make it an async function...
				var dataQueryString = 'recvWindow=20000&timestamp='+responseST.serverTime;
				var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
				var url = 'https://api.binance.com/api/v3/account?'+dataQueryString+'&signature='+signature;					
				//fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
				let responseB = await fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
				let responseAccBal = await responseB.json();
				//console.log('SERVER TIME:'+responseHis);
				//console.log('responseAccBal:_')
				//console.log(responseAccBal);
				
				this.setState({accBal:responseAccBal});
				
			if (uDet.toggleSwitchShort==1){
				var urlC = 'https://api.binance.com/sapi/v1/margin/account?'+dataQueryString+'&signature='+signature;					
				//fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
				let responseC = await fetch( 	urlC, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
				let responseAccBalMargin = await responseC.json();
				//console.log('responseAccBalMargin:::')
				//console.log(responseAccBalMargin);
				this.setState({M_accBal:responseAccBalMargin});
			}
		
	}
	
	getAllPrices() {
		console.log('getAllPrices function ran...................................')
		fetch('https://api.binance.com/api/v3/ticker/price')
			.then((response) => response.json())
			.then((json) => {
				//return json.movies;  		https://api.binance.com/api/v3/exchangeInfo
				this.setState({prices:json})
				//exchangeInfo
				//console.log(' exchangeInfo below:');
				//console.log(this.state.exchangeInfo);
				console.log('firebase got value A')
			})
			.catch((error) => {
				console.error(error);
			});
	}
	
	
	
	async loadInitialData() {
		var user = firebase.auth().currentUser;
		
		console.log('this.state.accBal:::');
		console.log(this.state.accBal);
		var accBalance=this.state.accBal;
		
		console.log('this.state.M_accBal:::');
		console.log(this.state.M_accBal);
		var margin_accBalance=this.state.M_accBal;
		
		firebase.database().ref('/Ins/'+user.uid+'_S/ws_key').on("value", (snapshot) => {
			//console.log('BELOW');
				var snapValVar = snapshot.val() || [];
				console.log(snapValVar);
				//this.setMainJson_B(snapshot.val());
				
				for (var y=0; y<snapValVar.length; y++){
					if (snapValVar[y].type=='LONG'){
						console.log('LONG!!!!'+snapValVar[y].symB)
						//look through accountBalance...
						if (snapValVar[y].symB.substr(-4) == 'USDT' ){
							for (z=0; z<accBalance.balances.length; z++){
								if (accBalance.balances[z].asset == snapValVar[y].symB.substring(0, snapValVar[y].symB.length - 4)){
									console.log('FOUND FOR '+accBalance.balances[z].asset+', balance is '+accBalance.balances[z].free);
									snapValVar[y].baseBalance = Math.floor(accBalance.balances[z].free);
								}
							}
						}
						
					}
				}
				
				this.setState({
						mainJson_B: snapValVar,
				});
			
				//console.log('mainJson_B DDDD below:');
				//console.log(this.state.mainJson_B);
				
				console.log('firebase got value 3')
			
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
		});
	
		
	
			
			setInterval(() => {
				this.updateOpenBuyOrders();
			}, 30000);
		
	}
	
	
	
	
	
	setPrefBox(){
		if (this.state.showPrefBox==false){
			this.setState({
						showPrefBox: true,
						showAddBox:false,
						showAddBoxShort:false,
						
						_LPCol:[styles_.dimLogoCol_],
						_SPCol:[styles_.dimLogoCol_],
						_PCOl:[styles_.lightLogoCol_],
				});
		}
		
		if (this.state.showPrefBox==true){
			this.setState({
						showPrefBox: false,
						
						_PCOl:[styles_.dimLogoCol_],
				});
		}
		
	}
	
	_showPrefBox(){
		if (this.state.showPrefBox){
			 return(
				<View  style={{ marginBottom:5,  alignItems:"flex-end", justifyContent:"space-around", flexDirection:'row', }}>	
					<View style={[styles_.lightBoxCol_, {flex:0.9,  borderRadius:5, flexDirection:'row'},]} >
						
						<View style={{flex:0.75, paddingLeft:2, margin:10,  }}>
							
							<Text style={ [ styles_.col_A_B, { fontSize:14,  margin:2,  }, ] } >PREFERENCES WILL BE HERE>>>>:</Text>
							<Item floatingLabel>
								<Label style={[styles_.col_A_B, {fontSize:14,  },]}>Coin Pair: e.g. XRPUSDT</Label> 
								<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' onChangeText={ (email)=> this.setState({email}) }  />
							</Item>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,] } type='AntDesign' name='check' />
							</View>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='close' onPress={()=>this.setPrefBox()} />
							</View>
						</View>
						
					</View>
				</View>
			 )
		}
	}

	setAddBox(){
		console.log('ShowAddBox Ran...');
		if (this.state.showAddBox==false){
			this.setState({
						showAddBox: true,
						showPrefBox:false,
						showAddBoxShort:false,
						_LPCol:[styles_.lightLogoCol_],
						_SPCol:[styles_.dimLogoCol_],
						_PCOl:[styles_.dimLogoCol_],
				});
		}
		
		if (this.state.showAddBox==true){
			this.setState({
						showAddBox: false,
						_LPCol:[styles_.dimLogoCol_],
						
				});
		}
		
	}
	
	_showAddBox(){
		if (this.state.showAddBox){
			//this.state._LPCol;
			//this.setState({});
			 return(
				<View  style={{ marginBottom:5,  alignItems:"flex-end", justifyContent:"space-around", flexDirection:'row', }}>	
					<View style={[styles_.lightBoxCol_, {flex:0.9,  borderRadius:5, flexDirection:'row'},]} >
						
						<View style={{flex:0.75, paddingLeft:2, margin:10,  }}>
							<Text style={[styles_.col_A_B, { fontSize:16,  margin:2,  }, ]} >Monitor Long Position:</Text>
							<Item floatingLabel>
								<Label style={[styles_.col_A_B, {fontSize:14,  },]}>Coin Pair: e.g. XRPUSDT</Label> 
								<Input autoCorrect={false} autoCapitalize='characters' onChangeText={(text) => this.setState({symBText: text.toUpperCase()})}  />
							</Item>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='check' onPress={()=>this._addToLongJson()} />
							</View>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='close' onPress={()=>this.setAddBox()} />
							</View>
						</View>
						
					</View>
				</View>
			 )
		}
	}
	
	setAddBoxShort(){
		console.log('showAddBoxShort Ran...');
		if (this.state.showAddBoxShort==false){
			this.setState({
						showAddBoxShort: true,
						showAddBox:false,
						showPrefBox:false,
						
						_LPCol:[styles_.dimLogoCol_],
						_SPCol:[styles_.lightLogoCol_],
						_PCOl:[styles_.dimLogoCol_],
				});
		}
		
		if (this.state.showAddBoxShort==true){
			this.setState({
						showAddBoxShort: false,
						_SPCol:[styles_.dimLogoCol_],
						
				});
		}
		
	}
	
	_showAddBoxShort(){
		if (this.state.showAddBoxShort){
			 return(
				<View  style={{ marginBottom:5,  alignItems:"flex-end", justifyContent:"space-around", flexDirection:'row', }}>	
					<View style={[styles_.lightBoxCol_, {flex:0.9,  borderRadius:5, flexDirection:'row'},]} >
						
						<View style={{flex:0.75, paddingLeft:2, margin:10,  }}>
							<Text style={[styles_.col_A_B, { fontSize:16,  margin:2, },]} >Monitor Short Position:</Text>
							<Item floatingLabel>
								<Label style={[styles_.col_A_B, {fontSize:14,  },] }>Coin Pair: e.g. XRPUSDT</Label> 
								<Input autoCorrect={false} autoCapitalize='characters' onChangeText={ (text)=> this.setState({short_symBText: text.toUpperCase()}) }  />
							</Item>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='check' onPress={()=>this._addToShortJson()} />
							</View>
						</View>
						
						<View style={{flex:0.12, paddingLeft:2, flexDirection:'row', margin:10, justifyContent:'flex-end',  alignItems:'flex-end' }}>
							
							<View style={{}}>
								<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='close' onPress={()=>this.setAddBoxShort()} />
							</View>
						</View>
						
					</View>
				</View>
			 )
		}
	}
	
	async _addToShortJson(){
		var user = firebase.auth().currentUser;
		
		var bigData = this.state.exchangeInfo;
		var alertCoinNull='0';
		console.log('IT IS RUNNING...');
		for (var j=0; j<bigData.symbols.length; j++){
			
			//if ((bigData.symbols[j].symbol== this.state.short_symBText)  ){
			//	console.log('bigData.symbols[j].isMarginTradingAllowed:'+bigData.symbols[j].isMarginTradingAllowed);
			//}
			
			if ((bigData.symbols[j].symbol== this.state.short_symBText) && (bigData.symbols[j].isMarginTradingAllowed==true) ){
				alertCoinNull='1';
				console.log('OK SOMETHING MATCHED HERE MEANING THAT IT DOES EXIST>>>');
			//	var response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+bigData.symbols[j].symbol).catch((error)=>console.log(error));
			//	var responseJson = await response.json();
			//	var coinPrice = responseJson.price;
			
				let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
				let responseST = await response.json();
				console.log('SERVER TIME:'+responseST.serverTime);
				
				var uDet = this.state.userDet;
				
				var ak = uDet.a_k;
				var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
				var sk = uDet.s_k;
				var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
				
				//since it is a once off event... i am going to make it an async function...
				var dataQueryString = 'symbol='+bigData.symbols[j].symbol+'&limit=10&recvWindow=20000&timestamp='+responseST.serverTime;
				var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
				var url = 'https://api.binance.com/sapi/v1/margin/myTrades?'+dataQueryString+'&signature='+signature;					
				//fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
				let responseB = await fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
				let responseMyTrades = await responseB.json();
				//console.log('SERVER TIME:'+responseHis);
				console.log('_responseMyTrades:_')
				console.log(responseMyTrades);
				
				var r=0;
				var _outputB_price;
				
				while(r<responseMyTrades.length){
					if ((responseMyTrades[r].isBuyer == false)  ){
						_outputB_price = responseMyTrades[r].price;
					}
					r++;
				}
				
				var moment = require('moment');
				var now = moment();
				
				var B_Side = this.state.mainJson_B;
				var parseFloatBaseBalance = parseFloat(this.state.userDet.btcQty);
				B_Side.push({'symB':bigData.symbols[j].symbol,  'monitorButtonText':'Start Monitoring', 'initialPrice':_outputB_price.toString(), 'discountPercent':'0', 'baseBalance':parseFloatBaseBalance, 'date':now.format('YYYY-MM-DD HH:mm:ss'), 'chart':'N/A', 'RSI':'N/A', 'macd':'N/A', 'model':'SHORT_MODEL', 'calc_ma20':'N/A', 'type':'SHORT_SELL',        });
			//ws_json_B.push({'symB':ReverseData[count_B].symbol,  'monitorButtonText':'Stop Monitoring', 'initialPrice':lP___.toString(), 'discountPercent':discountPercent.toString(), 'baseBalance':queryBook[i][2], 'date':now.format('YYYY-MM-DD HH:mm:ss'), 'chart':ReverseData[count_B].chart, 'RSI':ReverseData[count_B].calc_RSITwo_, 'macd':ReverseData[count_B].calc_macd, 'model':ReverseData[count_B].model, 'calc_ma20':ReverseData[count_B].calcMA20 , 'type':'SHORT_SELL',      });
				firebase.database().ref('/Ins/'+user.uid+'_S/').set({
					ws_key: B_Side,
				})
				this.setState({mainJson_B:B_Side})
				console.log('firebase updated 4')
				
				//var newLongEntry = 
				this.setAddBoxShort()
				this.setState({short_symBText:''})
			}
		}
		
		if (alertCoinNull=='0'){	
			alert('This coin pair does not exist or it can not be shorted. Please try again');
		}
		
	}
	
	async _addToLongJson(){
		var user = firebase.auth().currentUser;
		
		var bigData = this.state.exchangeInfo;
		console.log('Hello: _addToLongJson function running... length:'+bigData.symbols.length);
		console.log('symBText....'+this.state.symBText)
		
		var alertCoinNull='0';
		
		for (var j=0; j<bigData.symbols.length; j++){
			if (bigData.symbols[j].symbol== this.state.symBText){
				alertCoinNull='1';
				
				console.log('OK SOMETHING MATCHED HERE MEANING THAT IT DOES EXIST>>>');
				
				//var coinPrice=0;
				
				
				
			//	var response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol='+bigData.symbols[j].symbol).catch((error)=>console.log(error));
			//	var responseJson = await response.json();
				
			//	var coinPrice = responseJson.price;
				
				
				
			//	console.log('coinPrice:'+coinPrice+' & qty:'+this.state.userDet.btcQty);
			
				let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
							let responseST = await response.json();
							console.log('SERVER TIME:'+responseST.serverTime);
							
				var uDet = this.state.userDet;
				
				var ak = uDet.a_k;
				var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
				var sk = uDet.s_k;
				var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
				
				//since it is a once off event... i am going to make it an async function...
				var dataQueryString = 'symbol='+bigData.symbols[j].symbol+'&limit=10&recvWindow=20000&timestamp='+responseST.serverTime;
				var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
				var url = 'https://api.binance.com/api/v3/myTrades?'+dataQueryString+'&signature='+signature;					
				//fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
				let responseB = await fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
				let responseMyTrades = await responseB.json();
				//console.log('SERVER TIME:'+responseHis);
				console.log('_responseMyTrades:_')
				console.log(responseMyTrades);
				
				var r=0;
				var _outputB_price;
				
				while(r<responseMyTrades.length){
					if ((responseMyTrades[r].isBuyer == true)  ){
						_outputB_price = responseMyTrades[r].price;
					}
					r++;
				}
				
				
				var moment = require('moment');
				var now = moment();
				
				var B_Side = this.state.mainJson_B;
				var parseFloatBaseBalance = parseFloat(this.state.userDet.btcQty);
				//B_Side.push({'symB':bigData.symbols[j].symbol,  'monitorButtonText':'Start Monitoring', 'initialPrice':coinPrice.toString(), 'discountPercent':'0', 'baseBalance':this.state.userDet.btcQty, 'date':now.format('YYYY-MM-DD HH:mm:ss'), 'chart':'N/A', 'RSI':'N/A', 'macd':'N/A', 'model':'RSI model', 'calc_ma20':'N/A', 'type':'LONG',        });
				B_Side.push({'symB':bigData.symbols[j].symbol,  'monitorButtonText':'Start Monitoring', 'initialPrice':_outputB_price.toString(), 'discountPercent':'2', 'premiumPercent':'2.9', 'baseBalance':parseFloatBaseBalance, 'chart':'N/A', 'RSI':'N/A', 'macd':'N/A', 'model':'RSI model',  'calc_ma20':'N/A', date:now.format('YYYY-MM-DD HH:mm:ss'), 'type':'LONG'   });
			
				firebase.database().ref('/Ins/'+user.uid+'_S/').set({
					ws_key: B_Side,
				})
				console.log('firebase updated 5')
				
				this.setState({mainJson_B:B_Side})
				
				//var newLongEntry = 
				this.setAddBox()
				this.setState({symBText:''})
			}
		}
		
		if (alertCoinNull=='0'){
			
			alert('This coin pair does not exist. Please try again');
			
		}
		
	}

	deleteAlert(sym, type){
		//alert('Do you want to remove this?'+sym+' '+type);
		Alert.alert(
			'Confirm Remove',
			'Are you sure you want to remove this coin ('+sym+') from this list?',
			[
				{text: 'Confirm', onPress:   () => this.deleteCoin(sym, type)  },
				{text: 'Cancel',  style: 'cancel',},
			],
			{cancelable: false},
		);
	}
	
	deleteCoin(sym, type){
		var user = firebase.auth().currentUser;
		
		var mJ = this.state.mainJson_B;
		for (var i=0; i<mJ.length; i++){
			if ((sym == mJ[i].symB) && (type == mJ[i].type) ) {
				mJ.splice(i,1);
				
				
			}
			
		}
		
		this.setState({
			mainJson_B: mJ,
		})
		
		firebase.database().ref('/Ins/'+user.uid+'_S').set({
			ws_key: mJ,
		})
		console.log('firebase updated 6')
	}
	monitorAlert(sym, type){
		
		var mJ = this.state.mainJson_B;
		for (var i=0; i<mJ.length; i++){
			if ((sym == mJ[i].symB) && (type == mJ[i].type) && (mJ[i].monitorButtonText=='Stop Monitoring') ) {
				Alert.alert(
					'Stop Monitoring?',
					'This coin will no longer be monitored?',
					[
						{text: 'Confirm', onPress:   () => this.monitorCoin(sym, type)  },
						{text: 'Cancel',  style: 'cancel',},
					],
					{cancelable: false},
				);
			}
			else if ((sym == mJ[i].symB) && (type == mJ[i].type) && (mJ[i].monitorButtonText=='Start Monitoring') ) {
				Alert.alert(
					'Start Monitoring?',
					'Watch the market to potentially enter a position?',
					[
						{text: 'Confirm', onPress:   () => this.monitorCoin(sym, type)  },
						{text: 'Cancel',  style: 'cancel',},
					],
					{cancelable: false},
				);
			}
			
		}
		
		
	}
	
	monitorCoin(sym, type){
		var user = firebase.auth().currentUser;
		
		var mJ = this.state.mainJson_B;
		for (var i=0; i<mJ.length; i++){
			if ((sym == mJ[i].symB) && (type == mJ[i].type) && (mJ[i].monitorButtonText=='Stop Monitoring') ) {
				mJ[i].monitorButtonText = 'Start Monitoring';
			}
			else if ((sym == mJ[i].symB) && (type == mJ[i].type) && (mJ[i].monitorButtonText=='Start Monitoring') ) {
				mJ[i].monitorButtonText = 'Stop Monitoring';
			}
			
		}
		
		this.setState({
			mainJson_B: mJ,
		})
		
		firebase.database().ref('/Ins/'+user.uid+'_S').set({
			ws_key: mJ,
		})
		console.log('firebase updated 1')
	}
	
	async getOptionsStuff(symB, type, bal_, price_){
		//console.log('getOptionsStuff ran!!! ')
		//console.log(this.state.mainJson_B);
		
	
			console.log('Set state of _optionsIcon');
		var _optionsIcon = this.state.mJOptions;
		
		var foundOptionsIcon = 0;
		var optionsStyleVar =[];
		
		for (var r=0; r<_optionsIcon.length; r++){
			//dim everything..
			if ((_optionsIcon[r].col=='light') && (_optionsIcon[r].type==type) && (_optionsIcon[r].symB==symB) ){
				// do nothing
			}
			else if (_optionsIcon[r].col=='light') {
					_optionsIcon[r].col='dim';
			}
		}
		
		for (var r=0; r<_optionsIcon.length; r++){
			if ((_optionsIcon[r].symB == symB) && (_optionsIcon[r].type == type) ){
				if (_optionsIcon[r].col=='dim'){
					_optionsIcon[r].col='light';
					//optionsStyleVar = styles_.lightLogoCol_;
					console.log('CHANGED IT TO LIGHT');
					console.log('IT SET THE STATE:'+price_);
					this.setState({bal:bal_, discPrice:price_})
					
				}
				else if (_optionsIcon[r].col=='light'){
					_optionsIcon[r].col='dim';
					//optionsStyleVar = styles_.dimLogoCol_;
					console.log('CHANGED IT TO DIM');
					
					
				}
				
				
				foundOptionsIcon=1;
			}
		}
		
		if (foundOptionsIcon==0){
			//_optionsIcon.push('{'val.symB:'{'val.type:'{col':'dim}}}');
			
			_optionsIcon.push({'symB':symB, 'type':type, col:'light'});
			
			//_optionsIcon[val.symB][val.type]['col'] = 'dim';
			console.log('_optionsIcon:')
			console.log(_optionsIcon);
			//optionsStyleVar = styles_.dimLogoCol_;
			
			console.log('this.state.bal:')
			console.log(this.state.bal);
			
			//if (this.state.bal==''){
								//this.state.bal = val.baseBalance;
								this.setState({bal:bal_, discPrice:price_})
								console.log('IT SET THE STATE:'+bal_);
							//}
		}
		
		this.setState({
			mJOptions: _optionsIcon
		})
		//return optionsStyleVar;
	
	}
	
	updateCoinSettings(dP, bal, sym, type){
		var user = firebase.auth().currentUser;
		//.update for firebase...
		console.log('UPDATE SETTINGS RAN>>>')
		console.log('sym:'+sym+' & type:'+type+' & d:'+dP+' & b:'+bal);
		
		var needToUpdate=0;
		var B_Side = this.state.mainJson_B;
		//console.log('B_Side below:');
		//console.log(B_Side);
		
		for (var e=0; e<B_Side.length; e++){
			if ((B_Side[e].symB == sym) && (B_Side[e].type == type) ){
				if (B_Side[e].baseBalance != bal){
					needToUpdate = 1;
					B_Side[e].baseBalance = parseFloat(bal);
				}
				
				if (B_Side[e].discountPercent != dP){
					needToUpdate = 1;
					B_Side[e].discountPercent = dP;
				}
			}
		}
		
		
		
		if (needToUpdate == 1 ){
			firebase.database().ref('/Ins/'+user.uid+'_S/').set({
					ws_key: B_Side,
				})
				this.setState({mainJson_B:B_Side})
			
			//firebase.database().ref('/Ins/'+user.uid+'_S/').set({
			//		ws_key_B: B_Side,
			//	})
		}
		
		
		this.getOptionsStuff(sym, type, bal, dP,)
	}
	
	async updateOpenBuyOrders(){
		var user = firebase.auth().currentUser;
		
		let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
							let responseST = await response.json();
							console.log('SERVER TIME:'+responseST.serverTime);
							
	
		console.log('UPDATE OPEN BUY ORDERS RAN>>> BELOW:');
		//console.log(this.state.userDet);
		var uDet = this.state.userDet;
		
		var ak = uDet.a_k;
		var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
		var sk = uDet.s_k;
		var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
		
		//long SELL... (just copy for short sell)
		var dataQueryString = 'recvWindow=20000&timestamp='+responseST.serverTime;
		var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
		var url = 'https://api.binance.com/api/v3/openOrders?'+dataQueryString+'&signature='+signature;					
		fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
			.then((response) => response.json())
			.then((json) => {
				let buyResponseJSON = [];
				let buyCount = 0;
				for (i=0; i<json.length; i++){
					if (json[i].side=="SELL"){
						buyResponseJSON[buyCount] = json[i];
						buyCount++;
					}
				}
				
				console.log('buyResponseJSON');
				console.log(buyResponseJSON)
		
				this.setState({
					openSellOrderJSON: buyResponseJSON,
				})
			})
			.catch((error) => {
				console.error(error);
			});					
		
		//---------------------------------------------------------------------------------------------
		///short Buy
		//var urlB = 'https://api.binance.com/api/v3/openOrders?'+dataQueryString+'&signature='+signature;					
		var urlB = 'https://api.binance.com/sapi/v1/margin/openOrders?'+dataQueryString+'&signature='+signature;					
		fetch( 	urlB, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
			.then((response) => response.json())
			.then((json) => {
				let buyResponseJSON = [];
				let buyCount = 0;
				for (i=0; i<json.length; i++){
					if (json[i].side=="BUY"){
						buyResponseJSON[buyCount] = json[i];
						buyCount++;
					}
				}
				
				console.log('buyResponseJSON');
				console.log(buyResponseJSON)
		
				this.setState({
					openShortBuyOrderJSON: buyResponseJSON,
				})
			})
			.catch((error) => {
				console.error(error);
			});					
	
}
	
	deleteOrderAlert(sym, orderID){
		//alert('Are you sure you want to cancel the order?'+sym);
		Alert.alert(
			'Confirm Delete',
			'Are you sure you want to delete this order?',
			[
				{text: 'Yes', onPress:   () => this.confirmDelete(sym, orderID)  },
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
			],
			{cancelable: false},
		);
	}
	
	deleteOrderAlert_S(sym, orderID){
		//alert('Are you sure you want to cancel the order?'+sym);
		Alert.alert(
			'Confirm Delete',
			'Are you sure you want to delete this order?',
			[
				{text: 'Yes', onPress:   () => this.confirmDelete_S(sym, orderID)  },
				{text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel',},
			],
			{cancelable: false},
		);
	}
	
	async confirmDelete(sym, orderID){
	
		var user = firebase.auth().currentUser;
		
		let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
							let responseST = await response.json();
							console.log('SERVER TIME:'+responseST.serverTime);
							
	
		//console.log('UPDATE OPEN BUY ORDERS RAN>>> BELOW:');
		//console.log(this.state.userDet);
		var uDet = this.state.userDet;
		
		var ak = uDet.a_k;
		var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
		var sk = uDet.s_k;
		var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
		
		var dataQueryString = 'symbol='+sym+'&orderId='+orderID+'&recvWindow=20000&timestamp='+responseST.serverTime;
		var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
		var url = 'https://api.binance.com/api/v3/order?'+dataQueryString+'&signature='+signature;					
		fetch( 	url, {  method: 'Delete', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
			.then((response) => response.json())
			.then((json) => {
				///do nothing...
			})
			.catch((error) => {
				console.error(error);
			});		
		
		//var responseJson = await (this.state.client2_).cancelOrder({ symbol: sym, orderId: orderID, useServerTime:true,});
		this.updateOpenBuyOrders();
		//console.log('Confirm delete!!!:'+orderID);
	}	
	
	async confirmDelete_S(sym, orderID){
	
		var user = firebase.auth().currentUser;
		
		let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
							let responseST = await response.json();
							console.log('SERVER TIME:'+responseST.serverTime);
							
	
		//console.log('UPDATE OPEN BUY ORDERS RAN>>> BELOW:');
		//console.log(this.state.userDet);
		var uDet = this.state.userDet;
		
		var ak = uDet.a_k;
		var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
		var sk = uDet.s_k;
		var bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
		
		var dataQueryString = 'symbol='+sym+'&orderId='+orderID+'&recvWindow=20000&timestamp='+responseST.serverTime;
		var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
		var url = 'https://api.binance.com/sapi/v1/margin/order?'+dataQueryString+'&signature='+signature;					
		fetch( 	url, {  method: 'Delete', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } )
			.then((response) => response.json())
			.then((json) => {
				///do nothing...
			})
			.catch((error) => {
				console.error(error);
			});		
		
		//var responseJson = await (this.state.client2_).cancelOrder({ symbol: sym, orderId: orderID, useServerTime:true,});
		this.updateOpenBuyOrders();
		//console.log('Confirm delete!!!:'+orderID);
	}	
	

	render(){
		
	
		let b_List = this.state.mainJson_B.map((val, key, index) => {
			if ((val.type=='LONG') && (val.symB.substr(-4) == 'USDT') ){//==
				
				
				var amountOfCoins = (parseFloat(val.baseBalance)/(parseFloat(val.initialPrice)*(1-parseFloat(val.discountPercent)*0.01))).toFixed(2);
				var discAmount = (parseFloat(val.initialPrice)*(1-parseFloat(val.discountPercent)*0.01)).toFixed(4);
				console.log('amountOfCoins:'+amountOfCoins);
				var styleVar =[];
				var monitorLogo = '';
				if (val.monitorButtonText == 'Start Monitoring'){
					styleVar = styles_.dimLogoCol_;
					monitorLogo = 'monitor-off';
				}
				
				if (val.monitorButtonText == 'Stop Monitoring'){
					styleVar = styles_.lightLogoCol_;
					monitorLogo = 'monitor';
				}
				
				
				
			/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
				var _allPrices = this.state.prices;
				var perRet = 0;
				//console.log('_allPrices');
				//console.log(_allPrices);
				
				var uDet = this.state.userDet;
				var uDetBal = uDet.usdBal;
				var weighting =0
				
				var symPrice;
				for (var j=0; j<_allPrices.length; j++){
					if (_allPrices[j].symbol==val.symB){
						symPrice=_allPrices[j].price;
						perRet= (((parseFloat(symPrice)/parseFloat(val.initialPrice))-1)*100).toFixed(2);
						weighting = (val.baseBalance*parseFloat(symPrice)/uDetBal*100).toFixed(2);
					}
				}
				
				
				 
				 
				console.log('symPrice:'+symPrice+' & PerRet:'+perRet);
				
				var colorStyle;
				if (perRet>0){
					colorStyle=styles_.fontCol_;
				}
				else {
					colorStyle=styles_.lightLogoCol_;
				}
				
				var moment = require('moment');
				var now = moment();
				var timeInvested = moment(val.date); 
										var duration = moment.duration(now.diff(timeInvested));
										var durationHrs = duration.asHours();
										
										var durationDays = duration.asDays().toFixed(2)+' days';
				
			/// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
			
			//-----------------------------------------------				
				
				var b;
				
				var _optionsIcon = this.state.mJOptions;
				
				var foundOptionsIcon = 0;
				var optionsStyleVar =[];
		
				for (var r=0; r<_optionsIcon.length; r++){
					if ((_optionsIcon[r].symB == val.symB) && (_optionsIcon[r].type == val.type) ){
						if (_optionsIcon[r].col=='light'){
							//_optionsIcon[r].col='light';
							optionsStyleVar = styles_.lightLogoCol_;
							console.log('IT SHOULD  BE light')
							
							
							
							var b = (
								<View style={[styles_.lightBoxCol_,{flexDirection:'column', flex:0.9,  borderRadius:6, margin:5, }]} >
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center', margin:15,}}>
										<Text style={[styles_.col_A_B, { fontSize:20, fontWeight:'bold',}]}>Settings for {val.symB}</Text>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<View style={{flex:0.4,  }} >
											<Text style={[styles_.col_A_B,]}>Cut-off Percent: </Text>
										</View>
										<View style={{flex:0.4,  }} >
											<Item >
												<Input style={[styles_.col_A_B,]}  value={this.state.discPrice}  autoCorrect={false} autoCapitalize='characters' onChangeText={ (text)=> this.setState({discPrice: text}) }  />
											</Item>
										</View>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<View style={{flex:0.4,  }} >
											<Text style={[styles_.col_A_B,]}>Balance: </Text>
										</View>
										<View style={{flex:0.4,  }} >
											<Item >
												<Input style={[styles_.col_A_B,]}  value={this.state.bal}  autoCorrect={false} autoCapitalize='characters' onChangeText={ (text)=> this.setState({bal: text}) }  />
											</Item>
										</View>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<Button style={{flex:0.4, backgroundColor:'white', margin:15,  }} onPress={ ()=>this.updateCoinSettings(this.state.discPrice, this.state.bal, val.symB, val.type, )} >
											<Text style={[styles_.col_A_B, ]}>Save</Text>
										</Button>
										<Button style={{flex:0.4, backgroundColor:'white', margin:15,  }} onPress={()=>this.getOptionsStuff(val.symB, val.type, val.baseBalance.toString(), val.discountPercent,)} >
											<Text style={[styles_.col_A_B]}>Cancel</Text>
										</Button>
									</View>
									
								</View>
							);
						}
						else if (_optionsIcon[r].col=='dim'){
							//_optionsIcon[r].col='dim';
							optionsStyleVar = styles_.dimLogoCol_;
							console.log('IT SHOULD  BE dim')
						}
						foundOptionsIcon=1;
					}
				}
		
				if (foundOptionsIcon==0){
					console.log('STILL NOTHING');
					optionsStyleVar = styles_.dimLogoCol_;
				}
				
				
				
				
				
				
				
			//-----------------------------------------------	
				
				return 	<View key={key} style={{  flexDirection:'row', justifyContent:'center' }} >
							<View style={[styles_.blockCol_, {  flex:0.9,  borderRadius:6, margin:7,   },]} >
								<View style={{flexDirection:'row', }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12,  }]} >Long Position</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View>
										<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21, margin:10,  }]} > {val.symB} </Text>
									</View>
									<View>
										<Text style={[colorStyle, { fontWeight: 'bold', fontSize:21, margin:10, }]} > {perRet}%</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', marginTop:7, }} >
									<View style={{flexDirection:'column' }} >
										<View>
											<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:10, marginLeft:15  }]} > Portfolio weight: {weighting}% </Text>
										</View>
										<View>
											<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:10, marginLeft:15  }]} > Duration: {durationDays} </Text>
										</View>
									</View>
									
									
										<View style={{ flex:1,  flexDirection:'row', justifyContent:'flex-end'}} >
											<View style={{flex:0.7, flexDirection:'row',  justifyContent:'space-evenly' }} >
											<Button onPress={()=>this.monitorAlert(val.symB, val.type)} style={{flexDirection:'column', marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,    backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[styleVar]} type='MaterialCommunityIcons' name={monitorLogo} />
											</Button>
											<Button onPress={()=>this.getOptionsStuff(val.symB, val.type, val.baseBalance.toString(), val.discountPercent,)} style={{flexDirection:'column', marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[optionsStyleVar]} type='AntDesign' name='form' />
											</Button>
											<Button onPress={()=>this.deleteAlert(val.symB, val.type)} style={{flexDirection:'column',  marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='delete' />
											</Button>
											</View>
										</View>
									
								</View>
								
								
								{b}
							</View>
						</View>
			}
			else if (val.type=='SHORT_BUY'){ //==val.type=='SHORT_SELL'
					var amountOfCoins = (parseFloat(val.baseBalance)/(parseFloat(val.initialPrice)*(1-parseFloat(val.discountPercent)*0.01))).toFixed(2);
				var discAmount = (parseFloat(val.initialPrice)*(1-parseFloat(val.discountPercent)*0.01)).toFixed(4);
				console.log('amountOfCoins:'+amountOfCoins);
				
				var styleVar =[];
				var monitorLogo = '';
				if (val.monitorButtonText == 'Start Monitoring'){
					styleVar = styles_.dimLogoCol_;
					monitorLogo = 'monitor-off';
				}
				if (val.monitorButtonText == 'Stop Monitoring'){
					styleVar = styles_.lightLogoCol_;
					monitorLogo = 'monitor';
				}
				
				var b;
			
			//-----------------------------------------------				
				var _allPrices = this.state.prices;
				var perRet = 0;
				//console.log('_allPrices');
				//console.log(_allPrices);
				
				var uDet = this.state.userDet;
				var uDetBal = uDet.usdBal;
				var weighting =0
				
				var symPrice;
				for (var j=0; j<_allPrices.length; j++){
					if (_allPrices[j].symbol==val.symB){
						symPrice=_allPrices[j].price;
						perRet= (((((parseFloat(symPrice)/parseFloat(val.initialPrice))-1)*100)*(-1)).toFixed(2));
						weighting = (val.baseBalance*parseFloat(symPrice)/uDetBal*100).toFixed(2);
					}
				}
				
				var colorStyle;
				if (perRet>0){
					colorStyle=styles_.fontCol_;
				}
				else {
					colorStyle=styles_.lightLogoCol_;
				}
				
				var moment = require('moment');
				var now = moment();
				var timeInvested = moment(val.date); 
										var duration = moment.duration(now.diff(timeInvested));
										var durationHrs = duration.asHours();
										
										var durationDays = duration.asDays().toFixed(2)+' days';
			
				
				var _optionsIcon = this.state.mJOptions;
				
				var foundOptionsIcon = 0;
				var optionsStyleVar =[];
		
				for (var r=0; r<_optionsIcon.length; r++){
					if ((_optionsIcon[r].symB == val.symB) && (_optionsIcon[r].type == val.type) ){
						if (_optionsIcon[r].col=='light'){
							//_optionsIcon[r].col='light';
							optionsStyleVar = styles_.lightLogoCol_;
							console.log('IT SHOULD  BE light')
							
							
							
							var b = (
								<View style={[styles_.lightBoxCol_,{flexDirection:'column', flex:0.9,  borderRadius:6, margin:5, }]} >
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center', margin:15,}}>
										<Text style={[styles_.col_A_B, { fontSize:20, fontWeight:'bold',}]}>Settings for {val.symB}</Text>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<View style={{flex:0.4,  }} >
											<Text style={[styles_.col_A_B,]}>Cut-off Percent: </Text>
										</View>
										<View style={{flex:0.4,  }} >
											<Item >
												<Input style={[styles_.col_A_B,]}  value={this.state.discPrice}  autoCorrect={false} autoCapitalize='characters' onChangeText={ (text)=> this.setState({discPrice: text}) }  />
											</Item>
										</View>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<View style={{flex:0.4,  }} >
											<Text style={[styles_.col_A_B,]}>Balance: </Text>
										</View>
										<View style={{flex:0.4,  }} >
											<Item >
												<Input style={[styles_.col_A_B,]}  value={this.state.bal}  autoCorrect={false} autoCapitalize='characters' onChangeText={ (text)=> this.setState({bal: text}) }  />
											</Item>
										</View>
									</View>
									<View style={{flexDirection:'row',  flex:1, justifyContent:'center'}}>
										<Button style={{flex:0.4, backgroundColor:'white', margin:15,  }} onPress={ ()=>this.updateCoinSettings(this.state.discPrice, this.state.bal, val.symB, val.type, )} >
											<Text style={[styles_.col_A_B, ]}>Save</Text>
										</Button>
										<Button style={{flex:0.4, backgroundColor:'white', margin:15,  }} onPress={()=>this.getOptionsStuff(val.symB, val.type, val.baseBalance.toString(), val.discountPercent,)} >
											<Text style={[styles_.col_A_B]}>Cancel</Text>
										</Button>
									</View>
									
								</View>
							);
						}
						else if (_optionsIcon[r].col=='dim'){
							//_optionsIcon[r].col='dim';
							optionsStyleVar = styles_.dimLogoCol_;
							console.log('IT SHOULD  BE dim')
						}
						foundOptionsIcon=1;
					}
				}
		
				if (foundOptionsIcon==0){
					console.log('STILL NOTHING');
					optionsStyleVar = styles_.dimLogoCol_;
				}
				
				
				
				
			//-----------------------------------------------	
				
				
				return 	<View key={key} style={{  flexDirection:'row', justifyContent:'center' }} >
							<View style={[styles_.blockCol_, {  flex:0.9,  borderRadius:6, margin:7,   },]} >
								<View style={{flexDirection:'row', }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12,  }]} >Short Position</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View>
										<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21, margin:10,  }]} > {val.symB} </Text>
									</View>
									<View>
										<Text style={[colorStyle, { fontWeight: 'bold', fontSize:21, margin:10, }]} > {perRet}%</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', marginTop:7, }} >
									<View style={{flexDirection:'column' }} >
										<View>
											<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:10, marginLeft:15  }]} > Portfolio weight: {weighting}% </Text>
										</View>
										<View>
											<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:10, marginLeft:15  }]} > Duration: {durationDays} </Text>
										</View>
									</View>
									
									
										<View style={{ flex:1,  flexDirection:'row', justifyContent:'flex-end'}} >
											<View style={{flex:0.7, flexDirection:'row',  justifyContent:'space-evenly' }} >
											<Button onPress={()=>this.monitorAlert(val.symB, val.type)} style={{flexDirection:'column', marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,    backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[styleVar]} type='MaterialCommunityIcons' name={monitorLogo} />
											</Button>
											<Button onPress={()=>this.getOptionsStuff(val.symB, val.type, val.baseBalance.toString(), val.discountPercent,)} style={{flexDirection:'column', marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[optionsStyleVar]} type='AntDesign' name='form' />
											</Button>
											<Button onPress={()=>this.deleteAlert(val.symB, val.type)} style={{flexDirection:'column',  marginTop:0, paddingTop:0, marginBottom:0, paddingBottom:0,  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
												<Icon style={[styles_.dimLogoCol_,]} type='AntDesign' name='delete' />
											</Button>
											</View>
										</View>
									
								</View>
								
								
								{b}
							</View>
						</View>
			}
			
		});
		
		//this.setState({
		//			mJOptions: _optionsIcon
		//		})
			let a_Long_List = this.state.openSellOrderJSON.map((val, key, index) => {
				//var qtyTF = (val.origQty).toFixed(4);
				return 	<View key={key} style={{  flexDirection:'row', justifyContent:'center' }} >
							<View style={[styles_.blockColB_, {  flex:0.9,  borderRadius:4,  margin:5,   },]} >
								<View style={{flexDirection:'row', }} >
									<View style={{padding:5, flex:0.1}} >
										<Icon style={[styles_.lightLogoCol_,{opacity:0.5,},]} type='AntDesign' name='form' />
									</View>
									<View style={{padding:5, flex:0.8}} >
										<Text style={[styles_.lightLogoCol_, { fontSize:13, }]} >A sell order of {parseFloat(val.origQty).toFixed(4)} {val.symbol} at {parseFloat(val.price).toFixed(4)} has been placed</Text>
									</View>
									<View style={{padding:5, flex:0.1}} >
										<Icon style={[styles_.lightLogoCol_,{opacity:0.5,},]} onPress={()=>this.deleteOrderAlert(val.symbol, val.orderId)}  type='AntDesign' name='close' />
									</View>
								</View>
							</View>
						</View>
			})
			
			let a_Short_List = this.state.openShortBuyOrderJSON.map((val, key, index) => {
				//var qtyTF = (val.origQty).toFixed(4);
				return 	<View key={key} style={{  flexDirection:'row', justifyContent:'center' }} >
							<View style={[styles_.blockColB_, {  flex:0.9,  borderRadius:4,  margin:5,   },]} >
								<View style={{flexDirection:'row', }} >
									<View style={{padding:5, flex:0.1}} >
										<Icon style={[styles_.lightLogoCol_,{opacity:0.5,},]} type='AntDesign' name='form' />
									</View>
									<View style={{padding:5, flex:0.8}} >
										<Text style={[styles_.lightLogoCol_, { fontSize:13, }]} >[Short] A buy order of {parseFloat(val.origQty).toFixed(4)} {val.symbol} at {parseFloat(val.price).toFixed(4)} has been placed</Text>
									</View>
									<View style={{padding:5, flex:0.1}} >
										<Icon style={[styles_.lightLogoCol_,{opacity:0.5,},]} onPress={()=>this.deleteOrderAlert_S(val.symbol, val.orderId)}  type='AntDesign' name='close' />
									</View>
								</View>
							</View>
						</View>
			})
		
		return(
			<View style={[styles_.backgroundCol_, { flex:1,  flexDirection:"column"},]}>
				<ScrollView  style={{ }} >
					
						<View style={{marginBottom:10,}}>
						{a_Long_List}
						
						{a_Short_List}
						</View>
						
						{b_List}
						
						
						
					
				</ScrollView>	
				
				{this._showAddBox()}
				{this._showAddBoxShort()}
				{this._showPrefBox()}
				
			
					<View style={{  alignItems:"flex-end", justifyContent:"center", flexDirection:'row'}}>	
						<Button onPress={()=>this.setAddBox()}  style={{flexDirection:'column',  marginBottom:18,  alignItems:'center',  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
							<Icon style={[this.state._LPCol, { marginBottom:8, },]} name='trending-up' />
							<Text style={[this.state._LPCol, { fontSize:10 },]} >Long Position</Text>
						</Button>
						
						<Button onPress={()=>this.setAddBoxShort()} style={{flexDirection:'column',  marginBottom:18,  alignItems:'center',  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
							<Icon style={[this.state._SPCol, { marginBottom:8, },]} name='trending-down' />
							<Text style={[this.state._SPCol, { fontSize:10 },]} >Short Position</Text>
						</Button>
					</View>
			
				
				
			</View>	
			
		);
	}
}

export default PositionScreen;


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
