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
export const ChatHeaderView = ({item, index, onSelectProfile, showLastMessage = true,onMenuPress,onVideoPress,onAudioPress,onGoback, style={marginHorizontal:16, marginVertical:8, elevation:2}} ) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
 /// const navigation = useNavigation();
 //console.log("item header", item)
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
  <View>
  <Pressable onPress={() => onAudioPress()}>
  <Image
        style={{height:25,width:25,marginLeft: 8,paddingRight:10,}}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
                 {/* <RNVectorIcon
                  group='Feather'
                  style={{marginLeft: 8,paddingRight:10,}}
                  name="phone-call"
                  size={25}
                  color="black"
                /> */}
              </Pressable>
  </View>
  <View>
  <Pressable onPress={() => onVideoPress()}>
  <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
                 {/* <RNVectorIcon
                  group='Feather'
                  style={{marginLeft: 8}}
                  name="video"
                  size={25}
                  color="black"
                /> */}
              </Pressable>
  </View>
  <View>
  <Menu
            visible={isMenuVisible}
            anchor={
              <Pressable onPress={() => setIsMenuVisible(true)}>
              <Image
        style={{height:25,width:25,marginLeft:10}}
       source={require('../icons/dots.png')} resizeMode="contain" /> 
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
           {/* <MenuItem onPress={() => {
              setIsMenuVisible(false)
              onMenuPress("not")}}>
              {t('lbl-Not-my-type')}
            </MenuItem>
             <MenuItem onPress={() => {}}>
              {t('lbl-Block-User')}
            </MenuItem> */}
            <MenuItem onPress={()=>{
              setIsMenuVisible(false)
              onMenuPress("report") }}>
              {"Report Abuse"}
            </MenuItem>
          </Menu>
          </View>
</View>
</Pressable>
    </Card>
)
}
