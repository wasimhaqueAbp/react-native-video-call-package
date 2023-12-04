import React, {
  useState,
  useEffect,
  createRef,
  useRef,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  Platform,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Image,
  NativeModules,
  AudioManagerIOS,
  Linking,
  Alert,
  BackHandler,
  AppState
} from 'react-native';
import {IconButton} from 'react-native-paper';
import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
} from 'react-native-webrtc';
//import {getUser} from '../../../db/MasterData';
import io from 'socket.io-client';
import InCallManager from 'react-native-incall-manager';
import { useTranslation } from 'react-i18next';
import peer from '../Utility/peer';
import { prepareShortName,getCreatedDate } from '../Utility/Utility';
import { getImageUrl } from '../../NW/ServiceURL';
import { getEnvironment } from 'react_native_app_chat/dist/NW/ServiceAPI';



const VideoChatCall = props => {
  const {t, i18n} = useTranslation();

  const [localStream, setLocalStream] = useState(null);

  const {
    sockets,
    registerUserToSocket_,
    roomno,
    rooms,
    audio,
    video,
    callinitiateByothers,
    callaccept,
    item,
    socketConneted,
    UserData,
    audioVideoType,
    userCode,
    mappedUserCode,
    targetUserName,
    targetUserImage
  } = props.props;
  
  console.log('item video call',props.props,
  // registerUserToSocket_,
  // roomno,
  // rooms,
  // audio,
  // video,
  // callinitiateByothers,
  // callaccept,
  // item,
  // socketConneted,
  );
  let intervalId = null;
  let autoDisconectBit= false
  const [socket,setsocket]=useState(sockets);
  
  const [registerUserToSocket, setregisterUserToSocket] = useState(
    registerUserToSocket_,
  );

  //const [callinitiateByothers,setcallinitiateByothers] = useState(callinitiateByothers)
  const [toUser, settoUser] = useState(roomno);
  const [fromUser, setfromUser] = useState('');
  const [room, setroom] = useState(rooms);

  const [remoteSocketId, setRemoteSocketId] = useState(toUser);

  const [myStream, setMyStream] = useState();

  const [callaccepted, setcallaccepted] = useState(callaccept); //query.get("callaccept")

  const [incomingCall, setIncomingCall] = useState(null);

  const [remoteStream, setRemoteStream] = useState();

  const [sendStreamFlag, setsendStreamFlag] = useState(0);

  const [callOn, setcallOn] = useState(false);

  const [userRoomJoined, setuserRoomJoined] = useState(false);
  const [callended, setcallended] = useState(false);
  const [endedBy, setendedBy] = useState('');
  const [userData, setUserData] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(false);
  
  const [audioORVideo,setAudioORVideo] = useState(true)  
const [remoteAcceptCall,setRemoteAcceptCall] = useState(false);
  const [timer, setTimer] = useState(0);
  const [remoteAudioEnableDisable,setRemoteAudioEnableDisable] = useState("")
  const [remoteVideoEnableDisable,setRemoteVideoEnableDisable] = useState("")
    const [callDuration,setCallDuration]= useState({
      start:'',
      end:''
    })

// Code done by Wasim on 01 December
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Handle the back button press (e.g., navigate back or show a confirmation dialog)
        // Return true to indicate that we've handled the back button
        // Return false to let the default behavior (e.g., exit the app) happen
        // For example:
        // navigateBack(); // Implement your navigation logic
        
          Alert.alert(
            '',
            'Are you sure you want to end the call',
            [
              {text: 'Yes', onPress: () =>  EndCall()},
      
              {
                text: 'No',
                onPress: () => null,
                style: 'cancel',
              },
            ],
      
            {cancelable: true},
          );
      
        return true;
      }
    );

    return () => {
      backHandler.remove(); // Unsubscribe from the event when the component is unmounted
    };
  }, []); 
  
  useEffect(() => {
    // Subscribe to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    //Code done by Wasim on 01
    console.log("nextAppState videocall",nextAppState)
    if (nextAppState == 'background') {
      // App has gone to the background, perform your background action here
     EndCall();
    }
  };

  useEffect(()=>{
    if(audioVideoType!=null && audioVideoType!=''){
      if(audioVideoType=='video'){
        console.log("Tapas Speaker");
        InCallManager.setSpeakerphoneOn(true);
      }
      else{
        console.log("Tapas Speaker off");
        InCallManager.setSpeakerphoneOn(false);
      }
    }
   
    
  },[audioVideoType])
  
  //InCallManager.start({media: 'audio'}); // audio/video, default: audioElement
  
  // useEffect(() => {
  //   console.log("Tapas in videos",sockets);
  //   if(sockets== undefined || sockets.id == null){
  //     const envType =getEnvironment()
  //     console.log(envType)
  //     const url = envType =="TEST"? "ws://10.132.100.191:8878":"https://messegingserviceskt.abpweddings.com"
      
  //   console.log("Tapas in video");
  //   const socketConnection = io(url,{
  //     "force new connection" : true,
  //       "reconnectionAttempts": "Infinity", 
  //       "timeout" : 10000,                  
  //       "transports" : ["websocket"],
  //     withCredentials: true,
  //     extraHeaders: {
  //       "my-custom-header": "abcd"
  //     }
  //   });

  //   // Set up event listeners or other socket-related logic here
  //   // For example:
  //   socketConnection.on('connect', () => {
  //     console.log('Socket connected in video');
  //    // setsocketConneted(true);
  //   });

  //   setsocket(socketConnection);    

  //   // Clean up the socket connection when the component is unmounted
  //   return () => {
  //     if (socketConnection) {
  //       socketConnection.disconnect();
  //       setsocketConneted(false);
  //     }
  //   };
  // }
  // }, []);

  // useEffect(() => {
  //   // Set up an interval that runs every 1000 milliseconds (1 second)
  //   if(callOn ){
  //     intervalId = setInterval(() => {
  //       setTimer((prevTimer) => prevTimer + 1);
  //      // console.log("timer",timer)
  //     }, 1000); // Update the timer every second
  
  //     // Clean up the interval when the component is unmounted
  //     return () => clearInterval(intervalId);
  
  //   }
    
    
  //  }, [callOn]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    let time = "00:00"

    if(hours == "00"){
      time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }else{
      time = `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    return time//`${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  useEffect(() => {
    //let realmObj;
   // InCallManager.stop();
    console.log("incoming")
    if(callinitiateByothers == "own"){
      InCallManager.start({media: 'audio', ringback: '_BUNDLE_', auto: audioVideoType == "video"? 'speaker':"earpiece"}); // or _DEFAULT_ or _DTMF_
    }
    

    (async () => {
      const obj = UserData //await getUser();
      console.log('UserData???', obj);
      setUserData(obj);
      setfromUser(obj.userId);
    })();

    return () => {
      // realmObj.close();
    };
  }, [UserData]);

  const handleregisterUserComplete = () => {
    setregisterUserToSocket(true);
  };

  useEffect(() => {
    // const userData = await getUser();
    console.log(
      'userDatass VideoCall',
      socket,
      userData,
      socketConneted,
      registerUserToSocket_,
    );
    if (
      socket != null &&
      userData != null &&
      socketConneted &&
      registerUserToSocket_ == null
    ) {
      console.log('registerUser emit', userData);
      socket.emit('registerUser', {from: userData.userId});

      try {
        socket.on('registerUserComplete', handleregisterUserComplete());
        return () => {
          socket.off('registerUserComplete', handleregisterUserComplete);
        };
      } catch (error) {
        console.error('Error setting up socket listener:', error);
      }
    }
  }, [socket, userData, socketConneted]);

  useEffect(() => {
    if (userData != null) {
      setfromUser(userData.userId);
    }
  }, [userData]);

  useEffect(() => {
    setRemoteSocketId(toUser);
  }, [toUser]);

  useEffect(() => {
    setTimeout(() => {
      console.log("remoteStream",remoteStream)
     console.log("Callon",autoDisconectBit);
    
      if(autoDisconectBit == false && remoteStream == undefined){
     InCallManager.stop();
    //alert("hiii")
    console.log("in auto dis")
    //Code change on 01 december
     //   EndCall();
      }
      
     //
    }, 160000);
  }, []);

  const handleCallUser = async () => {
    try {

      const callTypes =audioVideoType == "video"? true: false
      const stream = await mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            googEchoCancellation: true, // Enable echo cancellation
          },
        },
        video:callTypes //audioVideoType == "video"? true: false
        // audio: true,
      });
      setMyStream(stream);
      console.log('stream??', callTypes);

setAudioORVideo(callTypes)
//alert(audioVideoType+audioORVideo)
      // socket.emit('initCall', {from: fromUser, to: remoteSocketId, room: room,fromname:userData.username,calltype:audioVideoType});
      var devPlat = Platform.OS=="android"?"android":"ios" 
      socket.emit("initCall", { from: fromUser, to: remoteSocketId, room: room, calltype: audioVideoType,fromname:userData.username,devplatform:devPlat,userCode:userCode, mappedUserCode:mappedUserCode});
      console.log("initCall??? ", { from: fromUser, to: remoteSocketId, room: room, calltype: audioVideoType,fromname:UserData.username,devplatform:devPlat,userCode:userCode, mappedUserCode:mappedUserCode})
      //socket.emit("startCall", { from:fromUser, to: remoteSocketId, offer });
      
    } catch (error) {

      console.log('errorrr handleCallUser', error);
    }
  };
  const handleuserInRoom = async () => {
    console.log("handle User in room")
    setuserRoomJoined(true);
  };


  useEffect(() => {
    async function userJoined() {
      if (userRoomJoined) {
        setcallOn(true);
        const sdpOffer = await peer.getOffer();
        const offer = sdpOffer;
        console.log("sdpOffer startCall",sdpOffer,offer,room)
        socket.emit('startCall', {
          from: fromUser,
          to: remoteSocketId,
          offer,
          room: room,
        });
      }
    }
    userJoined();
  }, [userRoomJoined, room]);
  const acceptCall = async () => {
    try {
      InCallManager.stop();
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: {
          mandatory: {
            googEchoCancellation: true, // Enable echo cancellation
          },
        },
        // audio: true,
      });
      setMyStream(stream);
      console.log("incomingCall.offer",incomingCall.offer)
      const ans = await peer.getAnswer(incomingCall.offer);

      console.log('Tapas In', ans);
      console.log('Tapas In incomingCall.from', incomingCall.from);
      console.log('Tapas In fromUser', fromUser);
      var devPlat = Platform.OS=="android"?"android":"ios" 
      //socket.emit("acceptCall", { to: incomingCall.from, from: fromUser, ans: ans, room: room,devplatform:devPlat });
     // socket.emit("acceptCall", { to: roomno, from: fromUser, ans: ans, room: room,devplatform:devPlat });
      socket.emit('acceptCall', {
        to: incomingCall.from,
        from: fromUser,
        ans,
        room: room,
      });
      autoDisconectBit = true
      socket.emit("calltime", { to: incomingCall.from, from: fromUser, starttime: getCreatedDate(), endtime: '' });
      setCallDuration((prevData) => {
        return { ...prevData, ['start']: getCreatedDate() }
    })
    
      console.log('stream????', stream, incomingCall.from, fromUser);
    } catch (error) {
      console.log('errorrr acceptCall', error);
    }
  };

  const getCallDetails = () => {
    console.log("getCallDetails",remoteSocketId,fromUser,room);
    socket.emit('getCallDetails', {
      from: remoteSocketId,
      to: fromUser,
      room: room,
      socketid:socket.id
    });
  };

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {

        console.log("Tapas Incomming",from, offer);
        //setRemoteSocketId(from);
        setIncomingCall({ from, offer});
        //////console.log(`Incoming Call`, from, offer);
        
    },
    [socket]
);

