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
import {Divider, Button, Card, Avatar} from 'react-native-paper';



import { useNavigation } from '@react-navigation/native';
import { getImageUrl } from '../../NW/ServiceURL';
import { prepareShortName } from '../Utility/Utility';
import { RNVectorIcon } from '../Utility/RNVectorIcon';
import {useTranslation, withTranslation} from 'react-i18next';
export const ChatHeaderView = ({item, index, onSelectProfile, showLastMessage = true,onMenuPress,onVideoPress,onAudioPress,onGoback, 
  style={borderRadius:0,backgroundColor:"#FFF",elevation:2}
} 
  ) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
 /// const navigation = useNavigation();
 //console.log("item header", item)
 //const {t, i18n} = useTranslation();
return(
    <Card style={style}>
    <Pressable style={{paddingVertical:16, marginHorizontal:10}} onPress={ () => onSelectProfile != null? onSelectProfile(item, index) : console.log("select")}>
    
         <View style={{flexDirection:'row', alignItems:'center',justifyContent:"space-between"}}>
  <View>
  <Pressable onPress={() => { 
  // navigation.goBack();
  onGoback()
    }}>
    <Image
        style={{height:25,width:25,marginRight:10}}
       source={require('../icons/back.png')} resizeMode="contain" /> 
                 {/* <RNVectorIcon
                  group='Ionicons'
                  style={{marginLeft: 4}}
                  name="arrow-back"
                  size={30}
                  color="black"
                /> */}
              </Pressable>
  </View>
  <Avatar.Image style={{backgroundColor:'white',}} size={45} source={{uri: getImageUrl(item.profileImageDtl)}} />
  <View style={{marginHorizontal:8,flex:1,}}>
       <Text style={{color:"black",fontWeight:"500"  }}> {prepareShortName(item.matrimonyUserName)} </Text>
       <Text style={{color:"#DB233D",fontWeight:"500" }}> {item.userCode } </Text>
  </View>
  {/* <View>
  <Pressable onPress={() => onAudioPress()}>
  <Image
        style={{height:25,width:25,marginLeft: 8,paddingRight:10,}}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
                 
              </Pressable>
  </View>
  <View>
  <Pressable onPress={() => onVideoPress()}>
  <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
                 
              </Pressable>
  </View> */}
  <View>
  <Menu
            visible={isMenuVisible}
            anchor={
              <Pressable onPress={() => setIsMenuVisible(true)}>
              <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/app_menu_black.png')} resizeMode="contain" /> 
                 {/* <RNVectorIcon
                  group='MaterialCommunityIcons'
                  style={{marginLeft: 8}}
                  name="dots-vertical"
                  size={30}
                  color="black"
                /> */}
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
  style={{ width: 20, height: 20, marginRight: 10,marginLeft:15  }}
/>
<Text> {"Block"}</Text>
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
  style={{ width: 20, height: 20, marginRight: 10 ,marginLeft:15}}
/>
<Text> {"Report Abuse"}</Text>
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
          style={{ width: 20, height: 20, marginRight: 10 ,marginLeft:15}}
        />
        <Text> {"Mute"}</Text>
             </View>
            </MenuItem>
          </Menu>
          </View>
</View>
</Pressable>
    </Card>
)
}
