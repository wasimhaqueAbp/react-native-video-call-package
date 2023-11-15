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
  Image
 

} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {Divider, Button, Card, Avatar,IconButton} from 'react-native-paper';



import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../../NW/ServiceURL';
import { prepareShortName } from '../Utility/Utility';
import { RNVectorIcon } from '../Utility/RNVectorIcon';
export const ChatHeaderView = ({item,genderId, index, onSelectProfile, showLastMessage = true,onMenuPress,onVideoPress,onAudioPress,onGoback, 
  style={borderRadius:0,backgroundColor:"#FFF",elevation:2}
} 
  ) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
 /// const navigation = useNavigation();
 //console.log("item header", item)
 //const {t, i18n} = useTranslation();
return(
    <Card style={style}>
    <View style={{paddingVertical:10, marginHorizontal:10}} >
    
         <View style={{flexDirection:'row', alignItems:'center',justifyContent:"space-between"}}>
  <View>
  <Pressable onPress={() => { 
  // navigation.goBack();
  onGoback()
    }}>
    <Image
        style={{height:25,width:25,marginRight:10}}
       source={require('../icons/back.png')} resizeMode="contain" /> 
                 
              </Pressable>
  </View>
  <Pressable onPress={ () => onSelectProfile != null? onSelectProfile(item, index) : console.log("select")}>
  <Avatar.Image style={{backgroundColor:'white',}} size={45} source={{uri: getImageUrl(item.userphotoimageurl,genderId)}} />
  </Pressable>
  <Pressable style={{marginHorizontal:8,flex:1,}}
  onPress={ () => onSelectProfile != null? onSelectProfile(item, index) : console.log("select")}
  >
       <Text style={{color:"black",fontWeight:"500"  }}> {item.mappedUserName} </Text>
       <Text style={{color:"#DB233D",fontWeight:"500" }}> {item.mappedUserCode } </Text>
  </Pressable>
   <View>
  <Pressable onPress={() => onAudioPress()}>
  <Image
        style={{height:25,width:25,marginLeft: 8,paddingRight:10,}}
       source={require('../icons/phone_call.png')} resizeMode="contain" /> 
                 
              </Pressable>
  </View>
  <View>
  
  <Pressable onPress={() => onVideoPress()}>
  <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/video.png')} resizeMode="contain" /> 
                 
              </Pressable>
  </View> 
  {/* <View>
  <Menu
            visible={isMenuVisible}
            anchor={
              <Pressable onPress={() => setIsMenuVisible(true)}>
              <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/app_menu_black.png')} resizeMode="contain" /> 
                
              </Pressable>
            }
            onRequestClose={() => setIsMenuVisible(false)}>
          <MenuItem onPress={() => {
              setIsMenuVisible(false)
              onMenuPress("block")}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight:10 }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/block_user.png')}
  style={{ width: 20, height: 20, marginRight: 10  }}
/>
<Text style={{color:"black",  }}> {"Block"}</Text>
     </View>
    
            </MenuItem>
             <MenuItem onPress={() => {
               setIsMenuVisible(false)
              onMenuPress("report")
             }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/report_abuse.png')}
  style={{ width: 20, height: 20, marginRight: 10 }}
/>
<Text style={{color:"black",  }}> {"Report Abuse"}</Text>
     </View>
    
            </MenuItem> 
            <MenuItem 
            onPress={()=>{
              setIsMenuVisible(false)
              onMenuPress("mute") }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
              <Image
              resizeMode="contain"
          source={require('../icons/mute.png')}
          style={{ width: 20, height: 20, marginRight: 10}}
        />
        <Text style={{color:"black", }}> {"Mute"}</Text>
             </View>
            </MenuItem>
          </Menu>
          </View> */}
</View>
</View>
    </Card>
)
}
