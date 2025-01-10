import React, { Component } from 'react';
import {
  Platform,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';

export default class adminpage extends React.Component {
  render() {
    return (
      <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Admin</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => 
          {
            this.props.navigation.navigate('viewprojectrequest');
          }}
        >
          <Text style={styles.btntext}>Project Upload Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            this.props.navigation.navigate('viewmoneyrequest');
          }}
        >
          <Text style={styles.btntext}>Money Pull Requests</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}
