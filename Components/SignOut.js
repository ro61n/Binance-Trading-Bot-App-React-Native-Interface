import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator, Image } from 'react-native';
//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

import firebase from 'firebase';


class SignOut extends Component {

	componentDidMount(){
		this.SignOutUser();
	}

	SignOutUser = () =>{
		firebase.auth().signOut().then(function() {
			
				this.props.navigation.navigate('SignUpScreen');
				console.log(' not logged in' );
				
				
			
		}.bind(this)
		);
	}

	render(){
		return(
			<View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: 'white'}}>
			
			<Text style={{padding:10}}>Signing Out...</Text>
				<ActivityIndicator size="large" style={{padding:10}} />
			</View>
		);
	}
}

export default SignOut;


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
