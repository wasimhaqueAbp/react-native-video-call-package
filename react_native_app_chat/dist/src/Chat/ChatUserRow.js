import React, {useState, useEffect, createRef, useRef} from 'react';

import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Platform,
  Pressable,
 

} from 'react-native';

import {Divider, Button, Card, Avatar} from 'react-native-paper';
import { formatChatDateTimeGMT,formatDate,formatChatTimestamp, prepareShortName } from '../Utility/Utility';
import { getImageUrl } from '../../NW/ServiceURL';

import { formatChatDateTime } from '../Utility/Utility';

export const Circle = ({size, color}) => {
    
  return <View style={styles.circleView(size,color)} />;

};

export const ChatUserRow = ({item,genderId, index, onSelectProfile, showLastMessage = true, style={marginHorizontal:16, marginVertical:8, elevation:2}}) => {
 
 const showmessagebody = (item) =>{
  //item.messagebody
  
  let message=item.calltype;
  let displaymessage=''
  switch(message){
    case 'video':
      if(item.messagebody == null){
        displaymessage='Missed Video Call';
      }
      else{
        displaymessage='Video Call';
      } 
    break;
    case 'voice':
    case 'audio':
      if(item.messagebody == null){
        displaymessage='Missed Voice Call';
      }
      else{
        displaymessage='Voice Call';
      }
    break;
    default:
      displaymessage=item.messagebody
    break;
  }
 return displaymessage;
 }
    
  return (
        
    //   <Card style={style}>
    <View key={item.lastmessageid}>
      <Pressable style={styles.mainView} onPress={ () => onSelectProfile != null? onSelectProfile(item, index) : console.log("select")}>
    
       <View style={styles.imageMainView}>
  
       <Avatar.Image style={{backgroundColor:'white'}} size={55} source={{uri: getImageUrl(item.userphotoimageurl,genderId)}} /> 
  
       <View style={styles.textMainView}>
       
        <View style={styles.flexRow}>
        <View style={styles.flex1}>
       {/* <Text style={styles.userText(item)}> {prepareShortName(item.matrimonyUserName) + ", " }<Text style={styles.userIdText}> {item.userCode } </Text> </Text> */}
       <Text style={styles.userText(item)}> {prepareShortName(item.mappedUserName)}</Text>
       
       </View>
       {((item.messagebody != null && item.calltype=='txt') || (item.calltype=='video' || item.calltype=='audio' || item.calltype=='voice')) && <View style={styles.dateMainView}>
       <Text style={styles.dateText(item)}> {formatChatTimestamp(item.modifyon) } </Text>
       </View>}
       </View>
       <View style={styles.lastMessageView}>
      
        { showLastMessage && item.messagebody != "" && ( 
         <View style={styles.flex1}>
        <Text 
        numberOfLines={1}
        style={styles.lastMessageText(item)}> {showmessagebody(item)} </Text>
        </View>
        )} 
        {item.unreadcount> 0 && ( 
         <View style={styles.userCountMainView}>
          <Text 
        
        style={styles.userCountText}> {item.unreadcount >99 ? "99+":item.unreadcount}
        {/* item.userChatCount */}
         </Text>
        </View>
       )}
       </View>
  
       </View>
  
       </View>
  
      </Pressable>
      </View>
      //</Card>
    
    );
  }


  const styles = StyleSheet.create({

    circleView:(size,color)=>({width: size, height: size, borderRadius: size / 2, backgroundColor: color, margin:2}),
    mainView:{paddingVertical:12, marginLeft:0},
    imageMainView:{flexDirection:'row', alignItems:'center'},
    textMainView:{marginLeft:8, flex:1,},
    flexRow:{ flexDirection:"row"},
    flex1:{flex:1},
    dateMainView:{justifyContent:"flex-end", alignItems:"flex-end"},
    dateText:(item)=>({textAlign:"right", color: item.onlinestatus == 'true' ?  '#DB233D':"#717171",fontSize:13,}),
    lastMessageView:{flexDirection:'row', alignItems:'center'},
    userText:(item)=>({
      fontSize:16,
      fontWeight: item.onlinestatus == 'true' ? "500":"normal",
      color: item.onlinestatus == 'true' ? "#262626" : "#262626"}),
    userIdText:{color: "#DB233D"},
    lastMessageText: (item)=>({fontSize:13,
      fontWeight: item.onlinestatus == 'true' ? "500":"normal",
       color: item.onlinestatus == 'true' ? "#000000" : "#777777"}),
    userCountMainView:{backgroundColor:"#DB233D",alignItems:"center",justifyContent:"center", borderRadius:360, height:25,width:25,marginTop:4},
    userCountText:{fontSize:12, color: "#FFFFFF",fontWeight:"500",textAlign:"center",left:-1}
  })