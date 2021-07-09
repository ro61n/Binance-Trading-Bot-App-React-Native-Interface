import React, {Component} from 'react';
import { StyleSheet, Text, View,  SafeAreaView, ActivityIndicator, Button, Image, ScrollView} from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';


import {Container, Content, Header, Form, Input, Item, Label} from 'native-base';

import * as firebase from 'firebase';
import {firebaseConfig} from '../config'
//import 'firebase/firestore';


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}




class LoadingScreen extends Component {

	constructor(props) {
		super(props);
		
		this.state=({
			email:'',
			password:'',
		});
	}
	
	signUpUser = (email, password) => {
		
			if (this.state.password.length<6){
				alert("Please enter at least 6 characters");
				return;
			}
			
			firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
				// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				// ...
				
			});
		
	}
	
	loginUser = (email, password) => {
		
			firebase.auth().signInWithEmailAndPassword(email, password).then( user => {
				//this.props.navigation.navigate('Loading');
				this.props.navigation.navigate('LoadingA');
				console.log('logged in');
				//console.log(user);
				
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
		
	}

	

	render(){
		return(
			<ScrollView style={{  flex: 1, backgroundColor: '#fff', padding:10,}} >
				
				<View style={{padding:5, margin:10, alignItems:'center', }}>
					<Image style={styles.image} source={require('../media/logo4.png')} />
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
					
				
					
					<View style={{padding:5, marginTop:15, }} >
										<Button title="Login" color='#8E0E0A' size='25' onPress={()=> this.loginUser(this.state.email, this.state.password)}  />
					</View>
					
					<View style={{padding:5, marginTop:10, alignItems:'center', }}>
						<Text>Dont have an account?</Text>
					</View>
					<View style={{padding:5, marginTop:3, alignItems:'center', }}>
						<Text style={{ textDecorationLine: 'underline', }} onPress={()=>this.props.navigation.navigate('SignUpScreen')} > Sign Up</Text>
					</View>
					
				</Form>
			</ScrollView>
		);
	}
}

export default LoadingScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
	padding:10,
  },
  image: {
        width: 200,
        height: 200,
		alignItems:'center',
		paddingTop:20,
		marginTop:20,
        
    },
});
