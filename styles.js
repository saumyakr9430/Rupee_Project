import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#ededed',
        paddingLeft: 20,
        paddingRight: 20,
    },
    innerContainer: {
        elevation:1,
        backgroundColor:'white',
        alignItems:'center',
        padding:15,
        borderRadius:10
    },
    button: {
        alignSelf: 'stretch',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#00b9f1',
        marginTop: 8,
        marginBottom:8,
        borderRadius: 5,
    },
    btntext: {
        color: '#fff',
        fontSize:20,
    },
    header: {
        alignSelf:'center',
        fontSize: 32,
        // color: '#fff',
        paddingBottom: 10,
        marginBottom: 40,
        borderBottomColor: '#012F6F',
        borderBottomWidth: 1,
    },
    textinput: {
        alignSelf: 'stretch',
        height: 40,
        marginBottom: 30,
        borderBottomColor: '#012F6F',
        borderBottomWidth: 1,
    },
});
export { styles };
