import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    Platform,
    Pressable
  } from 'react-native';

import {useTranslation, withTranslation} from 'react-i18next';
import {Button, IconButton, useTheme } from 'react-native-paper';




export const DefaultView = (props)=> {

const {title = 'No Internet Connection', action, style = null} = props

const {t, i18n } = useTranslation();
const theme = useTheme()

return (
<View style={[styles.container, style]}>
<View style={{alignItems:'center', justifyContent:'center'}}>
<Text style={{paddingTop:8, fontSize:16, color: 'gray'}}>  {title}</Text>
<Button style={{marginVertical:16,backgroundColor:"#EC0029"}} //icon="reload"
 mode="contained" color={"#EC0029"} onPress={action}> 
{"Retry"}
</Button>   
</View>
</View>
)

}



export const RequestHolder = ({title, buttonTitle, onAction, type, disabeldAstroState}) => {

  

    return (
  
        <View style={{flex:1, flexDirection: 'row', marginTop:6, justifyContent:'flex-start'}}>
  
         <View style={{width:'51%', flexDirection: 'row', justifyContent:'space-between'}}> 
          <Text style={{color: 'black', textAlign:'left', justifyContent:'flex-start', alignSelf:'flex-start'}}> {title} </Text>
          <Text style={{color: 'black'}}> : </Text>
          </View>
          
          <View style={{width:'49%', flexDirection: 'row'}}>
          {disabeldAstroState!=null && disabeldAstroState==5?
          <Pressable style={{backgroundColor: 'gray', fontSize:12, borderRadius:8}}>
           <Text style={{color:'white', fontSize:12, paddingVertical:4, paddingHorizontal:8}}> {buttonTitle} </Text>
           </Pressable>
           :
           <Pressable style={{backgroundColor: "#EC0029", borderRadius:8}}  onPress={() => onAction(type)}>
           <Text style={{color:'white', fontSize:12, paddingVertical:4, paddingHorizontal:8}}> {buttonTitle} </Text>
           </Pressable>
          }
          </View>
  
        </View>
    )
  }
  
  export const ViewProfileFieldValueHolder = ({ name, value }) => {
  
    const getValue = () => {
  
     // console.log(name, value)
  
      if(value != null && value != 'undefined' && (value != "" && value != "0")) {
  
        return value
  
      }
  
      return "-"
    }
  
    return (
   
      <View style={{flexDirection: 'row', justifyContent:'space-evenly', marginTop:8}}>
           <Text style={{color: '#010101', width:"50%"}}> {name} </Text>
           <Text style={{color: 'black'}}> : </Text>
           <Text style={{color: '#818181', width:"50%", marginHorizontal:2}}> {getValue()} </Text>
      </View>
    )
  
  }

const styles = StyleSheet.create({

    container: {
        justifyContent:'center',
        position: 'absolute',
        top: 55,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor:'transparent',
    },

})
//backgroundColor:'#EEEEEE',
//