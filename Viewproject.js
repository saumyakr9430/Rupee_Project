import React from 'react';
import { Platform, KeyboardAvoidingView, Text, AsyncStorage , TextInput, View, Dimensions, Image, Animated, PanResponder, ActivityIndicator, ScrollView, TouchableWithoutFeedback , TouchableOpacity} from 'react-native';
import {styles} from './assets/styles/styles'
import { Header } from 'react-navigation';

const SCREEN_HEIGHT = Dimensions.get('window').height
const SCREEN_WIDTH = Dimensions.get('window').width
import Icon from 'react-native-vector-icons/Ionicons'
import { AuthSession } from 'expo';


export default class Decker extends React.Component {

  constructor() {
    super();
    this.email = 'hi';
    this.position = new Animated.ValueXY();
    this.swipedPosition = new Animated.ValueXY({ x: -SCREEN_WIDTH-100, y:0 });
    this.gestPosition = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      isLoading: true,
    }
    this.lastIndex = 4

    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0],
      outputRange: ['-10deg', '0deg'],
      extrapolate: 'clamp'
    })
    this.cardOpacity = this.gestPosition.x.interpolate({
        inputRange: [0,SCREEN_WIDTH / 2],
        outputRange: [1, 0.5],
        extrapolate: 'clamp'
      })
    this.cardScale = this.gestPosition.x.interpolate({
        inputRange: [0,SCREEN_WIDTH / 2],
        outputRange: [1, 0.8],
        extrapolate: 'clamp'
      })
    this.swipedRotate = this.swipedPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0],
        outputRange: ['-10deg','0deg'],
        extrapolate: 'clamp'
    })

    this.rotateAndTranslate = {
      opacity: this.cardOpacity,  
      
      transform: [{
        rotate: this.rotate,
        
      },
      {
        scale: this.cardScale
      },
      ...this.position.getTranslateTransform()
      ]
    }

    this.swipedTrasnform = {
        transform: [{
            rotate: this.swipedRotate
        },
        ...this.swipedPosition.getTranslateTransform()
        ]
    }

    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp'
    })
  }

  componentWillMount() { 
    fetch('http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/adminprojects')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(JSON.stringify(responseJson));
        var arr = Object.keys(responseJson).map((k) => { return {id:k ,...responseJson[k]} });
        // var arr1 = Object.keys(responseJson);
        // console.log(arr);
        this.setState({
          isLoading: false,
          dataSource: arr,
        })
        this.lastIndex = arr.length - 1;
        })
      .catch((error) =>{
        console.error(error);
      })
      
    this.PanResponder = PanResponder.create({

    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      
        if(gestureState.dx<0) {
            this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
        }
        else if(gestureState.dx>0 && this.state.currentIndex > 0) {
            this.swipedPosition.setValue({ x:-SCREEN_WIDTH - 100 + gestureState.dx, y: 0})
        }
        this.gestPosition.setValue({ x: gestureState.dx, y: gestureState.dy })
    },
    onPanResponderRelease: (evt, gestureState) => {

        if (gestureState.dx > 120) {    // swipe right (load previous card)  
          Animated.timing(this.swipedPosition, {
              toValue: { x:0, y:0 },
              duration: 150
          }).start(() => {
              this.setState({ currentIndex: (this.state.currentIndex) ? this.state.currentIndex - 1: 0 }, () => {
                this.position.setValue({ x: 0, y: 0 })
                this.swipedPosition.setValue({ x:-SCREEN_WIDTH-100, y:0 })
                this.gestPosition.setValue({ x: 0, y: 0 })
            });
          });
        }
        else if (gestureState.dx < -120 && this.state.currentIndex < this.lastIndex) { 
           // swipe left (load next card)
            Animated.timing(this.position, {
                toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy },
                duration: 150
            }).start(() => {
              this.setState({ currentIndex: (this.state.currentIndex<this.lastIndex) ? this.state.currentIndex + 1:this.lastIndex },
              () => {
                this.position.setValue({ x: 0, y: 0 })
                this.swipedPosition.setValue({ x:-SCREEN_WIDTH-100, y:0})
                this.gestPosition.setValue({ x: 0, y: 0 })
              });
            });   
        }

        else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()
          Animated.spring(this.gestPosition, {
            toValue: { x: 0, y: 0 },
            friction: 4
          }).start()

          Animated.spring(this.swipedPosition, {
            toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
            friction: 4
          }).start()
        }
      }
    })
  }

  onFocus = () => {
    this.setState({
        backgroundColor: 'green'
    })
  }

  onBlur = () => {
    this.setState({
      backgroundColor: '#ededed'
    })
  }
  _renderHeader= (item) => {

    return(
      <View style={styles.cardHeader}>
        <Text 
          style={styles.projectName}>{item.projectName}</Text>
      </View>
    )
  }

  _renderContent = (item) => {

    return(
      <View style={styles.cardContent}>
      <ScrollView >
        <TouchableWithoutFeedback>
          <View style={{padding:3}}>
              <Text style={styles.genText}>Short Desc- {item.shortDescription}</Text>
              <Text style={styles.genText}>Account NO.- {item.accountNo}</Text>
              <Text style={styles.genText}>IFSC Code- {item.ifscCode}</Text>
              <Text style={styles.genText}>Education Qualification- {item.education}</Text>
              {/* <Text style={styles.genText}>Total Amount- {item.projectbalance}</Text>
              <Text style={styles.genText}>Total Withdrawn Amount- {item.projectwithdrawn}</Text>
              <Text style={styles.genText}>Requested Amount- {item.requestedbalance}</Text> */}
              <Text style={styles.genText}>Long Desc- {item.longDescription}</Text>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
      </View>
    )
  }

  _renderFooter = () => {

    return(
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.submitButton}
        onPress={() => {
          // console.log(this.state.dataSource[this.state.currentIndex].refID);
          fetch('http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/updateprojects?id='+this.state.dataSource[this.state.currentIndex].refID)
          .then(
            alert("Updated Succesfully. Please refresh to see changes.")
            )
          .catch((error) =>{
            console.error(error);
          }); 
        }}>
          <View style={{}}>
            <Text
              style={{fontSize:15, color:'#000000'}}>Approve</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton}
        onPress={() => {
          // console.log(this.state.dataSource[this.state.currentIndex].refID);
          fetch('http://ec2-3-14-86-69.us-east-2.compute.amazonaws.com/updatedenyprojects?id='+this.state.dataSource[this.state.currentIndex].refID)
          .then(
            alert("Updated Succesfully. Please refresh to see changes.")
            )
          .catch((error) =>{
            console.error(error);
          }); 
        }}>
          <View style={{}}>
            <Text
              style={{fontSize:15, color:'#000000'}}>Deny</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderUsers = () => {

    if(this.state.isLoading==true)
      return(
          <ActivityIndicator/>
      );

    return this.state.dataSource.map((item, i) => {
      if (i==this.state.currentIndex - 1){

          return (
            <Animated.View
            key={item.id} style={[this.swipedTrasnform, styles.card]}>
            {this._renderHeader(item)}
            {this._renderContent(item)}
          </Animated.View>
          )
      }
      else if (i == this.state.currentIndex) {

        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.id} style={[this.rotateAndTranslate, styles.card]}>
            {this._renderHeader(item)}
            {this._renderContent(item)}
          </Animated.View>
        )
      }

      else if(i == this.state.currentIndex + 1){
        
        return (
          <Animated.View
            key={item.id} style={[{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              
            }, styles.card]}>
            {this._renderHeader(item)}
            {this._renderContent(item)}
          </Animated.View>
        )
      }
      else 
        return null

    }).reverse()
  }

  render() {
    return (  
      <KeyboardAvoidingView behavior='height' style={{ flex: 1 }} keyboardVerticalOffset = {Header.HEIGHT + 30}>
        <View style={{flex: 1, justifyContent: "flex-end",}}>      
          <View style={{ backgroundColor: '#ededed',flex:1}}>
              {this.renderUsers()}
          </View>
          {this._renderFooter()}
        </View>
      </KeyboardAvoidingView>
    );
  }
}
