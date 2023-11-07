import React,{useState} from 'react';
import {StyleSheet, View, Modal, ActivityIndicator, Text, Pressable} from 'react-native';
import { Avatar} from 'react-native-paper';
import { getTheme } from '../Theme';
import { useTheme } from 'react-native-paper';
import { getImageUrl } from '../../NW/ServiceURL';
const ModalScreen = (props) => {
  const {loading, text ="Do you want to ",text2=" the user?",text1="", ...attributes} = props;
  const theme = useTheme()
 
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
       // console.log('close modal');
        
        props.onDismiss()
      }}>
      <View style={styles.modalBackground}>

        <View style={styles.activityIndicatorWrapper}>
        <View style={{marginTop :-40,}}>
        <Avatar.Image style={{backgroundColor:'white',}} size={70} source={{uri: getImageUrl(props.image)}} />
        </View>
        <View style={{marginTop:20}}>
         <Text style={styles.msgText}> {text+text1+text2} </Text>
         </View>
         <View style={styles.btnMainView}>
         <Pressable style={styles.cancelBtnView}
         onPress={()=>{props.onDismiss()}}
         >
         <Text style={styles.btnText}> {"Cancel"} </Text>
         </Pressable>
         <Pressable style={styles.actionBtnView}
         onPress={()=>{props.onDismiss()
         props.onMenuPress(text1)
         }}
         >
         <Text style={styles.btnText}> {text1=="block"? "Block":text1=="mute"?"Mute":text1=="report abuse" && "Report Abuse"} </Text>
         </Pressable>
         </View>
        </View>

      </View>
    </Modal>
  );
};

export default ModalScreen;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
    padding:25
  },
  activityIndicatorWrapper: {
    paddingVertical:8,
   // paddingHorizontal:10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    minWidth:110,
  },
  activityIndicator: {
    height: 80,
  },
  msgText:{ fontSize: 16,textAlign: 'center',color:"#343434"},
  btnMainView:{backgroundColor:"#F1F1F1",flexDirection:"row",marginTop:25},
  cancelBtnView:{flex:1,backgroundColor:"#FFF",marginTop:2,marginRight:2,padding:10},
  btnText:{ fontSize: 16,textAlign: 'center',color:"#ED002D"},
  actionBtnView:{flex:1,backgroundColor:"#FFF",marginTop:2,padding:10}
});