import React, {useState, useEffect, createRef,useCallback, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ImageBackground,
  Keyboard,
  BackHandler
} from 'react-native';

import { getImageUrl } from '../../NW/ServiceURL';
import { prepareShortName } from '../Utility/Utility';


const ViewProfile = props => {
    const [minMaxAboutNumberOfLines, setMinMaxAboutNumberOfLines] = useState(3);
    const [showAboutMeText, setShowAboutMeText] = useState('hisjdfdf kjsdhjkgfhgf fgshkjfgdhfg kghkjgfhkjgf kjsfghkjgfhgk  skldlkd kdsfkfjlkgjgl klfdjglkfdjglfkjgfl kjfghkjdfjhgkj jkfsgkjhjkgf kjfhkjfbgf gfmbvkmvjfbgfbgkjhgkbfjhegjbfmnbfjhfbngfbfgjbfgfjhg sdhajkdhdkjfhdskfhd djsdfkjfdksfd ');
    const [aboutMeShowMore, setAboutMeShowMore] = useState(true);
   
    const headerView=()=>{
        return(
            <View style={{flexDirection:"row", height:50,alignItems:'center',paddingHorizontal:10}}>
            <Pressable onPress={() => { 
  
  props.goBack()
    }}>
    <Image
        style={styles.iconImage}
       source={require('../icons/back.png')} resizeMode="contain" /> 
       </Pressable>
           

       {/* <Text style={{color:"black",fontWeight:"500",fontSize:18  }}> {"Block List"} </Text> */}
            </View>
        )
    }

    const userImageView=()=>{
        return(
            <View style={styles.backgroundWhite}>
<View style={styles.imageMainView}>
<ImageBackground
            source={{uri: getImageUrl(props.item.profileImageDtl)}}
            blurRadius={0
            //   data.basicDetail.isPhotoHide == 1 && data.isPhotoRequest != 1
            //     ? 8
            //     : 0
            }
            //resizeMode={"contain"}
            style={styles.imgCircle}>
           
                
                  <View style={styles.photoRequestBlockBackground} />
                  <View style={styles.photoRequestBlockView}>
                    {/* <PhotoRequestHolderNew
                      status={photoRequestState}
                      message={getPhotoRequestStatus()}
                      onAction={() => onInteractionAction('photo-request')}
                    /> */}
                  </View>
                
              

           
          </ImageBackground>

          <View style={styles.nameMainView}>
          <Text style={styles.nameText}>{prepareShortName(props.item.matrimonyUserName)+","} </Text>
       <Text style={styles.userCodeText}>{props.item.userCode } </Text>
          </View>
          <View style={styles.iconMainView}>
          <Pressable onPress={() => { 
  
  props.AudioCall()
    }}>
    <Image
        style={styles.iconImage}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
       </Pressable>
       <Pressable onPress={() => { 
  
  props.VideoCall()
    }}>
    <Image
        style={styles.iconImage}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
       </Pressable>
         </View> 
</View>
            </View>
        )
    }

    const aboutUsView =()=>{
        return(
            
           <View style={styles.aboutMainView}>
          <Text
            numberOfLines={minMaxAboutNumberOfLines} // onTextLayout={onTextLayout}
            style={{fontSize: 14}}>
            {showAboutMeText != ''
              ? showAboutMeText
              : "People usually tell me I am?"}
          </Text>

          {showAboutMeText.length > 0 && showAboutMeText.length > 143 && (
            <Text
              onPress={() => {
                if (aboutMeShowMore) {
                   setMinMaxAboutNumberOfLines(20);
                   setAboutMeShowMore(false);
                 
                } else {
                  setMinMaxAboutNumberOfLines(3);
                  setAboutMeShowMore(true);
                }
              }}
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: "#DB233D",
              }}>
              {aboutMeShowMore ? "Read More..." : "Read Less..."}
            </Text>
          )}
          </View> 
            
        )
    }

    const actionView =()=>{
        return(
            <View style={styles.aboutMainView}>
            <View style={styles.blockMainView}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/block_user.png')}
  style={styles.actionIconImg}
/>
<Text style={styles.textColor}> {"Block"}</Text>
     </View>
     <View style={styles.reportMainView}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/report_abuse.png')}
  style={styles.actionIconImg}
/>
<Text style={styles.textColor}> {"Report Abuse"}</Text>
     </View>
     <View style={styles.muteMainView}>
      
              <Image
              resizeMode="contain"
          source={require('../icons/mute.png')}
          style={styles.actionIconImg}
        />
        <Text style={styles.textColor}> {"Mute"}</Text>
             </View>
         </View>
        )
    }

    const userDetails =()=>{
        return(
            <View style={styles.aboutMainView}>

           </View>
        )
    }
    return(
        <View style={styles.container}>
        {headerView()}
            {userImageView()}
            {aboutUsView()}
            {userDetails()}
            {actionView()}
        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#EFEFEF",
        
    },
    backgroundWhite:{
        backgroundColor:"#FFF"
    },
    imgCircle: {
        width: 140,
        height: 140,
        borderRadius: 360,
        backgroundColor: 'grey',
        overflow: 'hidden',
        //borderWidth: 4,
        // alignSelf: 'center',
       // borderColor: '#D69C14',
      },
      imageMainView: {padding:10,alignItems:"center"},
      nameMainView:{marginTop:10,flexDirection:"row"},
      nameText:{color:"black",fontWeight:"500"  },
      userCodeText:{color:"#DB233D",fontWeight:"500" },
      iconMainView:{marginTop:10,flexDirection:"row",paddingBottom:10},
      iconImage:{height:25,width:25,marginRight:10},
      aboutMainView:{marginTop:10,backgroundColor:"#FFF",padding:15},
      blockMainView:{ flexDirection: 'row', alignItems: 'center', marginRight:10,marginTop:10 },
      actionIconImg:{ width: 20, height: 20, marginRight: 10  },
      reportMainView:{ flexDirection: 'row', alignItems: 'center',marginTop:15 },
      muteMainView:{ flexDirection: 'row', alignItems: 'center',marginTop:15,marginBottom:10 },
      textColor:{color:"#DB233D",  },
})

export default ViewProfile; 