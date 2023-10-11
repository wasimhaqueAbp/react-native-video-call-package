import React from 'react';

import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    Platform
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
<Button style={{marginVertical:16}} icon="reload" mode="contained" color={"#DB233D"} onPress={action}> 
{"Retry"}
</Button>  
</View>
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