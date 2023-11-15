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
  Alert
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
import { prepareShortName } from '../Utility/Utility';
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
    audioVideoType
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
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);






  
  
  //InCallManager.start({media: 'audio'}); // audio/video, default: audioElement
  InCallManager.start({media: 'audio', ringback: '_BUNDLE_'}); // or _DEFAULT_ or _DTMF_

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

  useEffect(() => {
    //let realmObj;

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
    setInterval(() => {
      // EndCall();
      InCallManager.stopRingback();
    }, 9000);
  }, []);

  const handleCallUser = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: {
          mandatory: {
            googEchoCancellation: true, // Enable echo cancellation
          },
        },
        video: true//audioVideoType == "video"? true: false
        // audio: true,
      });

      console.log('stream??', userData);

      socket.emit('initCall', {from: fromUser, to: remoteSocketId, room: room,fromname:userData.username});
      console.log("initCall??? ",{from: fromUser, to: remoteSocketId, room: room,})
      //socket.emit("startCall", { from:fromUser, to: remoteSocketId, offer });
      setMyStream(stream);
    } catch (error) {

      console.log('errorrr handleCallUser', error);
    }
  };
  const handleuserInRoom = async () => {
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
      InCallManager.stopRingback();
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
      const ans = await peer.getAnswer(incomingCall.offer);

      console.log('Tapas In', ans);
      console.log('Tapas In incomingCall.from', incomingCall.from);
      console.log('Tapas In fromUser', fromUser);
      socket.emit('acceptCall', {
        to: incomingCall.from,
        from: fromUser,
        ans,
        room: room,
      });
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
    });
  };

  const handleIncommingCall = useCallback(
    async ({from, offer}) => {
      console.log('Tapas Incomming', from, offer);
      //setRemoteSocketId(from);
      setIncomingCall({from, offer});
      console.log(`Incoming Call`, from, offer);
    },
    [socket],
  );

  const handleCallAccepted = useCallback(
    ({from, ans}) => {
      peer.setLocalDescription(ans);
      console.log('Call Accepted!', ans);
      let a = sendStreamFlag;
      setsendStreamFlag(a++);
      //setcallOn(true);
      //sendStreams();
    },
    [sendStreams],
  );

  const sendStreams = () => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  };

  const handleICECandidateEvent = useCallback(
    async event => {
      if (event.candidate) {
        console.log('event.candidate', userData.userId, roomno);

        socket.emit('iceCandidate', {
          from: fromUser, //userData.userId,
          to: remoteSocketId,//roomno,
          candidate: event.candidate,
          room: room,
        });
      }
    },
    [remoteSocketId, socket, room],
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
  );

  const handleNegoNeeded = useCallback(async () => {
    try {
      if (userData != null) {
        const offer2 = await peer.getOffer();
        let offer = offer2;
        console.log('offer2???', offer2);
        console.log('offer2???', fromUser);
        console.log('New', offer, remoteSocketId);
        setTimeout(() => {
          console.log('offer2 from???', userData.userId);
          socket.emit('negotiationneeded', {
            offer,
            to: remoteSocketId,
            from: userData.userId,
            room: room,
          });
        }, 1500);
      }
    } catch (error) {
      console.log(error);
    }
  }, [remoteSocketId, socket, userData, room]);

  useEffect(() => {
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
        // console.log('GOT TRACKS!!', remoteStream[0].onaddtrack);

        setRemoteStream(remoteStream[0]);
      });
    } catch (error) {
      console.log('errorrr useEffect ', error);
    }
  }, []);

  useEffect(() => {
    console.log("handleCallUser",fromUser,registerUserToSocket,toUser,incomingCall,callinitiateByothers, socket)
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
      registerUserToSocket
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
  }, [callaccepted, remoteSocketId,registerUserToSocket, socket]);

  useEffect(() => {
    if (incomingCall != null) {
      setcallOn(true);
      acceptCall();
    }
  }, [incomingCall]);

  useEffect(() => {
    //console.log("mmmmm",audioElement,incomingCall,callinitiateByothers,userRoomJoined);
    //if(audioElement!=null && incomingCall==null && callinitiateByothers=='own' && userRoomJoined){
    if (
      incomingCall == null &&
      callinitiateByothers == 'own' &&
      userRoomJoined
    ) {
      //  pause(audioElement,0);
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
    setRemoteStream();
    setcallended(true);
    await peer.reconnectPeerConnection();
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

        // setIsSpeakerOn(true);

        InCallManager.setForceSpeakerphoneOn(true);

        console.log('TTTTT');

        // if (remoteAudioTrack) {
        // const settings = remoteAudioTrack.getSettings();
        // remoteAudioTrack.setPlaybackDevice('speaker');
      }
    } catch (error) {
      console.log('errorrr handleRemoteStream', error);
    }
  };

  const EndCall = () => {
    console.log('remoteSocketId', remoteSocketId, fromUser);
    socket.emit('endCall', {to: remoteSocketId, from: fromUser, room: room});
    InCallManager.stopRingback();
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
    setAudioEnabled(!audioEnabled);
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    console.log('isSpeakerOn', isSpeakerOn);
    // if (Platform.OS === 'ios') {
    //   AudioManagerIOS.setCategory('PlayAndRecord', isSpeakerOn ? 'builtInSpeaker' : 'default');
    // }
    InCallManager.setForceSpeakerphoneOn(isSpeakerOn);
  };

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
        return () => {
          socket.off('userInRoom', handleuserInRoom);
          socket.off('incommingcall', handleIncommingCall);
          socket.off('callAccepted', handleCallAccepted);
          socket.off('negotiationneeded', handleNegoNeedIncomming);
          socket.off('negotiationFinal', handleNegoNeedFinal);
          socket.off('iceCandidate', handleRemoteICECandidate);
          socket.off('endCall', handleEndCall);
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
          flexDirection: 'row',
          right: 10,
          bottom: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            //paddingRight: 10,
            padding: 10,
          }}>
          <View
            style={{backgroundColor: '#333333', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={isSpeakerOn ? 'volume-off' : 'volume-high'}
              color="white"
              size={30}
              onPress={() => {
                toggleSpeaker();
              }}
            />
          </View>
          <View
            style={{backgroundColor: '#333333', borderRadius: 360, margin: 5}}>
            <IconButton
              padding={6}
              backgroundColor="white"
              icon={audioEnabled ? 'microphone' : 'microphone-off'}
              color="white"
              size={30}
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
              size={30}
              onPress={() => {
                EndCall();
              }}
            />
          </View>
        </View>
        <RTCView
          streamURL={myStream?.toURL()}
          objectFit={'cover'}
          style={{width: 120, height: 200}}
          volume={1.5}
          mirror={false} // Adjust this based on your requirements
          // audioOutput={'output-speaker'} // This controls the audio output
        />
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      {remoteStream && callOn && !callended ? (
        <View style={{flex: 1, backgroundColor: 'red'}}>
          <RTCView
            streamURL={remoteStream?.toURL()}
            objectFit={'cover'}
            style={{height: '100%'}}
            volume={1.5}
            mirror={false} // Adjust this based on your requirements
            // audioOutput={'output-speaker'} // This controls the audio output
          />
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
              source={{uri: getImageUrl(item.userphotoimageurl)}}
              style={styles.circularImg}
            /> 
            <Text style={{fontSize: 20, fontWeight: 'bold', color: '#FFF'}}>
              {prepareShortName('Test User')}
            </Text>
            <Text style={{fontSize: 16, color: '#FFF'}}>
              {!callOn && callended
                ? 'Call ended by ' + endedBy
                : 'Calling....'}
            </Text>
          </View>
          {LocalStreamView()}
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
});

export default VideoChatCall;