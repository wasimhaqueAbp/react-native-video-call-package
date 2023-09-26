import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React, {useEffect, useState } from 'react';
import ChatUserList from './Chat/ChatUserList'
import ChatConversation from './Chat/ChatConversation'
const Stack = createNativeStackNavigator();

 const ChatScreen = (props) => {
     console.log("in App Screen",props)
     const headerStyle = {
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        
        headerBackTitleVisible: false,
        
      };
     return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Home"  headerMode="none" screenOptions={headerStyle}>
            <Stack.Screen name="Home" component={ChatUserList}
             options={{
            headerShown: false,
            title: '',
          }} 
          initialParams={{props:props}}
         // initialParams={{props:props,sockets: socket,registerUserToSocket_:registerUserToSocket,socketConneted:socketConneted}}
          />
            <Stack.Screen name="ChatConversation" component={ChatConversation} 
              options={{
            headerShown: false,
            title: '',
          }} 
          initialParams={{props:props}}
         // initialParams={{props:props,sockets: socket,registerUserToSocket_:registerUserToSocket,socketConneted:socketConneted}}
            />
             
          </Stack.Navigator>
        </NavigationContainer>
      );  
}

export default ChatScreen;