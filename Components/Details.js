import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, FlatList, ScrollView, Clipboard, Modal, Dimensions, TextInput } from 'react-native';
//import {createSwitchNavigator, createAppContainer, createDrawerNavigator, createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';
//import { WebView } from 'react-native-webview';

//import orderLog from '../json/orderLog.json';
//import Binance from 'binance-api-react-native';
var CryptoJS = require("crypto-js");

import * as firebase from 'firebase';
import {firebaseConfig} from '../config'
if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
}













class DetailsScreen extends Component {
	
constructor(props){
		super(props);
		this.state ={
			graphX_JSON:[],
			graphY_JSON:[],
			totalPreviousFees:0,
			totalFeeMonth:0,
			totalFeesIncurred:0,
			totalAmountReceived:0,
			totalOutstanding:0,
			publicKey:'',
			currentPeriodData:[],
			paymentDue:'',
			modalVisible: false,
			newDataQArr:[],
			newDataQArr_Specified:[],
			newDataQArr_SpecifiedB:[],
		}
		
		this.copyBtcAddress = this.copyBtcAddress.bind(this);
}		
			
	
componentDidMount(){
		this._getFBData();
		
		if (this.state.modalVisible!=false){
			this.setModalVisible(!this.state.modalVisible);
		}
		
}
	
async _getFBData(){
		
	
	//const client = Binance();//client2 is in the state
	
	var user = firebase.auth().currentUser;
	
	const snapshot = await firebase.database().ref('/users/' + user.uid).once('value');
	const ak = snapshot.val().a_k;
	const sk = snapshot.val().s_k;
		
	const bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
	const plaintext_ak = bytes_ak.toString(CryptoJS.enc.Utf8);
	
	const bytes_sk  = CryptoJS.AES.decrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(');
	const plaintext_sk = bytes_sk.toString(CryptoJS.enc.Utf8);
	
	//const client2 =  Binance({
	//	apiKey: plaintext_ak,
	//	apiSecret: plaintext_sk,
	//})
	
	
	var moment = require('moment');
	//var now = moment();
	
	
			
	
	//
			var tradeData=[];
			var snapshotK = await firebase.database().ref('/trades/'+user.uid).once('value');
			tradeData = snapshotK.val() || [] ;
			
			
			
			//var tradeHistory=[];
			var snapshotM = await firebase.database().ref('/trades_History/'+user.uid).once('value');
			//tradeHistory = snapshotM.val() || [] ;
			
			if (snapshotM.val()){
				var payDueDate = snapshotM.val().payDueDate;
				
				if (!payDueDate){
					var futureDate = (moment().add(3, 'M')).format('YYYY MM');
					//console.log('futureDate : '+futureDate)
					firebase.database().ref('/trades_History/'+user.uid).update({
						payDueDate:futureDate,
					})
					
					payDueDate = futureDate;
				}
				
			}
			else {
				//get current date and add 3 months to it...
				var futureDate = (moment().add(3, 'M')).format('YYYY MM');
				//console.log('futureDate : '+futureDate)
				firebase.database().ref('/trades_History/'+user.uid).update({
					payDueDate:futureDate,
				})
				
				payDueDate = futureDate;
			}
			
			//console.log('payDueDate::'+moment(payDueDate, 'YYYY MM').format('15 MMMM YYYY'));
			
			var paymentDueFormat = moment(payDueDate, 'YYYY MM').format('15 MMMM YYYY');
			
			
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
			
			
			
			var newDataQ = [];
			var h=0;
			for (var x in tradeData) {
				//newDataQ[h] = tradeData[x];
				tradeData[x].period = moment(x, 'YYYY MM').format('YYYY MMMM');
				newDataQ[h] = tradeData[x];
				h++;
			}
			console.log('newDataQ: : ');
			console.log(newDataQ);
			
			var totArrs = [];
			
			var dateBal = [];
			var endBalProfit = [];
				var C_endBalProfit = 0;
				
				var snapshotMM = await firebase.database().ref('/tradesMM/'+user.uid+'/').once('value').catch((error)=>console.log(error));
				var snapValVarMM = (snapshotMM.val()) ;
				var dateData = [];
				var h=0;
				for (var x in snapValVarMM) {
					snapValVarMM[x].period = moment(x, 'YYYY MM').format('YYYY MMMM');
					dateData[h] = snapValVarMM[x];
					h++;
				}
				
				
				console.log('NEW dateData:');
				console.log(dateData);
			
			for (var q=0; q<newDataQ.length; q++){
				var totalUSDTProfit=0;
				var numTrades=0;
				var serviceFee=0;
				var profitLossName='';
				
				for (var w=0; w<newDataQ[q].length; w++){
					totalUSDTProfit+=newDataQ[q][w].usdtProfit;
					serviceFee += newDataQ[q][w].btcFee;
					numTrades++;
				}
				
				
				
				
				if (serviceFee<0){
					serviceFee=0;
				}
				
				//var perRet = //latest balance...
				var fountIt=0;
				var y=0;
				var dateBalRet=0;
				
				var dateBalDate = 0;
				
				var depWit = 0;
				var depWitName;
				
				
				///
				
				var newUSD = 0;
				var newUSDDate = '';
				var foundABalance = 0;
				
				for (var s=0; s<dateData.length; s++){
					if (dateData[s].period == newDataQ[q].period){
						console.log('GOOD -- - dateData[s].period:'+dateData[s].period);
						
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
					
					var periodM = moment(newDataQ[q].period, 'YYYY MMMM').format('YYYY MM');
					firebase.database().ref('/tradesMM/'+user.uid+'/'+periodM).update({
						openingBal: {'opBal':newUSD, 'opBalDate':newUSDDate},
					})
					
					//
					
					//////////
					
					//////////
					
				}
				
				console.log('newUSD:'+newUSD);
				dateBalRet = ((totalUSDTProfit/newUSD)*100).toFixed(2);
				console.log('dateBalRet:'+dateBalRet)
				dateBal.push(newUSD);
				//dateBalDate = moment(newUSDDate).format('YYYY-MM-DD');
				dateBalDate = moment(newUSDDate).format('YYYY-MM-01');
				console.log('dateBalDate: '+dateBalDate);
				endBalProfit.push(parseFloat(newUSD)+parseFloat(totalUSDTProfit));
				
						if (typeof endBalProfit[C_endBalProfit-1] !== 'undefined') {
							depWit = dateBal[C_endBalProfit]-endBalProfit[C_endBalProfit-1];
						}
						else {
							depWit = 0;
						}
						
						if (parseFloat(totalUSDTProfit)<0){
							profitLossName='Loss';
						}
						else {
							profitLossName='Profit';
						}
						
						if (depWit<0){
							depWitName='Withdrawal';
						}
						else {
							depWitName='Deposit';
						}
						
						var y=0;
						
						var model_ = 'N/A';
						if (newDataQ[q].model){
							model_ = newDataQ[q].model;
						}
						
				totArrs.push({id:q, totUSDTProfit:totalUSDTProfit, period:newDataQ[q].period, numberOfTrades:numTrades, fee:serviceFee, periodReturn:parseFloat(dateBalRet), dateBalance:dateBal[C_endBalProfit], dateBalanceDate:dateBalDate, endBalanceProfit:endBalProfit[C_endBalProfit], dW:depWit, dWN:depWitName, pLN:profitLossName, model:model_, });
						
						C_endBalProfit++;		
				
				console.log('=-=-=-=-=-=-=-=-=-=-=-=---=--=-=- =-=-=-=-=-=-=-=-=-=-=-=---=--=-=-')
				///
				
				
				

				
				
				//totArrs.push({id:q, totUSDTProfit:totalUSDTProfit, period:newDataQ[q].period, numberOfTrades:numTrades, fee:serviceFee, periodReturn:parseFloat(dateBalRet), dateBalance:dateBal, dateBalanceDate:dateBalDate, endBalanceProfit:endBalProfit, });
				
				
				
			}
			
			console.log('::totArrs::');
			console.log(totArrs);
			
			//var totalFee =0;
			
			//-------------------------------- EVERYTHING BELOW IS OLD AND MUST GO>>>>
			
			//var totalUSDTProfit=0;
			//for (y=0; y<newDataQ.length; y++){
			//	totalUSDTProfit += newDataQ[y].usdtProfit;
			//}
			//console.log('totalUSDTProfit ; ; ');
			//console.log(totalUSDTProfit);
			
	//
	
	//*
	
	
	var totalPreviousFees_=0;
	
	var totalFeeMonth_ =0;
	for (var e=0; e<totArrs.length; e++){
		totalFeeMonth_ +=totArrs[e].fee;
	}

	//for (j=0; j<ReverseData.length; j++){
	
	
	
	//var totalFeesIncurred_ = totalFeeMonth_+totalPreviousFees_;
	var totalFeesIncurred_ = totalPreviousFees_+totalFeeMonth_;
	
	var totalAmountReceived_ = 0;
	
	var totalOutstanding_ = totalFeesIncurred_-totalAmountReceived_;
	//var totalOutstanding_ = 0;
	
	
	
	//setState used ot be here...
	
	//console.log('NEW JSON:::::');	
	//console.log(this.state.orderRecordsJSON);
	
	//check if user has an assigned key... if not, get one from the available list...
	//const snapshotK = await firebase.database().ref('/assignedKeys/').once('value');
	//snapDataK = snapshotK.val();
	//console.log('snapDataK....');
	//console.log(snapDataK);
	//if (!snapDataK){
	//	
	//}
	
	var user = firebase.auth().currentUser;
	
	var snapSK = await firebase.database().ref('/assignedKeys/').once('value');
	var snapDataSK = snapSK.val();
	
	var b=0;
	var newDataSK=[];
	for (var x in snapDataSK) {
		newDataSK[b] = snapDataSK[x];
		b++;
	}
	
	//console.log('newDataSK....');
	//console.log(newDataSK);
	
	var addNewEntry=1;
	var selectedKey:'';
	for (var y=0; y<newDataSK.length; y++){
		if (newDataSK[y].user == user.uid){
			
			var responseF = await fetch('https://blockchain.info/q/addressbalance/'+newDataSK[y].key);
			var resultF = await responseF.json();
			
			//console.log('resultF below');
			//console.log(resultF);
			
			var now = moment();
			
			if (resultF==0){
				//console.log('---- == 0');
				//	dont add because this one is available
				addNewEntry=0;
				selectedKey = newDataSK[y].key;
				//updated calculation and time...
				
				
				firebase.database().ref('assignedKeys/'+newDataSK[y].key).update({
					date: now.format('YYYY-MM-DD HH:mm:ss'),
					estBtc: (totalOutstanding_).toFixed(8),
				})
			}
			else {
				
				
				
				//add to total received... something seperate
				firebase.database().ref('assignedKeys/'+newDataSK[y].key).update({
					dateReceived: now.format('YYYY-MM-DD HH:mm:ss'),
					btcReceived: resultF,
				})
			}
			
			//if (newDataSK[y].){
			//	
			//}
			//else{
			//	
			//}
			
		}
		
	}
	
	
	if (addNewEntry==1){
		//b
		var snapshotK = await firebase.database().ref('/availableKeys/').once('value');
		snapDataK = snapshotK.val();
	
		var m=0;
		var newDataK=[];
		for (var x in snapDataK) {
			newDataK[m] = snapDataK[x];
			m++;
		}
	
		//console.log('newDataK....');
		//console.log(newDataK);
	
		var newavailableKeys=[];
		
		for (var h=0; h<newDataK.length; h++){
			if (h==0){
				var moment = require('moment');
				var now = moment();
				
			
			
				firebase.database().ref('assignedKeys/'+newDataK[0].key).set({
					date: now.format('YYYY-MM-DD HH:mm:ss'),
					origDate: newDataK[0].date,
					key: newDataK[0].key,
					index:newDataK[0].index,
					user: user.uid,
					estBtc: (totalOutstanding_).toFixed(8),
				})
			
				var removeThisRow = firebase.database().ref('/availableKeys/'+newDataK[0].key);
				removeThisRow.remove();
			}
		}
		//e
		selectedKey = newDataK[0].key;
	}
	
	
	this.setState({
		totalFeeMonth: totalFeeMonth_,
		totalFeesIncurred: totalFeesIncurred_,
		totalAmountReceived: totalAmountReceived_,
		totalOutstanding: totalOutstanding_,
		publicKey: selectedKey,
		currentPeriodData:totArrs,
		paymentDue: paymentDueFormat,
		newDataQArr:newDataQ,
		
	});
	
	
		
}

setModalVisible(visible) {
	this.setState({modalVisible: visible});
}

tradesForThisMonth(id){
	
	console.log('ID:::'+id);
	var dataMonth = this.state.newDataQArr;
	var selectedM = (dataMonth[id]).reverse();
	console.log(selectedM);
	
	var totalPerData = this.state.currentPeriodData;
	console.log('totalPerData::');
	console.log(totalPerData[id]);
	var selectedM_B = totalPerData[id];
	//newDataQArr_Specified
	//this.setState({newDataQArr_Specified: selectedM});
	this.setState({
		newDataQArr_Specified:selectedM,
		newDataQArr_SpecifiedB: selectedM_B,
	});
	
	
	console.log('New Data Specified below:')
	console.log(this.state.newDataQArr_Specified);
	this.setModalVisible(true);
}

copyBtcAddress(btc_Add){
	Clipboard.setString(btc_Add);
	alert('Address copied to clipboard');
}
	
	render(){
		let binB = this.state.newDataQArr_Specified.map((val, key,) => {
			return 	<View key={key} style={{flexDirection:'row',  }} >
						<View style={{ flex:0.99,  padding:4 }} >
							<View style={{flexDirection:'row', justifyContent:'flex-start', }}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 0, fontWeight: 'bold', }]} >{val.date}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'flex-start', }}>
								<View>
									<Text style={[styles.listText, {paddingLeft:15,  }]} >{val.symbol}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'flex-start', }}>
								<View>
									<Text style={[styles.listText, {paddingLeft:15,  }]} >Qty:</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:0,  }]} >{val.orderQty}</Text>
								</View>
							</View>
						</View>
						
					</View>
					
					
					
					
		});
		
		let bin = this.state.currentPeriodData.map((val, key,) => {
			return 	<View key={key} style={{flexDirection:'row', justifyContent:'center'}} >
						<View style={{  flex:0.99,  padding:4 }} >
							<View style={{flexDirection:'row', justifyContent:'flex-start', }}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 0, fontWeight: 'bold', }]} >{val.period}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{'Return:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30,  }]} >{(val.periodReturn).toFixed(2)+'%'}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{'Number of Trades:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {textDecorationLine: 'underline',  }]}  onPress={() => {  this.tradesForThisMonth(val.id); }} >{'[View Trades]'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30,  }]} >{val.numberOfTrades}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{'Approx '+val.dWN}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30,  }]} >{'$'+(val.dW).toFixed(2)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{'Balance on '+val.dateBalanceDate}</Text>
								</View>
								<View   style={[styles.borderTop, {  marginRight:30, }]} >
									<Text style={[styles.listText, ]} >{'$'+(val.dateBalance).toFixed(4)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{'End Balance'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30,  }]} >{'$'+(val.endBalanceProfit).toFixed(4)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10,  }]} >{val.pLN+':'}</Text>
								</View>
								<View   style={[styles.borderTop, {  marginRight:30, }]} >
									
									<Text style={[styles.listText, ]} >{'$'+(val.totUSDTProfit).toFixed(4)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 15,  }]} >{'Fee (2.8%):'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:20,  }]} >{'$'+(val.fee).toFixed(4)}</Text>
								</View>
							</View>
						</View>
					</View>
					
					
					
					
		});
		
		
		
		return(
			
			
			<ScrollView style={{backgroundColor:'#0F0F0F'}} >
			<View style={{flexDirection:'row', justifyContent:'center' }} >
				<View style={{flex:0.95, alignItems:'center', justifyContent:'center', alignItems:'stretch'}}>
					
					
					<View style={{ alignItems: 'flex-start'}} >
						<Text style={[styles.headingA, {paddingTop:10, paddingBottom:10, justifyContent:'center' }]} >Prev. Quarters:</Text>
					</View>	
					
					<View style={{flexDirection:'row', justifyContent:'center'}} >
						<View style={{flex:0.99,  padding:4 }} >
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10 }]} >{'Return:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30 }]} >{(this.state.totalPreviousFees).toFixed(2)+'%'}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingLeft: 10 }]} >{'Total Profit/Loss:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {paddingRight:30 }]} >{'$'+(this.state.totalPreviousFees).toFixed(4)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<Text style={[styles.listText, {textDecorationLine: 'underline', paddingLeft: 10  }]} >{'[View Trades]'}</Text>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, { paddingLeft:20, fontWeight: 'bold', }]} >{'Total Fee (Prev. Quarters):'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'$'+(this.state.totalPreviousFees).toFixed(4)}</Text>
								</View>
							</View>
						</View>
					</View>
						
					
					
					<View style={{ alignItems: 'flex-start'}} >
						<Text style={[styles.headingA, {paddingTop:10, paddingBottom:10, justifyContent:'center' }]} >Current Quarter:</Text>
					</View>	
					
					{bin}
					
					<View style={{flexDirection:'row', justifyContent:'center'}} >
						<View style={{flex:0.99,  padding:4,}} >
							<View style={{flexDirection:'row', justifyContent:'space-between'}}>
								<View>
									<Text style={[styles.listText, {paddingBottom:5, paddingLeft:20, fontWeight: 'bold', }]} >{'Total Fee (Current Quarter):'}</Text>
								</View>
								<View   style={[styles.borderTop, ]} >
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'$'+(this.state.totalFeeMonth).toFixed(4)}</Text>
								</View>
							</View>
							
							<View   style={[styles.borderBottom, {  flex:0.5, }]} />
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:10}}>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'Total Fees Incurred:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'$'+(this.state.totalFeesIncurred).toFixed(4)}</Text>
								</View>
							</View>
							
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15 }}>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'Total Amount Received:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {textDecorationLine: 'underline'  }]} >{'(View Details)'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'$'+(this.state.totalAmountReceived).toFixed(4)}</Text>
								</View>
							</View>
							<View   style={[styles.borderBottom, {  flex:0.5, }]} />
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15}}>
								<View>
									<Text style={[styles.listText, { fontWeight: 'bold', }]} >{'Total Outstanding:'}</Text>
								</View>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'$'+(this.state.totalOutstanding).toFixed(4)}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15}}>
								<View>
									<Text style={[styles.listText, { fontWeight: 'bold', }]} >{'Payment Due'+this.state.paymentDue}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15 }}>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'BTC Addess: (Tap on it to copy)'}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15 }}>							
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]}  onPress={  () => this.copyBtcAddress(this.state.publicKey) }  >{this.state.publicKey}</Text>
								</View>
							</View>
							<View style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15 }}>
								<View>
									<Text style={[styles.listText, {fontWeight: 'bold', }]} >{'[Please note that this address changes after every payment]'}</Text>
								</View>
							</View>
						</View>
					</View>
					
					
					
					<View style={{paddingTop:10, paddingBottom:15}}>
						<Button title="Back" color='#8E0E0A' size='25' onPress={()=>this.props.navigation.navigate('Home')} />
					</View>
					
					
				</View>
				
				
				<Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
					<View style={{position:'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor:'rgba(0,0,0,0.5)', left:0, right:0, top:0, bottom:0,  justifyContent: 'center', alignItems: 'center', }} >
						<View style={{ paddingTop:50, position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height*0.8, backgroundColor:'rgba(255,255,255,0)', left:0, right:0, top:0, bottom:0, justifyContent: 'center', alignItems: 'center', }} >
							<View style={{ width: Dimensions.get('window').width*0.9, height: Dimensions.get('window').height*0.8, backgroundColor:'grey',  justifyContent: 'center', alignItems: 'center', }} >
								<View style={{alignSelf: 'flex-end', marginTop:0 }} >
									<Icon color='#8E0E0A'  size={30}  name='close'   onPress={() => { this.setModalVisible(!this.state.modalVisible); }} />
								</View>
								
								
									
										
										
										
										
										 <ScrollView style={{ width: Dimensions.get('window').width*0.9,  }} >
										 
											<View>
												<Text style={[styles.listText, { fontSize:20, paddingBottom:10, justifyContent:'space-between', }]} >Trades for {this.state.newDataQArr_SpecifiedB.period}</Text>
											</View>
										 
											<FlatList  data={this.state.newDataQArr_Specified} renderItem={({ item, key }) => (
													<View style={{ flex:1,  padding:5, paddingTop:10, }} >
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 5, }]} >{item.date}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 10, fontWeight: 'bold', }]} >{item.symbol}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 20,  }]} >{'Model:'}</Text>
															</View>
															<View>
																<Text style={[styles.listText, {paddingRight: 40, }]} >{item.model}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 20,  }]} >{'Qty:'}</Text>
															</View>
															<View>
																<Text style={[styles.listText, {paddingRight: 40, }]} >{item.orderQty}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 20, }]} >{'Price Bought:'}</Text>
															</View>
															<View>
																<Text style={[styles.listText, {paddingRight: 40, }]} >{item.priceBought}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 20,  }]} >{'Price Sold:'}</Text>
															</View>
															<View>
																<Text style={[styles.listText, {paddingRight: 40,  }]} >{item.orderPrice}</Text>
															</View>
														</View>
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
															<View>
																<Text style={[styles.listText, {paddingLeft: 20, fontWeight: 'bold', }]} >{'Profit / Loss:'}</Text>
															</View>
															<View>
																<Text style={[styles.listText, {paddingRight: 10, fontWeight: 'bold', }]} >{'$'+(item.usdtProfit).toFixed(2)}</Text>
															</View>
														</View>
													</View>
												
												)}
												horizontal={false}
												onEndThreshold={0}
												keyExtractor={(item, index) => index.toString()}
											/>
											
														
														
														<View style={{flexDirection:'row', justifyContent:'space-between', }}>
														
															<View>
																<Text style={[styles.listText, {paddingLeft: 20, fontWeight: 'bold', }]} >{'Total Profit / Loss:'}</Text>
															</View>
															<View>
																<View   style={[styles.borderBottom, { flex:0.5, }]} />
																
																<Text style={[styles.listText, {paddingRight: 10, fontWeight: 'bold', }]} >$ {parseFloat(this.state.newDataQArr_SpecifiedB.totUSDTProfit).toFixed(4)}</Text>
															</View>
														</View>
											
										</ScrollView>
									
									
									
								
								<View style={{paddingTop:20, paddingBottom:15 , flexDirection:'row', }} >
									<View style={{padding:5, }} >	
										<Button title="Close" color='#8E0E0A' size='25' onPress={() => { this.setModalVisible(!this.state.modalVisible); }} />
									</View>
									
								</View>	
							</View>
						</View>
					</View>
				</Modal>
				
				
				
			</View>
			</ScrollView>
			
			
		);
	}
}

export default DetailsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: {
    color: 'white',
  },
  borderTop: {
    borderTopColor: 'white', 
	borderTopWidth: 1,
  },
  borderBottom: {
    borderBottomColor: 'white', 
	borderBottomWidth: 1,
  },
  headingA: {
    color: 'white',
	fontSize:20,
  },
  
});