const handleCallAccepted = useCallback(
  ({ from, ans }) => {

      console.log("Tapas Accepted", from, ans);

      if (ans != null && ans != undefined) {
        peer.setLocalDescription(ans);
        console.log('Call Accepted!', ans);
        let a = sendStreamFlag;
        setsendStreamFlag(a++);
        
        //sendStreams();
      }
  },
  [sendStreams]
);

const sendStreams = () => {
  for (const track of myStream.getTracks()) {
    peer.peer.addTrack(track, myStream);
  }
};

const handleICECandidateEvent = useCallback(
  async (event) => {
      if (event.candidate && remoteSocketId && room && fromUser) {
          console.log("event.candidate", fromUser, remoteSocketId, event.candidate);
          socket.emit('iceCandidate', { from: fromUser, to: remoteSocketId, candidate: event.candidate, room: room });
      }

  },
  [remoteSocketId, socket, room, fromUser]
);

  useEffect(() => {
    if (myStream) {
        sendStreams();
    }
}, [myStream, sendStreamFlag]);


const handleNegoNeedIncomming = useCallback(
  async ({from, offer}) => {
    try {
      if (userData != null) {
        if (offer) {
          const ans = await peer.getAnswer(offer);
          console.log('handleNegoNeedIncomming-ANS', ans);

          console.log('TTTTTTTT');
          console.log('handleNegoNeedIncomming', offer);
          socket.emit('negotiationDone', {
            to: from,
            from: fromUser, // userData.userId,
            ans,
            room: room,
          });
        }
      }
    } catch (error) {
      console.log('errorrr handleNegoNeedIncomming', error);
    }
  },
  [socket, userData, room],
)

