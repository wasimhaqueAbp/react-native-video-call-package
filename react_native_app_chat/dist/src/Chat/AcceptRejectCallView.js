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
    
} from 'react-native';
import { IconButton } from 'react-native-paper';


import InCallManager from 'react-native-incall-manager';


//import { setVideoCallEvent } from '../../../Utility/FirebaseHandler';

import { prepareShortName, showToast } from '../Utility/Utility';
import { propTypes } from 'react-native-page-control';

const AcceptRejectCallView = ({name,socket,item,socketConneted,currentItem,UserData,onNavigate } ) => {
  // const navigation = useNavigation();
 // const navigation = React.useContext(NavigationContext);
  let incomingData = null;
  let remoteAcceptCall = false
    const [incomingCall, setIncomingCall] = useState(null);
    
    const [showNotificationIncomingCall, setshowNotificationIncomingCall] = useState(false);
    const moreRef = useRef();
    const [userData, setUserData] = useState(null);
    const [targetUserName,setTargetUserName] = useState(null);
    const [callTypes,setCallTypes] = useState(null)
   // const [remoteAcceptCall,setRemoteAcceptCall] = useState(false);
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

      


    const IncommingCallNotification = useCallback(
        async ({ from,room,calltype,fromname,userCode, mappedUserCode}) => {

            
            console.log("IncommingCallNotification",room,from,fromname,userCode,mappedUserCode)
            setshowNotificationIncomingCall(true);
            //handleremoteSocketId(from);
            remoteAcceptCall = false;
            incomingData = { from,room,calltype,fromname,userCode, mappedUserCode};
            setIncomingCall({ from,room,calltype,fromname,userCode, mappedUserCode});
            setTargetUserName(fromname)
            setCallTypes(calltype)

            //console.log(`Incoming Call`, from, offer);
        },
        [socket]
    );
  
   
    useEffect(()=>{
        //console.log("audioElement 111",audioElement);
        if(incomingCall!=null){
            console.log("audioElement??? ");
           // outGoingRing(audioElement);
          // InCallManager.startRingtone('_DEFAULT_'); // or _DEFAULT_ or system filename with extension
          InCallManager.start({media: 'audio', ringback: '_BUNDLE_'}); // or _DEFAULT_ or system filename with extension
        }
    },[incomingCall])

    const acceptCall = async () => {
      
        InCallManager.stop();
        remoteAcceptCall = true;
        incomingData= null
       // setRemoteAcceptCall(true)
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
       console.log("sjhs",incomingCall)
      
         let roomNo=2456;
    //     let url='/'+ROUTES.CALLWINDOW+'?roomno='+incomingCall.from+'&room='+roomNo+'&audio=true&video=true&callaccept=Y&callinitiateByothers=remote';
    //     let nameWindow='chatWindow';
    //     let windowWidth=1200;
    //     let windowHeight=700;
        
   // console.log("incomingCall.from",incomingCall.from)
    console.log("incomingCall.from",currentItem)
    //console.log("incomingCall.from",incomingCall.from)
    console.log("item???",item)
  //  setVideoCallEvent("accept") // un comment
   // setshowNotificationIncomingCall(true);

  // PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
  //"&roomno="+incomingCall.from+"&rooms="+incomingCall.room+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&item="+item
 // const props = {"roomno":incomingCall.from,"rooms=":incomingCall.room,"audio":true,"video":true,"callaccept":"Y","callinitiateByothers":"remote","item":item} 
 // onNavigate({data:props})
  //Un comment this when push
  
   if(currentItem != null){
    
  let uri =currentItem.LINK+"&roomno="+incomingCall.from+"&rooms="+incomingCall.room+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item="+item+"&calltype="+incomingCall.calltype+"&userCode="+incomingCall.userCode+"&mappedUserCode"+incomingCall.mappedUserCode //+"&socket="+JSON.parse(socket)+"&socketConneted="+socketConneted
   console.log("Accepted call",uri)
   Linking.openURL(uri);
  }
  else{
    
    let uri ="aevl://app.wed/redirect?SCREENVALUE=VIDEOCHATCALL"+"&roomno="+incomingCall.from+"&rooms="+incomingCall.room+"&audio=true&video=true&callaccept=Y&callinitiateByothers=remote&audioVideoType=video&item="+item+"&calltype="+incomingCall.calltype+"&userCode="+incomingCall.userCode+"&mappedUserCode"+incomingCall.mappedUserCode //+"&socket="+JSON.parse(socket)+"&socketConneted="+socketConneted
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
           
            socket.on("IncommingCallNotification", IncommingCallNotification);
            socket.on('endCall', handleEndCall);
            return () => {
                socket.off("IncommingCallNotification", IncommingCallNotification);
                socket.off('endCall', handleEndCall);
            }
        }       

    }, [socket, IncommingCallNotification]);

    useEffect(() => {
      const disconnectTimeout =   setTimeout(() => {
       console.log("sockettss????",remoteAcceptCall)
       console.log("UserData????",incomingCall)
        if(remoteAcceptCall == false && incomingCall != null && UserData != null){
       // InCallManager.stop();
    // alert("hiii")
    console.log("in income")
       onCancelHandler();
        }
       //
      }, 20000);
      return () => clearTimeout(disconnectTimeout);
    }, [UserData,incomingCall,socket]);
 
    const handleEndCall = async ({from}) => {
      // Stop the streams
     console.log("handleEndCall")
      setshowNotificationIncomingCall(false);
      InCallManager.stop();
    
    };
   
    const onCancelHandler = () =>{
     // setRemoteAcceptCall(true)
     remoteAcceptCall = true;
     incomingData= null;
         // remoteSocketId 2713882 2702140
       //  setVideoCallEvent("cancel")// un comment
        console.log('remoteSocketId', incomingCall,UserData.userId);
     //  PushNotification.cancelAllLocalNotifications({ id: currentItem.id });
     setshowNotificationIncomingCall(false);
     InCallManager.stop();
      
      //socket.emit('endCall', {to: incomingCall.from, from: UserData.userId });
      socket.emit('endCall', {to: incomingCall.from, from: UserData.userId , room: incomingCall.room});
      socket.emit("misesdcall", { from: UserData.userId, to: incomingCall.from });
       
        

    }


   
    return(
        
      
           
       <View style={{position:'absolute',width:'100%', backgroundColor:"red"}}>
        {showNotificationIncomingCall ?
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
            alignItems:"center",justifyContent:"space-between"
         }}>
     
        <View style={{ flex:1,alignItems:"center",}}>
        <Text style={{fontSize:20,fontWeight:"bold"}}>{ prepareShortName(targetUserName) }</Text>     
        <Text style={{fontSize:16,}}>Calling....</Text>     
        </View>
        <View style={{flexDirection:"row",flex:0.6, justifyContent:'space-between',alignItems:'center',margin:10}}>
        <View style={{ backgroundColor: "#FF1C16", borderRadius: 360,}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon="close"
              color="white"
              size={30}
              
              onPress={() => onCancelHandler()} />
          </View>
          <View style={{ backgroundColor: "green", borderRadius: 360, }}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={callTypes=="video"?"video": "phone-hangup-outline"}
              color="white"
              size={30}
              onPress={() => acceptCall()} />
          </View>
        </View>
        </View>
        :null}
        </View>
        
        
        
    )
}

export default AcceptRejectCallView;