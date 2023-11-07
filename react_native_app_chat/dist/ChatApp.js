import React, {useState, useEffect, createRef, useRef,AppState} from 'react';
import { View } from 'react-native';
import ChatUserList from './src/Chat/ChatUserList';
import io from 'socket.io-client';
import { getEventEmitter } from '../../../src/Utility/Utility';
const ChatApp = props => {
  
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
       }, []);

       useEffect(() => {
        eventEmitter.addListener('REQUEST_FOCUS', (data) => {
          // Handle the emitted event
          console.log('Custom event received with data:', data);
          if(data==true){
            setSocketConnection()
  
           }
        });
        eventEmitter.addListener('REQUEST_BLUR', (data) => {
          if(data==false){
            //  alert("socket",socket)
            console.log("socket?????/",socket)
             if(socket!=null ){
              console.log("socket?????/",socket.disconnect())
           
              socket.disconnect()
            }
           }
        });
       },[])
      const setSocketConnection =()=>{
        const socketConnection = io('ws://10.132.100.191:8878',{
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
 
      }
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