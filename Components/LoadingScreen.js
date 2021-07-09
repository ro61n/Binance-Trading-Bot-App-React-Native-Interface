import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, ActivityIndicator, Image } from 'react-native';

//import Icon from '@expo/vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

import firebase from 'firebase';


class LoadingScreen extends Component {

	componentDidMount(){
		this.checkIfLoggedIn();
	}

	checkIfLoggedIn = () =>{
		firebase.auth().onAuthStateChanged( function(user){
			if (user){
				//this.props.navigation.navigate('LoadExchange');
				
				this.props.navigation.navigate('LoadExchange');
				
				console.log('logged in');
				//alert('logged in ');
				//console.log(user);
				
				
				
			}
			else {
				//this.props.navigation.navigate('Welcome');
				console.log(' not logged in' );
				//alert(' Not logged in ');
				this.props.navigation.navigate('WelcomeScreen');
				
			}
		}.bind(this)
		);
	}

	render(){
		return(
			<View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: 'white'}}>
			
			<Image style={styles.image} source={require('../media/logo4.png')} />
			<Text style={{padding:10}}>Signing in...</Text>
				<ActivityIndicator size="large" style={{padding:10}} />
			</View>
		);
	}
}

export default LoadingScreen;


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
