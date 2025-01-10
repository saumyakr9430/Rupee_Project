import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      // height: SCREEN_HEIGHT - 50,
      width: SCREEN_WIDTH,
      padding: 10,
      position: 'absolute',
      justifyContent:'flex-start'
    },
    cardContent: {
      height: SCREEN_HEIGHT - 200,
      padding:10,
      elevation:1,
      backgroundColor: 'white',
      borderBottomColor: '#ededed',
      borderBottomWidth:1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    cardHeader: {
      height: null,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomWidth : 2,
      borderBottomColor : '#002E6E',
      elevation:1,
      backgroundColor:'white',
      paddingLeft: 15,
      paddingRight: 15,
      // paddingBottom: 5,
      paddingTop: 5,
    },
    cardFooter: {
      height: null,
      elevation:2,
      backgroundColor:'#002E6E',
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 5,
      paddingTop: 5,
      flexDirection:"row",
      justifyContent: "space-between",
    },
    projectName: {
      fontSize:SCREEN_WIDTH/10,
    },
    genText: {
      textAlign: 'justify',
      fontSize: 15,
      borderBottomWidth : 1,
      paddingBottom : 3,
      borderBottomColor: '#ededed',
    },
    textInput: {
      borderWidth:1,
      elevation:-1,
      borderColor:"#002E6E",
      backgroundColor:'white',
      width:0.8*SCREEN_WIDTH - 70,
      height: 38,
      borderRadius: 5,
      textAlign: 'center'
    },
    submitButton: {
      backgroundColor:'#fff',
      height:40,
      width:SCREEN_WIDTH/5,
      borderRadius: 5,
      elevation:1,
      borderColor:'#012F6F',
      borderWidth:1,
      justifyContent: 'center',
      alignItems: 'center',
      padding:3
    }
  });
export { styles };  