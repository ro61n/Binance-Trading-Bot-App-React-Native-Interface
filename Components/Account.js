import React, {Component} from 'react';
import { StyleSheet, Text, View,  SafeAreaView, ScrollView, Button, } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

import {Container, Content, Header, Form, Input, Item,  Label} from 'native-base';

import * as firebase from 'firebase';
import {firebaseConfig} from '../config'
//import 'firebase/firestore';

//var db = firebase.firestore();

var CryptoJS = require("crypto-js");





//db.collection('users').get()
  //.then((snapshot) => {
  //  snapshot.forEach((doc) => {
  //    console.log(doc.id, '=>', doc.data());
  //  });
  //})
  //.catch((err) => {
  //  console.log('Error getting documents', err);
  //});
  
  

class Account extends Component {

	constructor(props) {
		super(props);
		
		this.state=({
			a_k:'',
			s_k:'',
			buttonFunction:'Save',
			titleA:'Enter API Keys',
			titleB:'Please create an API key on your Binance exchange account and copy it into the box below. If you are not sure how, there are many short YouTube tutorials explaining the process. [In future, Lamborithm will support other exchanges too]',
			a_string:'',
			s_string:'',
			
		});
	}
	
	componentDidMount(){
		this._getKeys();	
	}
	
	_getKeys(){
		var user = firebase.auth().currentUser;
		
		return firebase.database().ref('/users/' + user.uid).once('value').then( snapshot => {
			var ak = (snapshot.val().a_k) || '';
			//var sk = snapshot.val().s_k;
			
			var bytes_ak  = CryptoJS.AES.decrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(');
			var plaintext_ak = bytes_ak.toString(CryptoJS.enc.Utf8);
			
			
					this.setState({
					buttonFunction: "Update",
					a_k:plaintext_ak,
					s_k:'...........................',
					a_string: 'API Key: '+plaintext_ak,
					s_string:'Secret Key: ...........................',
					titleA:'Your API Keys',
				});
			
			
			
			
			
		});
		
		//var bytes_ak  = CryptoJS.AES.decrypt(doc.data().a_k, '#yB*32_Ppz'+user.uid+'gpwo12(');
		//var plaintext_ak = bytes_ak.toString(CryptoJS.enc.Utf8);
				
		
				
		//})
		//.catch(function(error) {
		//	console.log("Error getting documents: ", error);
		//});
	}

	addAPIData = (ak, sk) => {
		var user = firebase.auth().currentUser;
		
		var ciphertext_ak = (CryptoJS.AES.encrypt(ak, '#yB*32_Ppz'+user.uid+'gpwo12(')).toString();
		var ciphertext_sk = (CryptoJS.AES.encrypt(sk, '#yB*32_Ppz'+user.uid+'gpwo12(')).toString();
		
		//console.log(ciphertext_ak.toString());
		
			
			firebase.database().ref('/users').child(user.uid).update({ a_k: ciphertext_ak, s_k: ciphertext_sk })
			
			this._getKeys();
		
		//this.props.navigation.navigate('CheckApi');
		this.props.navigation.navigate('LoadExchange');
	}
	


	render(){
		return(
			
			<ScrollView style={{backgroundColor:'rgba(255, 255, 255, 1)'}} >
				
				<View style={{ alignItems: 'center'}} >
					<Text style={[styles.headingA, {padding:10, justifyContent:'center' }]} >{this.state.titleA}</Text>
				</View>
				
				<View style={{ alignItems: 'flex-start', margin:3, padding:10,}} >
					<Text style={[styles.listText, { fontSize:12, color: 'grey'}]} >{this.state.titleB}</Text>
				</View>
				
				<View style={{ alignItems: 'flex-start', margin:3, padding:5, paddinTop:10,}} >
					<Text style={[styles.listText, { fontSize:12, color: 'grey'}]} >{this.state.a_string}</Text>
				</View>
				
				<View style={{ alignItems: 'flex-start', margin:3, padding:5,}} >
					<Text style={[styles.listText, { fontSize:12, color: 'grey'}]} >{this.state.s_string}</Text>
				</View>
				
			
				
				<Form>
					<Item floatingLabel>
						<Label>API Key</Label> 
						<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' onChangeText={ (a_k)=> this.setState({a_k}) } />
					</Item>
					
					<Item floatingLabel>
						<Label>Secret Key</Label> 
						<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' secureTextEntry={true} onChangeText={ (s_k)=> this.setState({s_k}) } />
					</Item>
					
				
					
					<View style={{padding:5, marginTop:10, }} >
						<Button title={this.state.buttonFunction} color='#8E0E0A' size='25' onPress={()=> this.addAPIData(this.state.a_k, this.state.s_k)}  />
					</View>
					
				</Form>
			</ScrollView>
		);
	}
}


export default Account;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
	padding:10,
  },
  headingA: {
    color: '#493D26',
	fontSize:20,
  },
  listText: {
    color: '#493D26'
  },
});