// const handleNegoNeeded = useCallback(async () => {
//   try {
//     if (userData != null) {
//       const offer2 = await peer.getOffer();
//       let offer = offer2;
//       console.log('offer2???', offer2);
//       console.log('offer2???', fromUser);
//       console.log('New', offer, remoteSocketId);
//       setTimeout(() => {
//         console.log('offer2 from???', userData.userId);
//         socket.emit('negotiationneeded', {
//           offer,
//           to: remoteSocketId,
//           from: userData.userId,
//           room: room,
//         });
//       }, 1500);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }, [remoteSocketId, socket, userData, room]);
  const handleNegoNeeded = useCallback(async () => {
    try {

        console.log("remoteSocketId", remoteSocketId, "fromUser", fromUser);
        if(remoteSocketId!=null && fromUser!=null){
        const offer2 = await peer.getOffer();
        let offer = offer2;
        console.log("New handleNegoNeeded",offer,remoteSocketId);
        socket.emit("negotiationneeded", { offer: offer, to: remoteSocketId, from: fromUser, room: room });
         }

    } catch (error) {
        //console.log(error);
    }
}, [remoteSocketId, socket, room,fromUser]);

useEffect(() => {
  console.log("Nego Needed EXtra");
  peer.peer.addEventListener('negotiationneeded', handleNegoNeeded);
  return () => {
    peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded);
  };
}, [handleNegoNeeded]);
useEffect(() => {
  peer.peer.addEventListener('icecandidate', handleICECandidateEvent);
  return () => {
    peer.peer.removeEventListener('icecandidate', handleICECandidateEvent);
  };
}, [handleICECandidateEvent]);

