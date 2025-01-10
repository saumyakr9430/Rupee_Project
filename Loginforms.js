import React, { Component } from 'react';
import {
  Platform,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';

import {styles} from './styles';
export default class loginform extends React.Component {
  constructor(props) {
    super(props);
    this.state = { password: '', email: '' };
  }

  async checkUser(data) {
    try {
      let response = await fetch('http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      let responseJson = await response.json();
      return responseJson;
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
    
      <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Login</Text>
        <TextInput
          style={styles.textinput}
          placeholder="Your email"
          underlineColorAndroid={'transparent'}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          style={styles.textinput}
          placeholder="Your Password"
          secureTextEntry={true}
          underlineColorAndroid={'transparent'}
          onChangeText={password => this.setState({ password })}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              let isadmin = await this.checkUser(this.state);
              if (isadmin.val == 'admin') {
                this.props.navigation.navigate('admin');                
              } else if (isadmin.val == 'user') {
                let user = {
                  mail: this.state.email,
                };
                AsyncStorage.setItem('userMail', JSON.stringify(user), () => {
                this.props.navigation.navigate('option');
                });   
              } else if (isadmin.val == 'nouser') {
                alert('Login failed');
                this.props.navigation.navigate('login');
              }
            } catch (err) {
              console.log(err);
            }
          }}>
          <Text style={styles.btntext}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            this.props.navigation.navigate('signup');
          }}>
         <Text style={styles.btntext}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('forgetpasswords');
          }}>
          <Text style={styles.btntext}>Forget Password</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}
