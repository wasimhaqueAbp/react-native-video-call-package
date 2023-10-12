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
  BackHandler,
  SafeAreaView,
  ScrollView,
  
} from 'react-native';

import { getImageUrl } from '../../NW/ServiceURL';
import { prepareShortName,  } from '../Utility/Utility';
import { Button } from 'react-native-paper';
import {RequestHolder, ViewProfileFieldValueHolder} from '../Utility/DefaultView'
const ViewProfile = props => {
    const [minMaxAboutNumberOfLines, setMinMaxAboutNumberOfLines] = useState(3);
    const [showAboutMeText, setShowAboutMeText] = useState('hisjdfdf kjsdhjkgfhgf fgshkjfgdhfg kghkjgfhkjgf kjsfghkjgfhgk  skldlkd kdsfkfjlkgjgl klfdjglkfdjglfkjgfl kjfghkjdfjhgkj jkfsgkjhjkgf kjfhkjfbgf gfmbvkmvjfbgfbgkjhgkbfjhegjbfmnbfjhfbngfbfgjbfgfjhg sdhajkdhdkjfhdskfhd djsdfkjfdksfd ');
    const [aboutMeShowMore, setAboutMeShowMore] = useState(true);
   

    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          // Handle the back button press (e.g., navigate back or show a confirmation dialog)
          // Return true to indicate that we've handled the back button
          // Return false to let the default behavior (e.g., exit the app) happen
          // For example:
          // navigateBack(); // Implement your navigation logic
          props.goBack()
          return true;
        }
      );
  
      return () => {
        backHandler.remove(); // Unsubscribe from the event when the component is unmounted
      };
    }, []); 

    const getContactText = () => {

      let text = "Request Now"
    
      switch(props.contactState){
    
        case 0:
    
         text =  "Request Now"
    
        break
    
        case 1:
    
           const number = contactNumber
          text = number
        
        break
    
        case 5:
          text = "Requested"
        
        break
    
        case 7:
    
          text = "Request rejected"
    
        break
      }
    
      return text
    
    }

    const makeCall = async () => {

      // const res = await AsyncAlertDialog(t("lbl-Call"), t("lbl-Are-you-sure-you-want-to-call")+" " + contactNumber 
      // + "?", t("lbl-Call"), t("lbl-Cancel"));
    
      // if(res == 1) return
      
      // let phNumber = ""
      // if (Platform.OS === 'android') {
    
      //   phNumber = 'tel:' + contactNumber
      // }
      // else {
      //   phNumber = 'telprompt:' + contactNumber;
      // }
    
      // Linking.openURL(phNumber);
    
    
    }
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
              style={styles.readMoreText}>
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
 
        <View>
        <RequestHolder type={props.contactState == 1? "call" : "contact-request"} title={"Mobile Number"} buttonTitle={getContactText()} onAction ={ 
          makeCall
          //props.contactState == 1? makeCall : props.onAction
          }
            
          />
        {/* {props.contactState == 1 && ( */}
          <>
          <ViewProfileFieldValueHolder name={"Name"} value={"targetUserName"}/>
          <ViewProfileFieldValueHolder name={"Email ID"} value={"targetUserEmail"}/>
          </>
        {/* )} */}

        <ViewProfileFieldValueHolder name={"Location"} value={"basicDetail.locationValue"}/>
        <ViewProfileFieldValueHolder name={"Age"} value={"basicDetail.ageValue"}/>
        <ViewProfileFieldValueHolder name={"Profile Maintained By"} value={"basicDetail.profileCreatedByValue"}/>
        <ViewProfileFieldValueHolder name={"Marital Status"} value={"basicDetail.maritalStatusValue"}/>

        {/* {basicDetail.numChildrenProspectValue != null && ( */}
        <ViewProfileFieldValueHolder name={"Kids"} value={"basicDetail.numChildrenProspectValue"}/>
        {/* )} */}

        {/* {isReligionHindu && ( */}
        <ViewProfileFieldValueHolder name={"Manglik"} value={ 
          "Astro"
          //astrologyDetails !=null ? astrologyDetails["manglikFlagValue"] : "-" 
          }/>
        {/* )} */}

        <ViewProfileFieldValueHolder name={"Physical Appearance"} value={
          "physicalDescDetails"
          // physicalDescDetails !=null ? physicalDescDetails.destbodyTypeValue : "-"
          }/>
        <ViewProfileFieldValueHolder name={"Height"} value={
          "physicalDescDetails"
          // physicalDescDetails !=null ? physicalDescDetails.heightText : "-"
          }/>
        <ViewProfileFieldValueHolder name={"Complexion"} value={
          "physicalDescDetails"
          //physicalDescDetails !=null ? physicalDescDetails.destcomplexionValue : "-"
          }/>
        <ViewProfileFieldValueHolder name={"Hobbies"} value={"hobbiesValue"}/>
        </View>
       
       <View style={{alignItems:"center",marginBottom:10,marginTop:20}}>
        <Button
                mode="contained"
               
                style={styles.viewProfileBtn}
                onPress={()=>{}}>
                {"View Profile"}
              </Button>
              </View>
           </View>
        )
    }
    return(
        <SafeAreaView style={styles.container}>
         <ScrollView
        style={{}}
        // onScroll={onParentScrollEvent}
        nestedScrollEnabled={false}>
        {headerView()}
            {userImageView()}
            {aboutUsView()}
            {userDetails()}
            {actionView()}
            </ScrollView>
        </SafeAreaView>
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
      readMoreText:{
        fontSize: 14,
        fontWeight: '500',
        color: "#DB233D",
      },
      viewProfileBtn:{backgroundColor: "#DB233D",width:150,borderRadius:10}
})

export default ViewProfile; 