const handleNegoNeedFinal = useCallback(
  async ({ans}) => {
    console.log('setLocalDescription handle', ans);
    try {
      await peer.setLocalDescription(ans);
    } catch (error) {
      console.log('errorrr handleNegoNeedFinal', error);
    }
  },
  [handleNegoNeedFinal],
);

const handleRemoteICECandidate = data => {
  console.log('Received remote ICE candidate:', data.candidate);
  try {
    const candidate = new RTCIceCandidate(data.candidate);
    //console.log("candidate",candidate);
    peer.peer.addIceCandidate(candidate).catch(error => {
      console.error('Error adding ICE candidate:', error);
    });
  } catch (error) {
    console.log('errorrr handleRemoteICECandidate', error);
  }
};
useEffect(() => {
  try {
    peer.peer.addEventListener('track', async ev => {
      const remoteStream = ev.streams;
       console.log('GOT TRACKS!!', remoteStream[0]);
      autoDisconectBit=  true;
     // setRemoteStream(remoteStream[0]);
      if( audioVideoType == "video"){
        console.log("video call")
        
          setRemoteStream(remoteStream[0]);
        
      }
      else if(audioVideoType == "voice"){
        console.log("audio call")
        remoteStream.getVideoTracks()[0].enabled = false//!remoteStream.getVideoTracks()[0].enabled

    setRemoteStream(remoteStream[0]);
      }
    });
  } catch (error) {
    console.log('errorrr useEffect ', error);
  }
}, []);

// useEffect(() => {
//   try {
//       peer.peer.addEventListener("track", async (ev) => {
//           const remoteStream = ev.streams;
//           console.log("GOT TRACKS!!Remote", remoteStream[0]);
//           setRemoteStream(remoteStream[0]);
//          autoDisconectBit=  true;
        //   if( audioVideoType == "video"){
        //     console.log("video call")
            
        //       setRemoteStream(remoteStream[0]);
            
        //   }
        //   else if(audioVideoType == "voice"){
        //     console.log("audio call")
        //     remoteStream.getVideoTracks()[0].enabled = false//!remoteStream.getVideoTracks()[0].enabled

        // setRemoteStream(remoteStream[0]);
        //   }
          
