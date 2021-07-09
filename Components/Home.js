import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { StyleSheet,  View,  SafeAreaView, ActivityIndicator, Image, ScrollView } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';

import {  Button, Icon, Text, Input, Item, Label } from 'native-base';

import firebase from 'firebase';

var styles_ = require('../Styles/Styles');

var CryptoJS = require("crypto-js");

//if open orders ==0.... 
//if margin enabled and balance=0 and open orders =0,
//then calculate balance....



class HomeScreen extends Component {
	
	constructor(props){
		super(props);
		this.state ={
			userDet:[],
			balance:'Calculating...',
			av_bal:'Calculating...',
			perRet:'Calculating...',
			perRetLatest:'Calculating...',
			orderRecordsJSON:[],
		}
	}
	
	componentDidMount(){
		 
		 this.runInitialComponents();
	}
	
	async runInitialComponents(){
		await this.getUserDet();
		await this.calcDetails();
		this.getLatestTrades();
	}
	
	async getUserDet(){
		var user = firebase.auth().currentUser;
		
		var snapshot = await firebase.database().ref('users/'+user.uid+'/').once('value').catch((error)=>console.log(error));
		var snapValVar = (snapshot.val()) || [];
		
		this.setState({
					userDet: snapValVar,
				})
		
		
		/* firebase.database().ref('users/'+user.uid+'/').once('value', (snapshot) => {
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
			});	 */
	}
	 
