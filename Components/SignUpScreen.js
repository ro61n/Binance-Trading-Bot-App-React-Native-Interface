import React, {Component} from 'react';
import { StyleSheet, Text, View,  SafeAreaView, ActivityIndicator, Button, Image, ScrollView, Modal, Dimensions } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';


import {Container, Content, Header, Form, Input, Item, Label} from 'native-base';

import * as firebase from 'firebase';
import {firebaseConfig} from '../config'
//import 'firebase/firestore';


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}




class SignUpScreen extends Component {

	constructor(props) {
		super(props);
		
		this.state=({
			email:'',
			password:'',
			confirmPassword:'',
			modalVisible: false,
			modalHeading:'',
			modalDescription:'',
		});
	}
	
	setModalVisible(visible) {
		this.setState({modalVisible: visible});
	}
	
	openTOSPP(whichOne){
		
		//TermsOfService
		
		if (whichOne=='TermsOfUse'){
			
			this.setState({
				modalHeading:'Terms of Use',
				modalDescription:'Description of the Terms of Use will be shown here in future....',
			});
			
			this.setModalVisible(!this.state.modalVisible);
		}
		
		if (whichOne=='Privacy'){
			
			this.setState({
				modalHeading:'Privacy Policy',
				modalDescription:'Description of the privacy policy will be shown here in future....',
			});
			
			this.setModalVisible(!this.state.modalVisible);
		}
	}
	
	signUpUser = (email, password, confirmPassword) => {
		
			if (this.state.password.length<6){
				alert("Please enter at least 6 characters");
				return;
			}
			
			if (this.state.password != this.state.confirmPassword ){
				alert('The password does not match the one in the confirmed box');
				return;
			}
			
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				this.props.navigation.navigate('Loading');
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				// ...
				
			});
		
	}
	
	loginUser = (email, password) => {
		
			firebase.auth().signInWithEmailAndPassword(email, password).then( user => {
				this.props.navigation.navigate('Loading');
				console.log('logged in');
				console.log(user);
				
				//const test_a =  firestore.collection("p_user")
				
				
				
			})
			.catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				// ...
				
			});
		
	}

	componentDidMount(){
		//this.checkIfLoggedIn();
		
		if (this.state.modalVisible!=false){
			this.setModalVisible(!this.state.modalVisible);
		}
	}

	

	render(){
		return(
			<ScrollView style={{backgroundColor:'rgba(255, 255, 255, 1)'}} >
				
				<View style={{ alignItems: 'center'}} >
						<Text style={[styles.headingA, {paddingTop:25, marginTop:25, justifyContent:'center' }]} >Sign Up</Text>
					</View>	
			
				<Form>
					<Item floatingLabel>
						<Label>Email</Label> 
						<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' onChangeText={ (email)=> this.setState({email}) } />
					</Item>
					
					<Item floatingLabel>
						<Label>Password</Label> 
						<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' secureTextEntry={true} onChangeText={ (password)=> this.setState({password}) } />
					</Item>
					
					<Item floatingLabel>
						<Label>Confirm Password</Label> 
						<Input autoCorrect={false} autoCapitalize='none' autoCapitalize='none' secureTextEntry={true} onChangeText={ (password)=> this.setState({password}) } />
					</Item>
					
					
					<View style={{padding:5, alignItems:'center', }}>
						<Text style={{marginTop:20,}} >By Signing Up, I agree to the following:</Text>
					</View>
					<View style={{padding:5, marginTop:2, alignItems:'center', }}>
						<Text style={{ textDecorationLine: 'underline', }} onPress={() => { this.openTOSPP('TermsOfUse'); }} >Terms of Service</Text>
					</View>
					<View style={{padding:5, marginTop:2, alignItems:'center', }}>
						<Text style={{ textDecorationLine: 'underline', }} onPress={() => {  this.openTOSPP('Privacy'); }}  >Privacy Policy</Text>
					</View>
					
					<View style={{padding:5, marginTop:15, }} >
										<Button title="Sign Up" color='#8E0E0A' size='25' onPress={()=> this.signUpUser(this.state.email, this.state.password)}  />
					</View>
					
					
					<View style={{padding:5, marginTop:15, alignItems:'center', }}>
						<Text>Already have an account?</Text>
					</View>
					<View style={{padding:5, marginTop:3, alignItems:'center', }}>
						<Text style={{ textDecorationLine: 'underline', }} onPress={()=>this.props.navigation.navigate('WelcomeScreen')} >Login</Text>
					</View>
					
				</Form>
				
				<Modal animationType="slide" transparent={true} visible={this.state.modalVisible} onRequestClose={() => { Alert.alert('Modal has been closed.'); }}>
					<View style={{position:'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height, backgroundColor:'rgba(0,0,0,0.5)', left:0, right:0, top:0, bottom:0,  justifyContent: 'center', alignItems: 'center', }} >
						<View style={{ paddingTop:50, position: 'absolute', width: Dimensions.get('window').width, height: Dimensions.get('window').height*0.8, backgroundColor:'rgba(255,255,255,0)', left:0, right:0, top:0, bottom:0, justifyContent: 'center', alignItems: 'center', }} >
							<View style={{ width: Dimensions.get('window').width*0.9, height: Dimensions.get('window').height*0.8, backgroundColor:'rgba(255,255,255,1)',  justifyContent: 'center', alignItems: 'center', }} >
								<View style={{alignSelf: 'flex-end', marginTop:0 }} >
									<Icon color='#8E0E0A'  size={30}  name='close'   onPress={() => { this.setModalVisible(!this.state.modalVisible); }} />
								</View>
								
								
									
										
										
										
										
										 <ScrollView style={{ width: Dimensions.get('window').width*0.9,  }} >
										 
											
										 
											
											
														
														
											<View style={{flexDirection:'row', justifyContent:'space-between', }}>
												<View>
													<Text style={{ fontSize:20, paddingBottom:10, justifyContent:'space-between', }} >{this.state.modalHeading}</Text>
												</View>
											</View>
											<View style={{flexDirection:'row', justifyContent:'space-between', }}>	
												<View>
													<Text style={[styles.listText, {paddingLeft: 20, }]} >{this.state.modalDescription}</Text>
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
				
			</ScrollView>
		);
	}
}

export default SignUpScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
	padding:10,
  },
  headingA: {
    color: '#493D26',
	fontSize:25,
  },
});