//       });
//   } catch (error) {
//       //console.log("errorrr useEffect ",error);
//   }

// }, []);

useEffect(() => {
  if (
    fromUser != '' &&
    toUser != '' &&
    incomingCall == null &&
    socket &&
    registerUserToSocket &&
    callinitiateByothers == 'own'
  ) {
    handleCallUser();
  }
}, [toUser, fromUser, socket, registerUserToSocket, callinitiateByothers]);

useEffect(() => {
  console.log(
    'getCallDetails123',
    callaccepted,
    remoteSocketId,
    registerUserToSocket,
  );
  if (
    callaccepted == 'Y' &&
    remoteSocketId != null &&
    socket &&
    registerUserToSocket
  ) {
    getCallDetails();

    //startCall
  }
}, [callaccepted, remoteSocketId, socket, registerUserToSocket]);

  
  useEffect(() => {

    if (incomingCall != null ) {
        setcallOn(true);
        acceptCall();
    }
}, [incomingCall])

  useEffect(() => {
    //console.log("mmmmm",audioElement,incomingCall,callinitiateByothers,userRoomJoined);
    //if(audioElement!=null && incomingCall==null && callinitiateByothers=='own' && userRoomJoined){
    if (
      incomingCall == null &&
      callinitiateByothers == 'own' &&
      userRoomJoined
    ) {
      //  pause(audioElement,0);
      autoDisconectBit= true
     // setRemoteAcceptCall(true);
      InCallManager.stop();

     
    }
  }, [
    incomingCall,
    //audioElement,
    callinitiateByothers,
    userRoomJoined,
  ]);

  const handleEndCall = async ({from}) => {
    // Stop the streams
    let fromname = 'Remote User';
    if (from == 'own') {
      fromname = 'You';
    }
    setendedBy(fromname);

    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
    }
    peer.peer.close();
    setcallOn(false);
    setMyStream()
    setRemoteStream();
    setcallended(true);
    await peer.reconnectPeerConnection();
    InCallManager.stop();

    props.goBack()
  };

  useEffect(() => {
    if (remoteStream && remoteStream != null) {
        handleRemoteStream(remoteStream);
    }
}, [remoteStream]);

  const handleRemoteStream = remoteStream => {
    // Attach the remote stream to the remote video element
    console.log('remoteStream handleRemoteStream', remoteStream);
    try {
      // Enable echo cancellation and noise suppression on the remote audio track
      if (remoteStream) {
        // const remoteAudioTrack = remoteStream.getAudioTracks()[0];

        if(audioVideoType == "video"){
          
          InCallManager.setForceSpeakerphoneOn(true);
        }
        // else{
        //   console.log("in else of remote")
        //   InCallManager.setForceSpeakerphoneOn(false);
        //   InCallManager.setSpeakerphoneOn(!InCallManager.isSpeakerOn)
        // }

        

        console.log('TTTTT');

        // if (remoteAudioTrack) {
        // const settings = remoteAudioTrack.getSettings();
        // remoteAudioTrack.setPlaybackDevice('speaker');
      }
    } catch (error) {
      console.log('errorrr handleRemoteStream', error);
    }
  };

 
  const EndCall = async () => {

    if(timer > 0){
      clearInterval(intervalId);
    }
    InCallManager.stop();
    setcallOn(false);
    peer.peer.close();
    setcallended(true);
    if (myStream) {
      myStream.getTracks().forEach(track => track.stop());
      setMyStream()
    }
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      
    }
    setRemoteStream();
    console.log('remoteSocketId',item, remoteSocketId, fromUser);
    socket.emit('endCall', {to: remoteSocketId, from: fromUser, room: room});
    await peer.reconnectPeerConnection();
    if (callDuration.start) {

      let endCallTime = getCreatedDate();
      let actualDuration = endCallTime - callDuration.start
      let diffInSec = Math.floor(actualDuration / 1000);
  let duration =formatTime(diffInSec);
      const secTalked = diffInSec % 60
      const minTalked = Math.floor(diffInSec / 60)
      console.log('endCallTime', endCallTime, 'callDuration.start', callDuration.start,"duration",duration)
      console.log(secTalked,"secTalked",minTalked,"minTalked");
      let arr={
        senderName:userCode,
    targetUserName: mappedUserCode,
    message: duration,
    "createdon":  getCreatedDate(),
    "modifyon":  getCreatedDate(),
    type:audioVideoType == "video"? "video":"voice",
    "devPlatform":Platform.OS =="android"?"android":"ios"
    }
    console.log("arr",arr)
      socket.emit("messageSendToUser",arr);
        
    }
    else{
      //alert("missedCall")
      console.log("misedCall in videoCall")
      socket.emit("misesdcall", { from: fromUser, to: remoteSocketId,call: 'missedCall', devplatform:Platform.OS ="android"?"android":"ios",
      calltype:audioVideoType});
    }  
    
    
 // peer.peer.close();
 // await peer.reconnectPeerConnection();
    props.goBack()
  };

  useEffect(() => {
    // Enable or disable audio track based on audioEnabled state
    if (myStream) {
      myStream.getAudioTracks().forEach(track => {
        track.enabled = audioEnabled;
      });
    }
  }, [audioEnabled]);

  const toggleAudio = () => {
    //console.log("audioEnabled",audioEnabled,remoteSocketId,fromUser);

    if(audioEnabled){
      socket.emit('disableaudio', {
        to: remoteSocketId,
        from: fromUser,
        room: room,
       audio:"disable"
      });
    }
    else{
      socket.emit('enbleaudio', {
        to: remoteSocketId,
        from: fromUser,
        room: room,
        audio:"enable"
      });
    }
    setMyStream((prevStream) => {
      prevStream.getAudioTracks().forEach((track) => {
          track.enabled = audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
      return prevStream;
  });
   
  };

  const toggleSpeaker = () => {
    
    if (Platform.OS === 'ios') {
      AudioManagerIOS.setCategory('PlayAndRecord', isSpeakerOn ? 'builtInSpeaker' : 'default');
    }
    InCallManager.setForceSpeakerphoneOn(!speakerEnabled);
    if (InCallManager.isSpeakerOn) {
      InCallManager.setSpeakerphoneOn(false);
    } else {
      InCallManager.setSpeakerphoneOn(true);
    }
    setSpeakerEnabled(!speakerEnabled)
  };

  const handleEnableAudio = async ({audio}) => { 
    console.log("event Audio Enable",audio)
    setRemoteAudioEnableDisable("")

  }
  const handleDisableAudio = async ({audio}) => { 
   // console.log("event Audio disable",audio)
    setRemoteAudioEnableDisable(audio)
  }
  const handleEnableVideo = async ({video}) => { 
    console.log("event Video Enable",{video}, audioORVideo)
    let videoDisble =audioORVideo;
    setRemoteVideoEnableDisable("")
   
     
    // setTimeout(()=>{
    //   console.log("in timeout")
    //   setMyStream((prevStream) => {
    //     console.log("in timeout",prevStream.getVideoTracks()[0].enabled,audioORVideo )
    //     prevStream.getVideoTracks()[0].enabled = !prevStream.getVideoTracks()[0].enabled
  
    //     return prevStream;
    // });
  

    
   // },3500)
   
  }
  const handleDisableVideo = async ({video}) => { 
    console.log("event Video  disable",video)
    setRemoteVideoEnableDisable(video)
  }
  useEffect(() => {
    if (callended) {
      console.log('TEnd');
        socket.emit('clearRoomandSockets', {
          to: remoteSocketId,
          from: fromUser,
          room: room,
        });
     
    }
  }, [callended]);
  const handleCallTimeEmit = (data) => {
    console.log('handleCallTimeEmit', data)
    if ('starttime' in data) {
        setCallDuration({ ...callDuration, start: data.starttime })
    }
}
const handleCallEngage = (data) => {
  console.log('handleCallEngageEmit', data)
  EndCall();
}
  useEffect(() => {
    if (socket != null) {
      try {
        socket.on('userInRoom', handleuserInRoom);
         socket.on('incommingcall', handleIncommingCall);
         socket.on('callAccepted', handleCallAccepted);
          socket.on('negotiationneeded', handleNegoNeedIncomming);
          socket.on('negotiationFinal', handleNegoNeedFinal);
          socket.on('iceCandidate', handleRemoteICECandidate);
          socket.on('endCall', handleEndCall);
         socket.on('enbleaudio',handleEnableAudio)
         socket.on('disableaudio',handleDisableAudio)
         socket.on('enblevideo',handleEnableVideo)
         socket.on('disablevideo',handleDisableVideo)
         socket.on("calltime", handleCallTimeEmit);
        // socket.on("alreadyengaged", handleCallEngage);
        return () => {
            socket.off('userInRoom', handleuserInRoom);
            socket.off('incommingcall', handleIncommingCall);
            socket.off('callAccepted', handleCallAccepted);
            socket.off('negotiationneeded', handleNegoNeedIncomming);
            socket.off('negotiationFinal', handleNegoNeedFinal);
            socket.off('iceCandidate', handleRemoteICECandidate);
            socket.off('endCall', handleEndCall);
          socket.off('enbleaudio',handleEnableAudio)
          socket.off('disableaudio',handleDisableAudio)
          socket.off('enblevideo',handleEnableVideo)
          socket.off('disablevideo',handleDisableVideo)
        };
      } catch (error) {
        console.error('Error setting up socket listener:', error);
      }
    }
  }, [
    socket,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
    handleRemoteICECandidate,
  ]);
  //

  const LocalStreamView = () => {
    return (
      <View
        style={{
          position: 'absolute',
          //flexDirection: 'row',
          right: 10,
          bottom: 10,
          alignItems:"flex-end",
          width:"100%",
        }}>
         {audioVideoType== "video"?
         audioORVideo? <RTCView
          streamURL={myStream?.toURL()}
          objectFit={'cover'}
          style={{width: 80, height: 120,top:20, borderRadius:10}}
          volume={1.5}
          mirror={false} // Adjust this based on your requirements
          // audioOutput={'output-speaker'} // This controls the audio output
        /> :
        <View style={{borderWidth:1,borderColor:"#FFF",top:20}}>
         <Image
               source={require('../icons/dummy_user.png')}
               style={{width: 80, height: 120,borderColor:"#FFF", resizeMode:"contain"}}
            /> 
            </View>
            :
            <View style={{width: 120, height: 200}} />
            }
     
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            //paddingRight: 10,
            justifyContent:"center",
            padding: 10,
            width:"100%",
            alignSelf:"center",
            flex:1
          }}>
         
         
          {audioVideoType== "video"&&<View
            style={{backgroundColor: '#333333', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={audioORVideo ? 'camera' : 'camera-off'}
              color="white"
              size={25}
              onPress={async () => {
               console.log("audioORVideo",audioORVideo)
               if(audioORVideo){
      socket.emit('disablevideo', {
        to: remoteSocketId,
        from: fromUser,
        room: room,
        video:"diable"
       
      });
    }
    else{
      socket.emit('enblevideo', {
        to: remoteSocketId,
        from: fromUser,
        room: room,
        video:"enable"
      });
    }
      
      setMyStream((prevStream) => {
            
            prevStream.getVideoTracks()[0].enabled = !prevStream.getVideoTracks()[0].enabled

            return prevStream;
        });
      setAudioORVideo(!audioORVideo)
              }}
            />
          </View>}
          {/* {audioVideoType== "voice"&& <View
            style={{backgroundColor: '#333333', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={speakerEnabled ? 'volume-high': 'volume-off' }
              color="white"
              size={25}
              onPress={() => {
               
                toggleSpeaker()
              }}
            />
          </View>} */}
          <View
            style={{backgroundColor: '#333333', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={audioEnabled ? 'microphone' : 'microphone-off'}
              color="white"
              size={25}
              onPress={() => {
                toggleAudio();
              }}
            />
          </View>
          <View
            style={{backgroundColor: '#FF1C16', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon="phone-hangup-outline"
              color="white"
              size={25}
              onPress={() => {
                EndCall();
              }}
            />
          </View>
        </View>

       </View>
    );
  };
  
  return (
    <View style={{flex: 1}}>
      
      {remoteStream && callOn && !callended  ? (
       <View style={{flex: 1,}}>
          
         
           <RTCView
            streamURL={remoteStream?.toURL()}
            objectFit={'cover'}
            style={{height: '100%'}}
            volume={1.5}
            mirror={false} // Adjust this based on your requirements
            // audioOutput={'output-speaker'} // This controls the audio output
          />
           
          
          {/* {remoteVideoEnableDisable != ""? */}

              <View  style={{zIndex:1, flex:1,position: 'absolute',
              //flexDirection: 'row',
              right: 0,
              bottom: 0,
              top:0,
              left:0,
              alignItems:"center",
              justifyContent:"center",
              width:"100%",}}>
            {remoteVideoEnableDisable != "" && remoteAudioEnableDisable == "disable" ?
              <View style={{backgroundColor:"#656565", borderRadius:10,paddingHorizontal:10, paddingVertical:10}}>
              <Text style={{fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>
                  {prepareShortName(targetUserName)+" paused  video & audio"}
                </Text>
                </View>:
            remoteVideoEnableDisable != ""? <View style={{backgroundColor:"#656565", borderRadius:10,paddingHorizontal:10, paddingVertical:10}}>
              <Text style={{fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>
                  {prepareShortName(targetUserName)+" paused  video"}
                </Text>
                </View>
              :  remoteVideoEnableDisable == "" && remoteAudioEnableDisable == "disable" && 
              <View style={{backgroundColor:"#656565", borderRadius:10,paddingHorizontal:10, paddingVertical:10}}>
              <Text style={{fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>
                  {prepareShortName(targetUserName)+" muted this call"}
                </Text>
                </View>
              }
              </View>
          {/* // <View style={{ //position: 'absolute',
          
          // flex:1,
          // width:"100%",
          // height:"100%",

          // alignItems:"center",justifyContent:"center",
          // backgroundColor: '#000000',}}>
          //   <Image
          //     source={{uri: getImageUrl(item.userphotoimageurl)}}
          //     style={styles.circularImg}
          //   /> 
          //   <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>
          //     {prepareShortName(targetUserName)}
          //   </Text>
           
          //   </View>
          //   :<Text></Text>
          // } */}
           {/* {remoteVideoEnableDisable == "" && remoteAudioEnableDisable == "disable" &&  
          <View  style={{zIndex:1, flex:1,position: 'absolute',
          //flexDirection: 'row',
          right: 0,
          bottom: 0,
          top:0,
          left:0,
          alignItems:"center",
          justifyContent:"center",
          width:"100%",}}>
          <View style={{backgroundColor:"#656565", borderRadius:10,paddingHorizontal:10, paddingVertical:10}}>
          <Text style={{fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>
              {prepareShortName(targetUserName)+" muted this call"}
            </Text>
            </View>
          </View>
          }  */}

          <View style={{zIndex: 1}}>{LocalStreamView()}</View> 
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              height: '100%',
              backgroundColor: '#000000',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
            }}>
             <Image
              source={{uri: getImageUrl(targetUserImage)}}
              style={styles.circularImg}
            /> 
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>
              {prepareShortName(targetUserName)}
            </Text>

            {remoteVideoEnableDisable == "" && remoteAudioEnableDisable == "disable" &&  
          <View  style={{
          alignItems:"center",
          justifyContent:"center",
          width:"100%",}}>
          <View style={{backgroundColor:"#656565", borderRadius:10,paddingHorizontal:10, paddingVertical:10}}>
          <Text style={{fontSize: 13, fontWeight: 'bold', color: '#FFF'}}>
              {prepareShortName(targetUserName)+" muted this call"}
            </Text>
            </View>
          </View>
          } 
            {/* { callOn && <View >
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
    
          </View>} */}
            <Text style={{fontSize: 16, color: '#FFF'}}>

              {/* {callinitiateByothers=='own' && remoteStream==null?'Calling....'} */}

              {!callOn && callended
                ? 'Call ended' 
                :
                callOn?''
                :
                callinitiateByothers=='own'?'Calling....':''
                }

              {/* {!callOn && callended
                ? 'Call ended ' 
                :callOn?'' :'Calling....'} */}
            </Text>
          </View>
          {!callended &&
          LocalStreamView()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circularImg: {
    width: 130,
    height: 130,
    borderRadius: 360,
    backgroundColor: 'grey',
    overflow: 'hidden',
    // borderWidth: 4,
    // alignSelf: 'center',
    //borderColor: '#D69C14',
  },
  timerText: {
    fontSize: 24,
    marginBottom: 20,
    color:"red"
  },
});

export default VideoChatCall;