	async calcDetails(){
		var user = firebase.auth().currentUser;
		var moment = require('moment');
		var now = moment();
		
	//	console.log('CALC DETAILS USER DET:')
	//	console.log(this.state.userDet);
		 
		let response = await fetch('https://www.binance.com/api/v3/time').catch((error)=>console.log(error));
		let responseST = await response.json();
	//	console.log('SERVER TIME:'+responseST.serverTime);
		
		var akVar = this.state.userDet.a_k;
		var bytes_ak  = CryptoJS.AES.decrypt(akVar, '#yB*32_Ppz'+user.uid+'gpwo12(');
		var skVar = this.state.userDet.s_k;
		var bytes_sk  = CryptoJS.AES.decrypt(skVar, '#yB*32_Ppz'+user.uid+'gpwo12(');
		
		var dataQueryString = 'recvWindow=20000&timestamp='+responseST.serverTime;
		var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
		var url = 'https://api.binance.com/api/v3/openOrders?'+dataQueryString+'&signature='+signature;
		let responseB = await fetch( 	url, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
		let responseJson = await responseB.json() || '';
		
	//	console.log('OPEN ORDERS BELOW>>>');
	//	console.log(responseJson);
		
		var longOrders=0;
		if (responseJson.length!=0){
			
			longOrders =1;
		}
		
		var shortOrders=0;
		var shortPositions=0
		if (this.state.userDet.toggleSwitchMargin==1){
		//	console.log('MARGIN ENABLED...');
			
			//var urlB = 'https://api.binance.com/api/v3/openOrders?'+dataQueryString+'&signature='+signature;
			var urlB = 'https://api.binance.com/sapi/v1/margin/openOrders?'+dataQueryString+'&signature='+signature;
			let responseC = await fetch( 	urlB, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
			let responseJsonC = await responseC.json() || [];
			
		//	console.log('responseJsonC:')
		//	console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
			/* console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
			console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
			console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX') */
		//	console.log(responseJsonC);
		//	console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
		//	console.log('------------------')
			if (responseJsonC.length!=0){
				shortOrders=1;
				//console.log('^^^^^^^^^^^^^^^^^^^^^^^ HERE -01'+responseJsonC.length)
			}
			else {
				
			//	console.log('^^^^^^^^^^^^^^^^^^^^^^^ HERE -02'+responseJsonC.length)
			
				//var urlC = 'https://api.binance.com/sapi/v1/margin/account?'+dataQueryString+'&signature='+signature;
				//let responseD = await fetch( 	urlC, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
				//let responseJsonD = await responseD.json() || '';
				//console.log()
				var snapshotB = await firebase.database().ref('Ins/'+user.uid+'_S/ws_key').once('value').catch((error)=>console.log(error));
				var snapValVarB = (snapshotB.val()) || [];
				
				var snapshotC = await firebase.database().ref('Ins/'+user.uid+'_B/ws_key_B').once('value').catch((error)=>console.log(error));
				var snapValVarC = (snapshotC.val()) || [];
				
			//	console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
			//	console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
			//	console.log('YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY')
			//	console.log('snapValVarB -->'+snapValVarB.length);
			//	console.log(snapValVarB);
				//console.log(snapValVarB);
				
				for (var v=0; v<snapValVarB.length; v++){
					if (snapValVarB[v].type=='SHORT_BUY'){
						shortPositions=1;
						console.log('SHORT POSITION FOUND AT SELL');
					}
				}
				
				for (var v=0; v<snapValVarC.length; v++){
					if (snapValVarC[v].type=='SHORT_SELL'){
						shortPositions=1;
						console.log('SHORT POSITION FOUND AT BUY');
					}
				}
				
			//	console.log('snapValVarC -->');
			//	console.log(snapValVarC);
				
				//rather check if there are ws_key margins ....
			
			}
			//also check balance of margin account... USDT...
			
		}
		
		if ( (longOrders==0) && (shortOrders==0) && (shortPositions==0) ){
		//	console.log('Proceed to calculate balance...');
			
			//var dataQueryString = 'recvWindow=20000&timestamp='+responseST.serverTime;
			//var signature = CryptoJS.HmacSHA256(dataQueryString, bytes_sk.toString(CryptoJS.enc.Utf8)).toString(CryptoJS.enc.Hex);
			var urlD = 'https://api.binance.com/api/v3/account?'+dataQueryString+'&signature='+signature;
			let responseD = await fetch( 	urlD, {  method: 'GET', headers: { 'X-MBX-APIKEY': bytes_ak.toString(CryptoJS.enc.Utf8) }, } ).catch((error)=>console.log(error));
			var accInfo_ = await responseD.json() || '';
		//	console.log('accInfo_::');
		//	console.log(accInfo_);
			
			var urlE = 'https://api.binance.com/api/v3/ticker/price';
			let responseE = await fetch( urlE ).catch((error)=>console.log(error));
			var prices_B = await responseE.json() || '';
		//	console.log('prices_B::');
		//	console.log(prices_B);
			
			
			var totalBalance_U = 0;
			var availableBalance_U=0;
			for (var e=0; e<accInfo_.balances.length; e++){
				if (accInfo_.balances[e].asset == 'USDT'){
					totalBalance_U = totalBalance_U + parseFloat(accInfo_.balances[e].free) + parseFloat(accInfo_.balances[e].locked);
					availableBalance_U = parseFloat(accInfo_.balances[e].free);
					//console.log('U:: OK SO USDT FREE IS :'+accInfo_.balances[e].free);
				}
				else {
					if (parseFloat(accInfo_.balances[e].free)>0){
						
						for (var r=0; r< prices_B.length; r++){
							if (prices_B[r].symbol == accInfo_.balances[e].asset+'USDT'){
								var priceUSDT = prices_B[r].price;
							//	console.log('IT FOUND PRICEUSDT FOR '+accInfo_.balances[e].asset+'USDT'+' ->'+priceUSDT);
								
								var altBalBTC = (parseFloat(priceUSDT)*(parseFloat(accInfo_.balances[e].free))) + (parseFloat(priceUSDT)*(parseFloat(accInfo_.balances[e].locked) ));
								totalBalance_U = totalBalance_U + altBalBTC;
								//console.log('OK SO '+accInfo_.balances[e].asset+' balance FREE IS :'+accInfo_.balances[e].free+' & locked:'+accInfo_.balances[e].locked+' &  the price/btc is:'+priceUSDT+' altBal:'+altBalBTC+' & totalBalance_:'+totalBalance_U);
							}
						}
						
						//var priceUSDT = prices_B[accInfo_.balances[e].asset+'USDT'];
						
						
						
						
						
					}
						
					
				}
				//else if (accInfo_.balances[e].asset == 'BTC'){
				//	if (parseFloat(accInfo_.balances[e].free)>0){
				//		var priceBTC = prices_B['BTC'+accInfo_.balances[e].asset];
				//		var altBalBTC = (parseFloat(accInfo_.balances[e].free))/parseFloat(priceBTC) + (parseFloat(accInfo_.balances[e].locked) )/parseFloat(priceBTC);
				//		totalBalance_ = totalBalance_ + altBalBTC;
				//		console.log('1...1... .. OK SO '+accInfo_.balances[e].asset+' balance FREE IS :'+accInfo_.balances[e].free+' & locked:'+accInfo_.balances[e].locked+' &  the price/btc is:'+priceBTC+' && altBal'+altBalBTC+'  && TOTAL BALAANCE'+totalBalance_);
				//	}
				//}
				
			}
			//console.log('_________________________________________________________________________________________');
			//console.log('The Final USDT BALANCE:'+totalBalance_U);
			
			this.setState({
				balance: '$'+totalBalance_U.toFixed(2),
				av_bal: '$'+availableBalance_U.toFixed(2),
			})
			
			firebase.database().ref('/users/'+user.uid+'/').update({
					usdBal: totalBalance_U,
					recentBalDate: now.format('YYYY-MM-DD HH:mm:ss'),
			})
			
			
			
			
			
		}
		else if ( (shortPositions==1) ){
			this.setState({
				balance: '$'+this.state.userDet.usdBal.toFixed(2)+' at '+this.state.userDet.recentBalDate,
				av_bal: ': Short Position Active',
			})
		}
		else {
			
			this.setState({
				balance: '$'+this.state.userDet.usdBal.toFixed(2)+' at '+this.state.userDet.recentBalDate,
				av_bal: ': Order Being Placed',
			})
			
		}
		
		///var snapshot = await firebase.database().ref('/Ins/_test__S/').once('value').catch((error)=>console.log(error));
			//	var ws_ws_json_Sim = (snapshot.val() && snapshot.val().ws_key) || [];
		
		
		
		
	}
	
	async getLatestTrades(){
		var user = firebase.auth().currentUser;
		
		var moment = require('moment');
		//var now = moment();
		
		/* var balData=[];
		var snapshotL = await firebase.database().ref('/bal/'+user.uid).once('value');
		balData = snapshotL.val() || [] ;
		
		var newDataBal = [];
			var d=0;
			for (var x in balData) {
				//newDataQ[h] = tradeData[x];
				//tradeData[x].period = moment(x, 'YYYY MM').format('YYYY MMMM');
				newDataBal[d] = balData[x];
				d++;
			} */
						
		//var snapshotM = await firebase.database().ref('/trades_History/'+user.uid).once('value');
		
		var tradeData=[];
		var snapshotK = await firebase.database().ref('/trades/'+user.uid).once('value');
		tradeData = snapshotK.val() || [] ;
		
		var newDataR = [];
			var newDataQ = [];
			var newDataQ__ = [];
			//snapDataQ = snapshot_Q.val();
			var h=0;
			for (var x in tradeData) {
				tradeData[x].period = moment(x, 'YYYY MM').format('YYYY MMMM');
				newDataR[h] = tradeData[x];
				//newDataQ = tradeData[x];
				
				//newDataQ[h] = tradeData[x];
				h++;
			}
			
			//console.log('newDataR BELOW:');
			//console.log(newDataR[newDataR.length-1]);
			
			newDataQ = newDataR[newDataR.length-1];
			newDataQ__ = newDataR;
			//console.log('newDataQ below:');
			//console.log(newDataQ);
			newDataQ.reverse();
			var tempNDQ=[];
			if (newDataQ.length>10){
				for (var u=0; u<10; u++){
					tempNDQ[u]=newDataQ[u];
				}
				newDataQ=tempNDQ;
			}
			
			
			
			this.setState({
				orderRecordsJSON: newDataQ
			})
			
			///---------------------------
			var snapshotMM = await firebase.database().ref('/tradesMM/'+user.uid+'/').once('value').catch((error)=>console.log(error));
				var snapValVarMM = (snapshotMM.val()) ;
				var dateData = [];
				var h=0;
				for (var x in snapValVarMM) {
					snapValVarMM[x].period = moment(x, 'YYYY MM').format('YYYY MMMM');
					dateData[h] = snapValVarMM[x];
					h++;
				}
				
				
			//	console.log('NEW HOME: dateData:');
			//	console.log(dateData);
			//---------------------------
			
			
			//console.log('IT GETS HERE A');
			var completeReturn=0;
			var latest_return = 0;
			for (var q=0; q<newDataQ__.length; q++){
				var totalUSDTProfit=0;
				
				for (var w=0; w<newDataQ__[q].length; w++){
					totalUSDTProfit+=newDataQ__[q][w].usdtProfit;
					//serviceFee += newDataQ__[q][w].btcFee;
					//numTrades++;
				}
				
				//console.log('IT GETS HERE B')
				
				var fountIt=0;
				var y=0; 
				var dateBalRet=0;
				
				var newUSD = 0;
				var newUSDDate = '';
				var foundABalance = 0;
				
				for (var s=0; s<dateData.length; s++){
					if (dateData[s].period == newDataQ__[q].period){
						//console.log('GOOD -- - dateData[s].period:'+dateData[s].period);
						
						newUSD = dateData[s].openingBal.opBal;
						newUSDDate = dateData[s].openingBal.opBalDate;
						
						foundABalance=1;
					}
				}
				
				if (foundABalance == 0){
					//...boggerol...
					var snapshotU = await firebase.database().ref('/users/'+user.uid).once('value').catch((error)=>console.log(error));
					var snapValVarU = (snapshotU.val()) || [];
					
					newUSD = snapValVarU.usdBal;
					newUSDDate = snapValVarU.recentBalDate;
					
					var periodM = moment(newDataQ__[q].period, 'YYYY MMMM').format('YYYY MM');
					firebase.database().ref('/tradesMM/'+user.uid+'/'+periodM).update({
						openingBal: {'opBal':newUSD, 'opBalDate':newUSDDate},
					})
					
					
					
				}
				
				//
						dateBalRet = ((totalUSDTProfit/newUSD)*100).toFixed(2);
						latest_return = dateBalRet;
					//	console.log('HOME : dateBalRet: '+dateBalRet);
						completeReturn+=parseFloat(dateBalRet);
					//
				
				/* while ( (fountIt==0) && (y<newDataBal.length)){
					var mDate = moment(newDataBal[y].date, 'YYYY-MM-DD HH:mm:ss');
					
					var compareDate = moment(newDataQ__[q].period, 'YYYY MMMM');
					
					if ((moment.duration((mDate).diff(compareDate)).as('hours'))>=0) {
						console.log('FOUND IT>>>'+newDataBal[y].date+' & Balance:'+newDataBal[y].usd);
						fountIt=1;
						dateBalRet = ((totalUSDTProfit/newDataBal[y].usd)*100).toFixed(2);
						console.log('HOME : dateBalRet: '+dateBalRet);
						completeReturn+=parseFloat(dateBalRet);
					}
					y++;
				} */  
				
			}
			
			//console.log('completeReturn::>>'+completeReturn)
			
			this.setState({
				orderRecordsJSON: newDataQ,
				perRet:completeReturn.toFixed(2),
				perRetLatest: latest_return,
			})
			
			
			
			
	}
	
	
	 
	 render(){
		 let latestOrdersList = this.state.orderRecordsJSON.map((val, key, index) => {
			 var usdtQty= (parseFloat(val.orderQty)*parseFloat(val.priceBought)).toFixed(2);
			// console.log('usdtQty:'+usdtQty);
			 var model_ = 'N/A';
			 if (val.model){
				 model_ = val.model;
			 }
			 
			 return 	<View key={key} style={[styles_.blockCol_,{  flexDirection:'row', justifyContent:'center' }]} >
							<View style={[ {  flex:0.9,  borderRadius:6, margin:5,   },]} >
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, fontWeight: 'bold',  }]} >{val.method}</Text>
									</View>
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, fontWeight: 'bold', }]} >{val.date}</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View>
										<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21, margin:10,  }]} > {val.symbol} </Text>
									</View>
									<View>
										<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21, margin:10, }]} > {val.perc_return}%</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginLeft:10, }]} >Entry Price</Text>
									</View>
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginRight:10, }]} >{val.priceBought}</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginLeft:10, }]} >Exit Price</Text>
									</View>
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginRight:10, }]} >{val.orderPrice}</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginLeft:10, }]} >Quantity</Text>
									</View>
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginRight:10, }]} >{usdtQty}</Text>
									</View>
								</View>
								<View style={{flexDirection:'row', justifyContent:'space-between' }} >
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginLeft:10, }]} >Model</Text>
									</View>
									<View style={{padding:5, }} >
										<Text style={[styles_.lightLogoCol_, { fontSize:12, marginRight:10, }]} >{model_}</Text>
									</View>
								</View>
							</View>
						</View>
						
		 })
		 
		 return (
			<View style={[styles_.backgroundCol_, { flex:1, } ]}>
				<View style={{flexDirection:'row', justifyContent:'space-between', margin:10, }} >
					<View>
						<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21,  marginBottom:0,  }]} >Balance {this.state.balance}</Text>
						<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21,  marginTop:0,  }]} >Available {this.state.av_bal}</Text>
						<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21,  marginTop:0, }]} > Return {this.state.perRet}%</Text>
						<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21,  marginTop:0, }]} > This Month {this.state.perRetLatest}%</Text>
					</View>
					<View>
						
						
					</View>
				</View>
			
				<View style={{flexDirection:'row', justifyContent:'space-around', margin:10, }} >
						
						<Button onPress={() => this.props.navigation.toggleDrawer()} style={{flexDirection:'column',  marginBottom:18,  alignItems:'center',  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
							<Icon style={[this.state._LPCol, { marginBottom:8, },]} name='account-circle-outline' type='MaterialCommunityIcons' />
							<Text style={[this.state._LPCol, { fontSize:10 },]} >Account</Text>
						</Button>
						
						
						<Button onPress={() => this.props.navigation.navigate("Details")} style={{flexDirection:'column',  marginBottom:18,  alignItems:'center',  backgroundColor:'rgba(0,0,0,0)', shadowOffset: { height: 0, width: 0 }, shadowOpacity: 0, elevation:0,  }} >
							<Icon style={[this.state._LPCol, { marginBottom:8, },]} name='dotchart' type='AntDesign' />
							<Text style={[this.state._LPCol, { fontSize:10 },]} >Statistics</Text>
						</Button>
						
						
				</View>
			
			
			<Text style={[styles_.lightLogoCol_, { fontWeight: 'bold', fontSize:21, margin:10, marginBottom:10, alignSelf:'center',  }]} > Latest Trades</Text>
				<ScrollView>
					{latestOrdersList}
				</ScrollView>
			</View>
		 )
	 }
	
//const HomeScreen = ({ navigation}) => {
	
	
		
	
};

export default HomeScreen;


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
