import React, { Component } from 'react';
import {Platform, StyleSheet,Text,TextInput,AsyncStorage,View,TouchableOpacity,Button,} from 'react-native';

import {styles} from './styles';

export default class options extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { email: 'hi' };
    // let uemail='hi';
    this.email = '';
  }

    //  console.log(email);
    // console.log('componentWillMount', i++);
  render() {
    userMail = AsyncStorage.getItem('userMail', (err, result) => {
     
      let maill = JSON.parse(result);
      maill = maill.mail;
      
      this.email = maill;
      console.log(this.email);
 });
    return (
      <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* {console.log(this.state.email)}  */}
        <Text style={styles.header}>Donate or Apply </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('deck');
          }}>
          <Text style={styles.btntext}>Donate</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
           this.props.navigation.navigate('owndeck');
                }}
        >
          <Text style={styles.btntext}>Your Projects</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('proj');
          }}
        >
          <Text style={styles.btntext}>Request for Donations</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}
