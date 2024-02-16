import React, { useState, useEffect, createRef, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
  PermissionsAndroid,
  Permissions,
  Image,
  Keyboard

} from 'react-native';
import { IconButton } from 'react-native-paper';


import InCallManager from 'react-native-incall-manager';
import uuid from 'react-native-uuid';

//import { setVideoCallEvent } from '../../../Utility/FirebaseHandler';

import { prepareShortName, showToast } from '../Utility/Utility';
import { propTypes } from 'react-native-page-control';
import { useVideoCall } from '../../../../../src/Utility/VideoCall/VideoCallContextProvider';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

import RNCallKeep from 'react-native-callkeep';
import Incomingvideocall from "../Utility/incoming-video-call";
import { getEnvironment, ServiceConstant } from '../../NW/ServiceAPI';
import { callApi } from '../../NW/APIManager';
import {
  RINGER_MODE,
  getRingerMode,
  RingerModeType,
} from 'react-native-ringer-mode';
import { removeItem } from '../../../../../src/db/Storage';
import { PERMISSIONS, request } from 'react-native-permissions';

// const options = {
//   ios: {
//     appName: 'My app name',
//   },
//   android: {
//     alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//     selfManaged:true

//   }
// };

// RNCallKeep.setup(options).then(accepted => {});
// RNCallKeep.setAvailable(true);
var globalAcceptReject = false;
const AcceptRejectCallView = ({ name, socket, item, socketConneted, currentItem, UserData, onNavigate, organizationName, organizationImage,callType }) => {
  // const navigation = useNavigation();
  // const navigation = React.useContext(NavigationContext);
// const { sockets } = useVideoCall();

  const [incomingCall, setIncomingCall] = useState(null);

  const [showNotificationIncomingCall, setshowNotificationIncomingCall] = useState(false);
  const moreRef = useRef();
  const [userData, setUserData] = useState(null);
  const [targetUserName, setTargetUserName] = useState(null);
  const [callTypes, setCallTypes] = useState(callType)
  const [autoDisconnectTimeOutEvent, setautoDisconnectTimeOutEvent] = useState()
  const [newItems,setNewItems] =useState(item)
  const [callAccepted,setCallAccepted] = useState(false);
  let acceptRejectCall = false;
  
  useEffect(() => {
    //let realmObj;

    (async () => {
     
      const obj = UserData;
      setUserData(obj);

    })();

    return () => {
      // realmObj.close();
    };
  }, [userData]);

 
  const CAMERA_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.CAMERA,
    //android: PERMISSIONS.ANDROID.CAMERA,
  });
  const MICROPHONE_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.MICROPHONE,
    //android: PERMISSIONS.ANDROID.RECORD_AUDIO,
  });
 
  useEffect(() => {
    if (currentItem != null) {
     
      const envType = getEnvironment()
      let targetUsername = '';
      let targetCallType = '';
      let roomsStr=''

      let profileimage = null;
      if (currentItem.data) {
        targetUsername = currentItem.data.name;
        targetCallType = currentItem.data.callType;
        roomsStr=currentItem.data.rooms;
        profileimage = envType == "TEST" ?'https://testcdn.abpweddings.com/'+currentItem.data.image:'https://cdn.abpweddings.com/'+currentItem.data.image;
      } else {
        targetUsername = currentItem.name;
        targetCallType = currentItem.callType;
        roomsStr=currentItem.rooms;
        profileimage =  envType == "TEST" ?'https://testcdn.abpweddings.com/'+currentItem.image :'https://cdn.abpweddings.com/'+currentItem.image;
      }
     
      if(targetCallType!='endcall'){

      
      // outGoingRing(audioElement);
      (async () => {
        const currentMode =   await getRingerMode();
   
      if(currentMode == 2){
        InCallManager.start({media: 'audio', ringback: '_BUNDLE_', auto: true}); // or _DEFAULT_ or system filename with extension
      
      }
    })();
      
      //Code on 01 December by Wasim
      setautoDisconnectTimeOutEvent(() => {
        return setTimeout(() => {
          if(globalAcceptReject == false){
            console.log("in end Call Accept Reject1 ",globalAcceptReject)
            onCancelHandler()
          }
          
        }, 70 * 1000)
      })
      

      
      let calldisplayname =  'ABP Weddings - Voice Call';
      if (targetCallType == 'video') {
        calldisplayname = 'ABP Weddings - Video Call';
      }

     if(Platform.OS == "android"){
      RNNotificationCall.displayNotification(
        roomsStr,
        profileimage,
        30000,
        {
          channelId: 'com.abpweddings.incomingcall',
          channelName: 'Incoming video call',
          notificationIcon: 'ic_launcher', //mipmap
          notificationTitle: prepareShortName(targetUsername),
          notificationBody: calldisplayname,
          answerText: 'Answer',
          declineText: 'Decline',
          notificationColor: 'colorAccent',
          notificationSound: null, //raw
          //mainComponent:'MyReactNativeApp',//AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
          // payload:{name:'Test',Body:'test'}
        }
      );


      RNNotificationCall.addEventListener('answer', (data) => {
        RNNotificationCall.backToApp();
        const { callUUID, payload } = data;
        InCallManager.stop();
        RNNotificationCall.hideNotification();
        Keyboard.dismiss()
        acceptCall()
       
      });
      RNNotificationCall.addEventListener('endCall', (data) => {
        const { callUUID, endAction, payload } = data;
        InCallManager.stop();
        RNNotificationCall.hideNotification();
        Keyboard.dismiss()
        
        
        onCancelHandler()
      });

    }
    else{
      RNCallKeep.removeEventListener('checkReachability')
      RNCallKeep.removeEventListener('answerCall');
      RNCallKeep.removeEventListener('endCall');
  const   uuidData  = uuid.v4();
  
      const options = {
        ios: {
          appName: 'RNABPWedings',
        }
      };
      
       RNCallKeep.setup(options).then(accepted => {});
       RNCallKeep.setAvailable(true);
  
     
    
    setTimeout(()=>{
      RNCallKeep.displayIncomingCall(
        uuidData,
        calldisplayname,
        prepareShortName(targetUsername),
       "generic",
       true,// targetCallType == "video" ? true: false,
        {
          supportsDTMF: true,
          supportsHolding: true,
       }
      )
    
  
    },2000)



    RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
      // Do your normal `Hang Up` actions here
      InCallManager.stop();
      console.log("callUUID",callUUID)
      globalAcceptReject= true;
      if(acceptRejectCall == false){
        onCancelHandler();
      }
      else {
        acceptRejectCall = false
      }
      //
    });

    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      acceptRejectCall = true;
      Keyboard.dismiss()
      acceptCall()

      setTimeout(  async() => {
        console.log("in Accept handler????")
        RNCallKeep.endAllCalls();
      }, 700)
    });
 
    }
      
      //Change done by wasim on 3 december 
      // let targetUsername='';
      //             let targetCallType='';

      //            if(currentItem.data ){
      //             targetUsername=currentItem.data.name;

      //             targetCallType=currentItem.data.callType;
      //           }else{
      //             targetUsername=currentItem.name;
      //             targetCallType=currentItem.callType;

      //           }
      //           let calldisplayname=prepareShortName(targetUsername)+' Voice Call ABPWeddings';
      //           if(targetCallType=='video'){
      //             calldisplayname=prepareShortName(targetUsername)+' Video Call ABPWeddings';
      //           }

      //           const incomingCallAnswer = ({ callUUID }) => {

      //             Incomingvideocall.endIncomingcallAnswer(callUUID);
      //             //setisCalling(false);
      //             acceptCall()
      //           };

      //           const endIncomingCall = () => {
      //             InCallManager.stop();
      //             Incomingvideocall.endIncomingcallAnswer();
      //             onCancelHandler()
      //           };

      //           console.log("calldisplayname",calldisplayname);

      //           Incomingvideocall.configure(incomingCallAnswer, endIncomingCall);
    }
    else{
     
      if(Platform.OS == "android"){
        InCallManager.stop();
        RNNotificationCall.hideNotification();
      }
      else{
        InCallManager.stop();
      }
      
      globalAcceptReject= true;
    }


    }
    return () => {
      if(Platform.OS == "android"){
        RNNotificationCall.removeEventListener('endCall');
        RNNotificationCall.removeEventListener('answer')
      }
      else{
       
        RNCallKeep.removeEventListener('answerCall');
        RNCallKeep.removeEventListener('endCall');
      }
     
    };

  }, [currentItem])


  const acceptCall = async () => {

    InCallManager.stop();

    
    // handleAcceptButton();
    checkPermissions();

  }

  const checkPermissions = async () => {

    if (Platform.OS == "android") {

      try {

        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,

          // Add more permissions as needed
        ]);

        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
          // Check for other permissions here
        ) {
          setshowNotificationIncomingCall(false);

          handleAcceptButton();
          // You can now use the requested features that require these permissions
        } else {
          Alert.alert(
            '',
            'Please allow the camera and microphone permissions from settings to access the video call',
            [
              {
                text: "Cancel",
                onPress: () => console.log('cancel'),
                style: 'cancel',
              },

              {
                text: "OK",
                onPress: () => {
                  Linking.openSettings();

                },
              },
            ],

            {
              cancelable: true,
            },
          );
          // Handle the case where one or more permissions were denied
          showToast('Please allow the camera and microphone permissions from settings to access the video call')

        }

      } catch (err) {
        console.warn(err);
      }

    }
    else {
      try {
        // const { status } = await Permissions.askAsync(Permissions.CAMERA);
        // const { statusMicroPhone } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const cameraStatus = await request(CAMERA_PERMISSION);
        const microphoneStatus = await request(MICROPHONE_PERMISSION);
    
        if (cameraStatus === 'granted' && microphoneStatus === 'granted') {
      
        
          setshowNotificationIncomingCall(false);

          handleAcceptButton();
        } else {
          Alert.alert(
            '',
            "Please allow the camera and microphone permissions from settings to access the video call",
            [
              {
                text: "Cancel",
                onPress: () => console.log('cancel'),
                style: 'cancel',
              },

              {
                text: "OK",
                onPress: () => {
                  Linking.openURL('app-settings:');

                },
              },
            ],

            {
              cancelable: true,
            },
          );

          showToast('Please allow the camera and microphone permissions from settings to access the video call')

          
        }
      } catch (err) {
        console.warn(err);
      }

    }


  }
  const handleAcceptButton = () => {
    // pause(audioElement,0);
    setCallAccepted(true);
   
    globalAcceptReject = true;
    let roomNo = 2456;
    //     let url='/'+ROUTES.CALLWINDOW+'?roomno='+incomingCall.from+'&room='+roomNo+'&audio=true&video=true&callaccept=Y&callinitiateByothers=remote';
    //     let nameWindow='chatWindow';
    //     let windowWidth=1200;
    //     let windowHeight=700;

    //  setVideoCallEvent("accept") // un comment
    // setshowNotificationIncomingCall(true);

    // PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
    //"&roomno="+incomingCall.from+"&rooms="+incomingCall.room+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&item="+item
    // const props = {"roomno":incomingCall.from,"rooms=":incomingCall.room,"audio":true,"video":true,"callaccept":"Y","callinitiateByothers":"remote","item":item} 
    //Code done on 01 December by wasim
    if (autoDisconnectTimeOutEvent) {
     
      clearTimeout(autoDisconnectTimeOutEvent)
    }
   
    //Un comment this when push
   
    if (currentItem != null) {

      let uri = currentItem.data ?
        currentItem.data.LINK + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + callTypes + "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
        : currentItem.LINK + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + callTypes + "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
      
      Linking.openURL(uri);
    }
    else {

      let uri = "aevl://app.wed/redirect?SCREENVALUE=VIDEOCHATCALL" + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + callTypes+ "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
      Linking.openURL(uri);
    }
    // onNavigate()
    // navigation.navigate("videoChat");
    // navigation.navigate("videoChat",
    // {roomno:incomingCall.from,rooms :incomingCall.room,
    // audio:true,video:true,
    // callaccept:"Y",
    // callinitiateByothers:"remote",
    // item:item
    // }
    // )

  }

 

  const handlealreadyreceived = useCallback(
    async ({ event }) => {

    }
  )

  const handleEndCall = async ({ from }) => {
    // Stop the streams
    
    setshowNotificationIncomingCall(false);
    InCallManager.stop();

  };
  const onCancelHandler = async () =>{
    //Code done on 01 December by wasim
       // remoteSocketId 2713882 2702140
     //  setVideoCallEvent("cancel")// un comment

     try {
       if(Platform.OS == "android"){
         
        await removeItem('PUSH_PAYLOAD')
       }
       console.log("in ios If")
      //  PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
      const body = {
        from: item.uid,
        to:item.sourceuid,//call initiator
        devplatform:Platform.OS =="android"?"android":"ios",
        calltype:item.calltype,
        rooms:item.rooms

      };
      
      const response = await callApi(ServiceConstant.VIDEO_CALL_REJECT, body);
     
    
    
    
      } catch (error) {
       console.log("in cancle error",error)
     }
       

  }

  

  return (

    <View></View>

    //      <View style={{position:'absolute',width:'100%', backgroundColor:"red"}}>
    //       {/* {showNotificationIncomingCall ? */}
    //       <View style={{ 
    //           position:'absolute',
    //        backgroundColor:"#FFFFFF",margin:10,borderRadius:15,
    //        shadowColor: '#171717',
    //           shadowOffset: {
    //           width: 10,
    //           height: 2,
    //           },
    //           shadowOpacity: 0.25,
    //           shadowRadius: 15,
    //           elevation: 5,
    //           flexDirection:'row',
    //           alignItems:"center",justifyContent:"space-between",
    //           padding:10
    //        }}>
    //        <View style={{paddingLeft:10}}>
    //  <Image source={{uri:organizationImage}} resizeMode="contain"
    //    style={{height:40,width:40,borderRadius:360}}
    //     /> 
    //   </View>    
    //       <View style={{ flex:1,paddingLeft:10}}>
    //       <Text style={{fontSize:18,fontWeight:"500"}}>{ prepareShortName(targetUserName) }</Text>     

    //       <Text style={{fontSize:14,}}>{callTypes=="video"?"Incoming Video Call":"Incoming Voice Call"}</Text>     
    //       <Text style={{fontSize:13,}}>{ organizationName }</Text> 
    //       </View>
    //       <View style={{flexDirection:"row",flex:0.8, justifyContent:'space-between',alignItems:'center',margin:10}}>
    //       <View style={{ backgroundColor: "#FF1C16", borderRadius: 360,}}>
    //           <IconButton
    //             padding={6}
    //             backgroundColor="white"
    //             icon="close"
    //             color="white"
    //             size={25}

    //             onPress={() => onCancelHandler()} />
    //         </View>
    //         <View style={{ backgroundColor: "green", borderRadius: 360, }}>
    //           <IconButton
    //             padding={6}
    //             backgroundColor="white"
    //             icon={callTypes=="video"?"video": "phone-hangup-outline"}
    //             color="white"
    //             size={25}
    //             onPress={() => acceptCall()} />
    //         </View>
    //       </View>
    //       </View>
    //       {/* :null} */}
    //       </View>



  )
}

export default AcceptRejectCallView;