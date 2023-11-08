import React, {useState, useEffect, createRef, useRef,AppState} from 'react';
import { View } from 'react-native';
import ChatUserList from './src/Chat/ChatUserList';
import io from 'socket.io-client';
import { getEventEmitter } from './src/Utility/Utility';

const ChatApp = props => {
  var globalScoketConnection;
 const  {userCode,chatuserId,profileImage,profileName,pushData,genderId,appState,pageFocus } = props;
 //console.log(userCode,pushData,"userCode")
 //const appState = useRef(AppState.currentState);
      const [socket,setsocket]=useState(null);
      const eventEmitter = getEventEmitter()


   
      useEffect(() => {
          // This function will be called when the screen loses focus
          //setsocket(io("http://10.132.100.175:5001"));
        //setsocket(io("http://10.133.14.23:5001"));
          //const socketConnection = io("https://chatqa.abpweddings.com");
    //ws://10.132.100.191:8878
    //https://messegingserviceskt.abpweddings.com
     setSocketConnection();

    return () => {

      console.log("Chat-Deinit",globalScoketConnection)

      if(globalScoketConnection) {
        globalScoketConnection.disconnect();
      }
 

    }
       }, []);
       const setSocketConnection =()=>{
        const socketConnection = io('https://messegingserviceskt.abpweddings.com',{
          "force new connection" : true,
            "reconnectionAttempts": "Infinity", 
         "timeout" : 10000,                  
       "transports" : ["websocket"],
          withCredentials: true,
        extraHeaders: {
          "my-custom-header": "abcd"
        }
      });
       //console.log("socketConnection",socketConnection)
       socketConnection.on('connect', () => {
         console.log('Socket connected');
         //setsocketConneted(true);
  
       });
       setsocket(socketConnection);
       globalScoketConnection =socketConnection
       socketConnection.on('disconnect', () => {
        console.log('socket disconnected')
    });
      // eventEmitter.emit('SOCKET_DATA', socketConnection)
      
      }
     
       useEffect(() => {
        eventEmitter.addListener('REQUEST_FOCUS', (data) => {
          // Handle the emitted event
          console.log('Custom event received with data:', data);
          if(data==true){
            setSocketConnection()
  
           }
        });
        eventEmitter.addListener('REQUEST_BLUR', (data) => {
          const newData = data;
          if(newData==false){
            console.log('Custom event received with data Blur:', data);
            if(globalScoketConnection) {
              globalScoketConnection.disconnect();
            }
            
           
           }
        });
       },[])
     
      useEffect(()=>{
        if(socket!=null && chatuserId!=null ){
            console.log("add User")
           // socket.emit('ad-user',chatuserId)
        }
    },[chatuserId,socket]);
 
    useEffect(() => {
      
      if(socket!=null && appState=="background" || socket!=null && appState== "inactive" ){
        
        socket.disconnect()
      }
      // else if (appState == "active"){
      //   setSocketConnection();
      // }

     // 
    }, [appState]);

   


return(
    <View style={{flex:1}}>
        <ChatUserList
            socket={socket}
            userCode={userCode} 
            chatuserId={chatuserId} 
            profileImage={profileImage}
             profileName={profileName}
             pushData={pushData}
             genderId={genderId}
        />
    </View>
)
}

export default ChatApp