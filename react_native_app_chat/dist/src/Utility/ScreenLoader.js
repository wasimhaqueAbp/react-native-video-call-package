import React, { useEffect, useRef } from 'react';

import {
    StyleSheet,
    View,
    Text,
    ActivityIndicator,
    Animated,
    Easing
  } from 'react-native';


import {useTheme } from 'react-native-paper';




export const ScreenLoader = ({text = null, loading=false, topMargin=55, elevation=5})=> {



let effect = useRef(new Animated.Value(0)).current;

useEffect( () => {
     
  if(loading){

    Animated.timing(effect, {
      toValue: 1.0,
      easing: Easing.linear, 
      useNativeDriver: true,
     
    }).start()
  }
  else {

    Animated.timing(effect, {
      toValue: 0.0,
      easing: Easing.linear,
      useNativeDriver: true,
     
    }).start()

  }

}, [loading]);



return (

<View style={[styles.container, {top:topMargin}]}>

    <Animated.View style={[styles.activityIndicatorWrapper, {opacity:effect, elevation:elevation}]}>
    <ActivityIndicator
    animating={loading}
    color={"red"}
    size="large"
    style={styles.activityIndicator}
    />
    {text != null && (
    <Text style={{ fontSize: 16,textAlign: 'center'}}> {text} </Text>
    )}
    </Animated.View>

</View>
)

}


const styles = StyleSheet.create({

    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        position: 'absolute',
        alignContent:'center',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:'transparent',
    },

    activityIndicatorWrapper: {
        paddingVertical:8,
        paddingHorizontal:10,
        borderRadius: 10,
        backgroundColor:'#FFFFFF',
        alignItems: 'center',
        minWidth:110,
        elevation:5,
      },
      activityIndicator: {
        height: 80,
      },

})
//backgroundColor:'#EEEEEE',
//