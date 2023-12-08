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


//import { setVideoCallEvent } from '../../../Utility/FirebaseHandler';

import { prepareShortName, showToast } from '../Utility/Utility';
import { propTypes } from 'react-native-page-control';
import { useVideoCall } from '../../../../../src/Utility/VideoCall/VideoCallContextProvider';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';

import RNCallKeep from 'react-native-callkeep';
import Incomingvideocall from "../Utility/incoming-video-call";
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
const AcceptRejectCallView = ({ name, socket, item, socketConneted, currentItem, UserData, onNavigate, organizationName, organizationImage }) => {
  // const navigation = useNavigation();
  // const navigation = React.useContext(NavigationContext);
// const { sockets } = useVideoCall();
  const [incomingCall, setIncomingCall] = useState(null);

  const [showNotificationIncomingCall, setshowNotificationIncomingCall] = useState(false);
  const moreRef = useRef();
  const [userData, setUserData] = useState(null);
  const [targetUserName, setTargetUserName] = useState(null);
  const [callTypes, setCallTypes] = useState(null)
  const [autoDisconnectTimeOutEvent, setautoDisconnectTimeOutEvent] = useState()
  
  console.log("Accept Reject ", name, socket, item, socketConneted, currentItem)
  useEffect(() => {
    //let realmObj;

    (async () => {
      const obj = UserData;
      console.log('UserData Accept reject', obj);
      setUserData(obj);

    })();

    return () => {
      // realmObj.close();
    };
  }, [userData]);




  // const IncommingCallNotification = useCallback(
  //     async ({ from,room,calltype,fromname,userCode, mappedUserCode}) => {


  //         console.log("IncommingCallNotification",room,from,fromname,userCode,mappedUserCode)
  //         setshowNotificationIncomingCall(true);
  //         //handleremoteSocketId(from);


  //         setIncomingCall({ from,room,calltype,fromname,userCode, mappedUserCode});
  //         setTargetUserName(fromname)
  //         setCallTypes(calltype)
  //   setautoDisconnectTimeOutEvent(()=>{
  //     return setTimeout(()=>{
  //         console.log('call auto disconnected')
  //         callCancelHandler(event)
  //     },20*1000)
  // })
  //         //console.log(`Incoming Call`, from, offer);
  //     },
  //     [socket]
  // );


  useEffect(() => {
    //console.log("audioElement 111",audioElement);
    if (currentItem != null) {
      let targetUsername = '';
      let targetCallType = '';
      let roomsStr=''

      let profileimage = null;
      if (currentItem.data) {
        targetUsername = currentItem.data.name;
        targetCallType = currentItem.data.callType;
        roomsStr=currentItem.data.rooms;
        profileimage = 'https://testcdn.abpweddings.com/'+currentItem.data.image;
      } else {
        targetUsername = currentItem.name;
        targetCallType = currentItem.callType;
        roomsStr=currentItem.rooms;
        profileimage = 'https://testcdn.abpweddings.com/'+currentItem.image;
      }
      console.log("audioElement??? ", currentItem);

      if(targetCallType!='endcall'){

      
      // outGoingRing(audioElement);
      // InCallManager.startRingtone('_DEFAULT_'); // or _DEFAULT_ or system filename with extension
      InCallManager.start({ media: 'audio', ringback: '_BUNDLE_' }); // or _DEFAULT_ or system filename with extension
      // if(currentItem.data ){
      //   setTargetUserName(currentItem.data.name);
      //   setCallTypes(currentItem.data.callType)
      // }else{
      //   setTargetUserName(currentItem.name);
      //   setCallTypes(currentItem.callType)

      // }

      //Code on 01 December by Wasim
      setautoDisconnectTimeOutEvent(() => {
        return setTimeout(() => {
          console.log('call auto disconnected',globalAcceptReject)
          if(globalAcceptReject == false){
            console.log('call auto disconnected11')
            onCancelHandler()
          }
          
        }, 60 * 1000)
      })
      

      
      let calldisplayname =  'Abpweddings - Voice Call';
      if (targetCallType == 'video') {
        calldisplayname = 'Abpweddings - Video Call';
      }

      console.log("currentItem.data",currentItem);

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
        console.log('press answer', callUUID);
        InCallManager.stop();
        RNNotificationCall.hideNotification();
        Keyboard.dismiss()
        acceptCall()
        RNNotificationCall.removeEventListener('answer');
      });
      RNNotificationCall.addEventListener('endCall', (data) => {
        const { callUUID, endAction, payload } = data;
        console.log('press endCall', callUUID);
        InCallManager.stop();
        RNNotificationCall.hideNotification();
        Keyboard.dismiss()
        onCancelHandler()
        RNNotificationCall.removeEventListener('endCall');
      });

      
      
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
      InCallManager.stop();
      RNNotificationCall.hideNotification();
      globalAcceptReject= true;
    }


    }
  }, [currentItem])

  const acceptCall = async () => {

    InCallManager.stop();

    
    // handleAcceptButton();
    checkPermissions();

  }

  const checkPermissions = async () => {

    if (Platform.OS = "android") {

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
          console.log('All permissions granted');
          // You can now use the requested features that require these permissions
        } else {
          console.log('One or more permissions denied');
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
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        const { statusMicroPhone } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

        if (status === 'granted' && statusMicroPhone === 'granted') {
          console.log('Camera permission is granted.');
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

          console.log('Camera permission is not granted.');
        }
      } catch (err) {
        console.warn(err);
      }

    }


  }
  const handleAcceptButton = () => {
    // pause(audioElement,0);

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
      console.log('if autoDisconnectTimeOutEvent')
      clearTimeout(autoDisconnectTimeOutEvent)
    }
    onNavigate()
    //Un comment this when push

    if (currentItem != null) {

      let uri = currentItem.data ?
        currentItem.data.LINK + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + item.calltype + "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
        : currentItem.LINK + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + item.calltype + "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
      console.log("Accepted call", uri)
      Linking.openURL(uri);
    }
    else {

      let uri = "aevl://app.wed/redirect?SCREENVALUE=VIDEOCHATCALL" + "&roomno=" + item.roomno + "&rooms=" + item.rooms + "&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item=" + item + "&calltype=" + item.calltype + "&userCode=" + item.userCode + "&mappedUserCode=" + item.mappedUserCode + "&name=" + item.name + "&image=" + item.image + "&uid=" + item.uid + "&accept=true&sourceuid=" + item.sourceuid
      Linking.openURL(uri);
    }

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
    console.log("handleEndCall")
    setshowNotificationIncomingCall(false);
    InCallManager.stop();

  };

  const onCancelHandler = async () => {
    //Code done on 01 December by wasim
    if (autoDisconnectTimeOutEvent) {
      console.log('if autoDisconnectTimeOutEvent')
      clearTimeout(autoDisconnectTimeOutEvent)
    }
    // remoteSocketId 2713882 2702140
    //  setVideoCallEvent("cancel")// un comment
    globalAcceptReject = true;
    try {
      console.log('remoteSocketId', item, UserData.userId);
      //  PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
      setshowNotificationIncomingCall(false);
      InCallManager.stop();


      socket.emit('endCall', { to: item.sourceuid, from: UserData.userId, room: item.rooms });
      socket.emit("misesdcall", { from: UserData.userId, to: item.sourceuid, call: 'missedCall',devplatform:Platform.OS ="android"?"android":"ios",
      calltype:item.calltype });
      onNavigate()
    } catch (error) {
      console.log("in cancle error", error)
    }
    //peer.peer.close();


    // await peer.reconnectPeerConnection();


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