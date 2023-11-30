import React, {useState, useEffect, createRef, useRef, useCallback} from 'react';
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
    Image
    
} from 'react-native';
import { IconButton } from 'react-native-paper';


import InCallManager from 'react-native-incall-manager';


//import { setVideoCallEvent } from '../../../Utility/FirebaseHandler';

import { prepareShortName, showToast } from '../Utility/Utility';
import { propTypes } from 'react-native-page-control';

const AcceptRejectCallView = ({name,socket,item,socketConneted,currentItem,UserData,onNavigate ,organizationName,organizationImage} ) => {
  // const navigation = useNavigation();
 // const navigation = React.useContext(NavigationContext);
  
    const [incomingCall, setIncomingCall] = useState(null);
    
    const [showNotificationIncomingCall, setshowNotificationIncomingCall] = useState(false);
    const moreRef = useRef();
    const [userData, setUserData] = useState(null);
    const [targetUserName,setTargetUserName] = useState(null);
    const [callTypes,setCallTypes] = useState(null)
    const [autoDisconnectTimeOutEvent,setautoDisconnectTimeOutEvent] = useState()
   
    console.log("Accept Reject ",name,socket,item,socketConneted,currentItem)
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
    //       //   setautoDisconnectTimeOutEvent(()=>{
    //       //     return setTimeout(()=>{
    //       //         console.log('call auto disconnected')
    //       //         callCancelHandler(event)
    //       //     },20*1000)
    //       // })
    //         //console.log(`Incoming Call`, from, offer);
    //     },
    //     [socket]
    // );
  
   
    useEffect(()=>{
        //console.log("audioElement 111",audioElement);
        if(currentItem!=null){
            console.log("audioElement??? ",currentItem);
           // outGoingRing(audioElement);
          // InCallManager.startRingtone('_DEFAULT_'); // or _DEFAULT_ or system filename with extension
          InCallManager.start({media: 'audio', ringback: '_BUNDLE_'}); // or _DEFAULT_ or system filename with extension

          setTargetUserName(currentItem.data.name);
          setCallTypes(currentItem.data.callType)
        }
    },[currentItem])

    const acceptCall = async () => {
      
        InCallManager.stop();
       
       
       // handleAcceptButton();
       checkPermissions();

       }

       const checkPermissions= async ()=>{
        
        if(Platform.OS ="android"){

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
                    text:"OK",
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
        else{
          try {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            const { statusMicroPhone } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            
            if (status === 'granted' && statusMicroPhone === 'granted') {
              console.log('Camera permission is granted.');
              setshowNotificationIncomingCall(false);
        
              handleAcceptButton();
            }  else {
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
       const handleAcceptButton = () =>{
       // pause(audioElement,0);
       
      
         let roomNo=2456;
    //     let url='/'+ROUTES.CALLWINDOW+'?roomno='+incomingCall.from+'&room='+roomNo+'&audio=true&video=true&callaccept=Y&callinitiateByothers=remote';
    //     let nameWindow='chatWindow';
    //     let windowWidth=1200;
    //     let windowHeight=700;
        
   //  setVideoCallEvent("accept") // un comment
   // setshowNotificationIncomingCall(true);

  // PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
  //"&roomno="+incomingCall.from+"&rooms="+incomingCall.room+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&item="+item
 // const props = {"roomno":incomingCall.from,"rooms=":incomingCall.room,"audio":true,"video":true,"callaccept":"Y","callinitiateByothers":"remote","item":item} 
  onNavigate()
  //Un comment this when push
  
   if(currentItem != null){
    
  let uri =currentItem.data.LINK+"&roomno="+item.roomno+"&rooms="+item.rooms+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item="+item+"&calltype="+item.calltype+"&userCode="+item.userCode+"&mappedUserCode="+item.mappedUserCode+"&name="+item.name+"&image="+item.image+"&uid="+item.uid+"&accept=true&sourceuid="+item.sourceuid 
   console.log("Accepted call",uri)
   Linking.openURL(uri);
  }
  else{
    
    let uri ="aevl://app.wed/redirect?SCREENVALUE=VIDEOCHATCALL"+"&roomno="+item.roomno+"&rooms="+item.rooms+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item="+item+"&calltype="+item.calltype+"&userCode="+item.userCode+"&mappedUserCode="+item.mappedUserCode+"&name="+item.name+"&image="+item.image+"&uid="+item.uid+"&accept=true&sourceuid="+item.sourceuid 
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

    useEffect(() => {
        if(socket){
           
          //  socket.on("IncommingCallNotification", IncommingCallNotification);
           // socket.on('endCall', handleEndCall);
           socket.on("callalreadyreceived", handlealreadyreceived);
            return () => {
               // socket.off("IncommingCallNotification", IncommingCallNotification);
               // socket.off('endCall', handleEndCall);
            }
        }       

    }, [socket, ]);

    const handlealreadyreceived = useCallback(
      async ({ event}) => {

      }
    )
 
    const handleEndCall = async ({from}) => {
      // Stop the streams
     console.log("handleEndCall")
      setshowNotificationIncomingCall(false);
      InCallManager.stop();
    
    };
   
    const onCancelHandler = async () =>{
    //   if( autoDisconnectTimeOutEvent ) {
    //     console.log('if autoDisconnectTimeOutEvent')
    //     clearTimeout(autoDisconnectTimeOutEvent)
    // }
         // remoteSocketId 2713882 2702140
       //  setVideoCallEvent("cancel")// un comment

       try {
        console.log('remoteSocketId', item.sourceuid,UserData.userId);
        //  PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
        setshowNotificationIncomingCall(false);
        InCallManager.stop();
         
         
         socket.emit('endCall', {to: item.sourceuid, from: UserData.userId , room: item.rooms});
         socket.emit("misesdcall", { from: UserData.userId, to: item.sourceuid,call: 'missedCall' });
         onNavigate()
       } catch (error) {
         console.log("in cancle error",error)
       }
          //peer.peer.close();


     // await peer.reconnectPeerConnection();
        

    }


   
    return(
        
      
           
       <View style={{position:'absolute',width:'100%', backgroundColor:"red"}}>
        {/* {showNotificationIncomingCall ? */}
        <View style={{ 
            position:'absolute',
         backgroundColor:"#FFFFFF",margin:10,borderRadius:15,
         shadowColor: '#171717',
            shadowOffset: {
            width: 10,
            height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 15,
            elevation: 5,
            flexDirection:'row',
            alignItems:"center",justifyContent:"space-between",
            padding:10
         }}>
         <View style={{paddingLeft:10}}>
   <Image source={{uri:organizationImage}} resizeMode="contain"
     style={{height:40,width:40,borderRadius:360}}
      /> 
    </View>    
        <View style={{ flex:1,paddingLeft:10}}>
        <Text style={{fontSize:18,fontWeight:"500"}}>{ prepareShortName(targetUserName) }</Text>     
            
        <Text style={{fontSize:14,}}>{callTypes=="video"?"Incoming Video Call":"Incoming Voice Call"}</Text>     
        <Text style={{fontSize:13,}}>{ organizationName }</Text> 
        </View>
        <View style={{flexDirection:"row",flex:0.8, justifyContent:'space-between',alignItems:'center',margin:10}}>
        <View style={{ backgroundColor: "#FF1C16", borderRadius: 360,}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon="close"
              color="white"
              size={25}
              
              onPress={() => onCancelHandler()} />
          </View>
          <View style={{ backgroundColor: "green", borderRadius: 360, }}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={callTypes=="video"?"video": "phone-hangup-outline"}
              color="white"
              size={25}
              onPress={() => acceptCall()} />
          </View>
        </View>
        </View>
        {/* :null} */}
        </View>
        
        
        
    )
}

export default AcceptRejectCallView;