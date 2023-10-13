import React, {useState, useEffect, createRef, useRef} from 'react';
import { View } from 'react-native';
import ChatUserList from './src/Chat/ChatUserList';
import io from 'socket.io-client';
const ChatApp = props => {
 const  {userCode,chatuserId,profileImage,profileName } = props;
 console.log(userCode,"userCode")
    
      const [socket,setsocket]=useState(null);
    useEffect(()=>{
        //setsocket(io("http://10.132.100.175:5001"));
        //setsocket(io("http://10.133.14.23:5001"));
          //const socketConnection = io("https://chatqa.abpweddings.com");
    
          const socketConnection = io('ws://10.133.14.23:8878',{
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
    
      },[]);
    
      useEffect(()=>{
        if(socket!=null && chatuserId!=null ){
            console.log("add User")
           // socket.emit('ad-user',chatuserId)
        }
    },[chatuserId,socket]);
return(
    <View style={{flex:1}}>
        <ChatUserList
            socket={socket}
            userCode={userCode} 
            chatuserId={chatuserId} 
            profileImage={profileImage}
             profileName={profileName}
        />
    </View>
)
}

export default ChatApp