import React, {useState, useEffect, createRef, useRef} from 'react';
import { View } from 'react-native';
import ChatUserList from './Chat/ChatUserList';
import io from 'socket.io-client';
const ChatApp = props => {

    const [userData,setUserData] = useState({
        userId:2713882
      })
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
        if(socket!=null && userData!=null ){
            console.log("add User")
           // socket.emit('ad-user',userData.userId)
        }
    },[userData,socket]);
return(
    <View style={{flex:1}}>
        <ChatUserList
            socket={socket}
            

        />
    </View>
)
}

export default ChatApp