import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  PermissionsAndroid,
  Permissions,
  Alert,
  Linking,
  Platform,
  Pressable,
  BackHandler,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { formatChatDateTime,formatTime,formatDate, getCreatedDate,showToast } from '../Utility/Utility';

import { ChatHeaderView } from './ChatHeaderView';
import { callApi } from '../../NW/APIManager';
import  { ServiceConstant } from '../../NW/ServiceAPI';
import EmojiSelector,{Categories} from 'react-native-emoji-selector'
import {useNetInfo} from "@react-native-community/netinfo";
import DATE from 'date-and-time';
import ModalScreen from '../Utility/Modal';
import ViewProfile from './ViewProfile';
import{Menu, MenuItem, MenuDivider}  from 'react-native-material-menu';
import DocumentPicker from "react-native-document-picker";
import { DefaultView } from '../Utility/DefaultView';
import { ScreenLoader } from '../Utility/ScreenLoader';
const ChatConversation = (props) => {

// const [socket,setsocket] = useState(props.socket)
const {socket,item,userCode,chatuserId} = props

const netInfo = useNetInfo();
const [userData,setUserData] = useState({
  userId:chatuserId
})
    const [data, setData] = React.useState(
       []);
        const [chatText, setChatText] = React.useState("");
        const [startIndex, setStartIndex] = React.useState(0);
        const [pageSize, setPageSize] = React.useState(20); 
        const [totalCount, setTotalCount] = React.useState(false);
        const [incomeMesage,setIncomeMesage]= React.useState(null);
       const [showEmoji,setShowEmoji] = React.useState(false);
       const [showModal,setShowModal] = useState(false)
       const [modalType,setModalType] = useState("");
       const [openViewProfile,setOpenViewProfile] = useState(false)
       const [openDocumentPickerMenu,setOpenDocumentPickerMenu] = useState(false)
       const [isLoadMore, setIsLoadMore] = React.useState(false);
       const [isLoading, setIsLoading] = React.useState(false);
       const [chatAsyncData, setChatAsyncData] = React.useState([])
      const [netConnected,setNetConnected] = React.useState(true);
       const inputRef = useRef();
       
        
        useEffect(() => {
          const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
              // Handle the back button press (e.g., navigate back or show a confirmation dialog)
              // Return true to indicate that we've handled the back button
              // Return false to let the default behavior (e.g., exit the app) happen
              // For example:
              // navigateBack(); // Implement your navigation logic
              props.goBack()
              return true;
            }
          );
      
          return () => {
            backHandler.remove(); // Unsubscribe from the event when the component is unmounted
          };
        }, []); 
        useEffect( ()=>{
          
          if( netInfo.isConnected ){
            chatHistory() 
           }
           else if(netInfo.isConnected  == false){
            showToast("Please check your Internet Connection");
           
               
            
           }
         // setLocalandRemoteData()
          
      },[chatuserId,netInfo.isConnected ]);

      
      useEffect( ()=>{
        if(item.unreadcount > 0){
          updateUnreadCount()
        }
        
      },[])
      const updateUnreadCount = async ()=>{
        let obj1= {
          "userid":chatuserId,
          "mappeduserid":item.mappedUserid,
          
        }
        const response =  await callApi(ServiceConstant.UPDATE_UNREAD_CHAT, obj1);
      
      }

     const setLocalandRemoteData= async () =>{
        const value = await AsyncStorage.getItem("chatData")
        const parsedValue = JSON.parse(value);
       // console.log("Parsed result", parsedValue);
      setChatAsyncData(parsedValue)


         for(let i = 0;i< parsedValue.length;i++){
           if(parsedValue[i].mappedUserid == item.mappedUserid){
            if(parsedValue[i].userChatHistory.length > 0){
             
            //  if(netInfo.isConnected != null && netInfo.isConnected == false ){

            //   setData(parsedValue[i].userChatHistory)
            //  }
             // setData(parsedValue[i].userChatHistory)
       //chatHistory(parsedValue,i,parsedValue[i].userChatHistory,parsedValue[i].userChatHistory[0].createdon) 
       if( netInfo.isConnected ){
        chatHistory(parsedValue,i,) 
       }
       else if(netInfo.isConnected  == false){
        showToast("Please check your Internet Connection");
        const tempData = parsedValue[i].userChatHistory;
        const processedMessages = tempData.map((message, index) => {
        
          let showDate = false;
  
          if (index === 0) {
            // For the first message, set showDate to true
           // showDate = true;
          } else {
            const currentDate = new Date(message.createdon).toDateString();
            const nextMessage = tempData[index + 1];
            
            // If there is a next message and its date is different, set showDate to true
            if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
              showDate = true;
            }
          }
        
          // Set showDate to true for the last item in the list
          if (index === tempData.length - 1) {
            showDate = true;
          }
       
          // const showDate =
          //   index === 0 ||
          //   new Date(message.createdon).toDateString() !==
          //     new Date(list[index - 1].createdon).toDateString();
           return { ...message, showDate };
        });
           
        
            setData(processedMessages);
       // setData(parsedValue[i].userChatHistory)
       }
       

            }else{

              if(netInfo.isConnected ){
                if(props.item!=null && item.mappedUserid!=null && userData!=null){
                  chatHistory(parsedValue,i, )  
                }
              }
              else if(netInfo.isConnected  == false){
                showToast("Please check your Internet Connection");
                const tempData = parsedValue[i].userChatHistory;
                const processedMessages = tempData.map((message, index) => {
                
                  let showDate = false;
          
                  if (index === 0) {
                    // For the first message, set showDate to true
                   // showDate = true;
                  } else {
                    const currentDate = new Date(message.createdon).toDateString();
                    const nextMessage = tempData[index + 1];
                    
                    // If there is a next message and its date is different, set showDate to true
                    if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
                      showDate = true;
                    }
                  }
                
                  // Set showDate to true for the last item in the list
                  if (index === tempData.length - 1) {
                    showDate = true;
                  }
               
                  // const showDate =
                  //   index === 0 ||
                  //   new Date(message.createdon).toDateString() !==
                  //     new Date(list[index - 1].createdon).toDateString();
                   return { ...message, showDate };
                });
                   
                
                    setData(processedMessages);
               // setData(parsedValue[i].userChatHistory)
               }
             
            }
           }
         }
        
     }
  //const chatHistory = async (chatData,index,chathistoryData,timeStamp)=>{
    //const chatHistory = async (chatData,index)=>{
      const chatHistory = async ()=>{
    try {
    
      setIsLoading(true)
    let obj1= {
      "userid":chatuserId,
      "mappeduserid":item.mappedUserid,
      "timestamp":"0", //chathistoryData.length == 0?"0":timeStamp.toString(), 
      "start":startIndex,
      "end":pageSize
    }

    const response =  await callApi(ServiceConstant.FETCH_CHAT_HISTORY, obj1);
    console.log("response chat history",JSON.stringify(response))
  if(response.status != 0){
    const list = response.chathistory.chatlist
    


    // if( startIndex == 0){
    //   console.log("in if start")
    //         const tempData = chatData;
    //       tempData[index].userChatHistory = list;
    //       await AsyncStorage.setItem("chatData", JSON.stringify(tempData));

    // }
    
    if(startIndex > 0){
      console.log("in startIndex")
      const sortedMsg = [...data,...list] //sortMessages([...data, ...unqueData])
      const processedMessages = sortedMsg.map((message, index) => {
        
        let showDate = false;

        if (index === 0) {
          // For the first message, set showDate to true
         // showDate = true;
        } else {
          const currentDate = new Date(message.createdon).toDateString();
          const nextMessage = sortedMsg[index + 1];
          
          // If there is a next message and its date is different, set showDate to true
          if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
            showDate = true;
          }
        }
      
        // Set showDate to true for the last item in the list
        if (index === sortedMsg.length - 1) {
          showDate = true;
        }
     
        // const showDate =
        //   index === 0 ||
        //   new Date(message.createdon).toDateString() !==
        //     new Date(list[index - 1].createdon).toDateString();
         return { ...message, showDate };
      });
         
      
          setData(processedMessages);

    }
    else{
         const processedMessages = list.map((message, index) => {
        
        let showDate = false;

        if (index === 0) {
          // For the first message, set showDate to true
         // showDate = true;
        } else {
          const currentDate = new Date(message.createdon).toDateString();
          const nextMessage = list[index + 1];
          
          // If there is a next message and its date is different, set showDate to true
          if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
            showDate = true;
          }
        }
      
        // Set showDate to true for the last item in the list
        if (index === list.length - 1) {
          showDate = true;
        }
     
        // const showDate =
        //   index === 0 ||
        //   new Date(message.createdon).toDateString() !==
        //     new Date(list[index - 1].createdon).toDateString();
         return { ...message, showDate };
      });
         
      
          setData(processedMessages);

    }


    
    // if(chathistoryData.length== 0){
    //   if(chathistoryData.length > 0){
      
    //   const processedMessages = list.map((message, index) => {
        
    //     let showDate = false;

    //     if (index === 0) {
    //       // For the first message, set showDate to true
    //      // showDate = true;
    //     } else {
    //       const currentDate = new Date(message.createdon).toDateString();
    //       const nextMessage = list[index + 1];
          
    //       // If there is a next message and its date is different, set showDate to true
    //       if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
    //         showDate = true;
    //       }
    //     }
      
    //     // Set showDate to true for the last item in the list
    //     if (index === list.length - 1) {
    //       showDate = true;
    //     }
     
    //     // const showDate =
    //     //   index === 0 ||
    //     //   new Date(message.createdon).toDateString() !==
    //     //     new Date(list[index - 1].createdon).toDateString();
    //      return { ...message, showDate };
    //   });
         
      
    //       setData(processedMessages);

    //       const tempData = chatData;
    //       tempData[index].userChatHistory = list;
    //       await AsyncStorage.setItem("chatData", JSON.stringify(tempData));

    // }
    // else{

      
    //   const mergedArray = list.concat(chathistoryData);
    //   const processedMessages = mergedArray.map((message, index) => {
        
    //     let showDate = false;

    //     if (index === 0) {
    //       // For the first message, set showDate to true
    //      // showDate = true;
    //     } else {
    //       const currentDate = new Date(message.createdon).toDateString();
    //       const nextMessage = mergedArray[index + 1];
          
    //       // If there is a next message and its date is different, set showDate to true
    //       if (nextMessage && currentDate !== new Date(nextMessage.createdon).toDateString()) {
    //         showDate = true;
    //       }
    //     }
      
    //     // Set showDate to true for the last item in the list
    //     if (index === mergedArray.length - 1) {
    //       showDate = true;
    //     }
     
        
    //      return { ...message, showDate };
    //   });
    //  // setData(processedMessages)
    //   const tempData = chatData;
    //   tempData[index].userChatHistory = mergedArray;
    //  // console.log("tempData",JSON.stringify(tempData));
    // //  await AsyncStorage.setItem("chatData", JSON.stringify(tempData));

    // }
  }

  if(response.status == 0 && response.chathistory.chatlist == null){
    //setTotalCount(startIndex+10)
    setTotalCount(true)
  }

  

  setIsLoading(false)
  setIsLoadMore(false)
      
    } catch (error) {
      console.log("error Chat history",error)
      setIsLoading(false)
         setIsLoadMore(false)
    }
   
  }

  useEffect( () => {

    if(!isLoadMore) {
     
      return
    }

    (async () => {
     // await setLocalandRemoteData() 
    await chatHistory()
    })()

  }, [isLoadMore]);
  useEffect(()=> {
    if(socket!=null && socket!=''){
     
      
        socket.on(userCode, (msg) => {
         
        setIncomeMesage(msg);
            })
        
    }
    
   }, [socket])

   useEffect( () => {
    if(incomeMesage == null) return

    onMessageReceived(incomeMesage, data)

    setIncomeMesage(null)

  }, [incomeMesage]);

  const onMessageReceived = (msg, messages) => {

     console.log('MESSAGE:' + JSON.stringify(msg))
     console.log('MESSAGE:' + JSON.stringify(msg.createdon))
     console.log('MESSAGE:' +userCode)
     
     if(msg == null) return

     try {

      
      let arr3={}
      let value = true;
      const lastMsgDate= data.length == 0?new Date() :new Date(data[0].createdon);
      const formateDate = DATE.format(lastMsgDate, 'DD/MM/YYYY')
      const currentDate = new Date();
      const formateCurrentDate = DATE.format(currentDate, 'DD/MM/YYYY')
      
      if(data.length == 0 ){
        value = true
      }
      else if (formateDate === formateCurrentDate) {
        value = false;
      }
        //     if(userCode==msg.senderName){
        //       const date =parseInt(msg.createdon)
        //         arr3={
                    
        //             senderName: msg.senderName,
        //             targetUserName: msg.targetUserName,
        //             message:msg.message,
        //             createdon:date, //getCreatedDate(),
        //             "showDate":value,
        //         }
               
        // setData(addAfter(messages, 0, arr3))
               
        //     }
        //     else 
            
            if(item.mappedUserCode==msg.senderName ){
              const date =parseInt(msg.createdon)
                arr3={
                    
                    senderName: msg.senderName,
                    targetUserName: msg.targetUserName,
                    message:msg.message,
                   createdon:date, //formatTime(msg.createdon),//getCreatedDate(),
                   "showDate":value,
                }
                setData(addAfter(messages, 0, arr3))
               
            }
          
     } 
     catch(e) {

      console.log(e)
    }
 
  }
        const onChangeText = (text) => {
 
        setChatText(text)
            }

      
        const _handleLoadMore = async () => {
          try {
            if(netInfo.isConnected == null || netInfo.isConnected ){
             
             if (totalCount  || incomeMesage != null) {
             
              return;
            }
           
           setStartIndex(startIndex+20)
           setIsLoadMore(true)
          }
          else{
            
          }
            
            //setPageSize(40)
          } catch (error) {
            console.log("handle more error",error)
          }

            
          
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
                  handleCallVideo();
                  console.log('All permissions granted');
                  // You can now use the requested features that require these permissions
                } else {
                  console.log('One or more permissions denied');
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
                            Linking.openSettings();
                          
                        },
                      },
                    ],
                
                    {
                      cancelable: true,
                    },
                  );
                  // Handle the case where one or more permissions were denied
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
                  handleCallVideo();
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
                 
                  //showToast("Please allow the camera and microphone permissions from settings to access the video call")
    
                  console.log('Camera permission is not granted.');
                }
              } catch (err) {
                console.warn(err);
              }
              
            }
    
           
          }

          const handleCallVideo =()=>{

            let roomNo =generateUniqueNumber();
              //  props.navigation.navigate("VideoChatCall",
              //  {roomno: item.mappedUserid,rooms :roomNo,
              //  audio:true,video:true,
              //  callinitiateByothers:"own",
              //  item:props.item
              //  }
              //  )
            }
            const generateUniqueNumber=()=> {      
                const timestamp = new Date().getTime(); // Get current timestamp in milliseconds  
                const randomDigits = Math.floor(Math.random() * 100000000000); // Generate 11 random digits   
                   
             return randomDigits;   
            }

            const sendAction = async () => {
              if(chatText == "") {
          
                return
              }
          
              // if(chatText.length > 77) {
          
              //   showToast(t("txt_chat_char_range"))
          
              //   return
              // }
          
             
              
              
                didSendMessage(chatText)
           
            // logAnalyticsEvent()
          
           } 
           const didSendMessage = async (chatText) => {
           
let value = true;

const lastMsgDate= data.length == 0?new Date() :new Date(data[0].createdon);
const formateDate = DATE.format(lastMsgDate, 'DD/MM/YYYY')
const currentDate = new Date();
const formateCurrentDate = DATE.format(currentDate, 'DD/MM/YYYY')



if(data.length == 0 ){
  value = true
}
else if (formateDate === formateCurrentDate) {
  value = false;
}

            const message ={
              
              senderName: userCode,
              targetUserName: item.mappedUserCode,
              "message":chatText,
              
              "createdon":  getCreatedDate(),
              "modifyon":  getCreatedDate(),
              "showDate":value,
              "isreadmsg": netInfo.isConnected ? "send":"pending"
          }
           
           setData(addAfter(data, 0, message))
            let arr={
              senderName: userCode,
 targetUserName: item.mappedUserCode,
 message: chatText,
 "createdon":  getCreatedDate(),
 "modifyon":  getCreatedDate(),
 type:'txt'
          }
         
            socket.emit("messageSendToUser",arr);
          let arr1= {
            "userid":chatuserId,
            "mappeduserid":item.mappedUserid,
            "message":chatText
          }
           setChatText("")
          //  const response =  await callApi(ServiceConstant.FETCH_SEND_CHAT, arr1);
          // console.log("response chat history",response)
          }

          function addAfter(array, index, newItem) {
            return [
                ...array.slice(0, index),
                newItem,
                ...array.slice(index)
            ];
            }

            const onMenuPress =(type)=>{
              if(type=="block"){
                setShowModal(true);
                setModalType(type);
              }
              else if(type == "report"){
                setShowModal(true);
                setModalType(type+" abuse");
              }
              else if(type == "mute"){
                setShowModal(true);
                setModalType(type);
              }

            }


              const renderRowItem = ({ item, index }) => {
          
                  // https://www.freecodecamp.org/news/design-imessage-like-chat-bubble-react-native/
          
        //const alignment = 2713882  == item.creatorId ? "left" : "right"; //props.route.params.targetUserId == item.creatorId ? "left" : "right"
        
        const alignment = item.senderName  ==userCode ? "right" : "left"; 
  
                const dateVal = () => {
                  return formatTime(item.createdon)
                 
                } 
                 
                return (
                  <View>
                     {item.showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.createdon)}</Text>
          </View>
        )}
              
                    <View style={alignment == "right" ?  styles.rightView : styles.leftView}>
                   
                      <Text style={{ fontSize: 14, color: "black", }} key={index}>{item.message}</Text>
                      <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                      <Text style={{ fontSize:10, color: "black", textAlign:"right"}}> {dateVal()}  </Text>
                      
                      {item.isreadmsg=="send"&& alignment == "right" &&
                      <Image
        style={{height:10,width:10,marginLeft:6,marginTop:2}}
       source={require('../icons/send_tick.png')} resizeMode="contain" /> 
                      }
                      {item.isreadmsg=="received"&& alignment == "right" && 
                      <Image
        style={{height:15,width:15,marginLeft:6,}}
       source={require('../icons/received_tick.png')} resizeMode="contain" /> 
                      } 
                      {item.isreadmsg=="read"&& alignment == "right" && 
                      <Image
        style={{height:15,width:15,marginLeft:6,}}
       source={require('../icons/seen_tick.png')} resizeMode="contain" /> 
                      } 
                      {item.isreadmsg=="pending"&& alignment == "right" && 
                      <Image
        style={{height:15,width:15,marginLeft:6,}}
       source={require('../icons/time_left.png')} resizeMode="contain" /> 
                      } 
                      </View>
                    </View> 
                  
                    
                    </View>
          
                );
                 
                }
          
                const chatInputView=()=>{
                  return(
                    <View>
                      

                    <View style={styles.inputMainView}>
                    <View style={[styles.inputInnerView,{}]}>
                    <TouchableOpacity style={{paddingLeft:5}} onPress={()=>{ 
                      const emoji = showEmoji
                      setShowEmoji(!showEmoji)
                      
                      if(emoji){
                        inputRef.current.focus() 
                      }
                      else{
                        Keyboard.dismiss()
                      }
                     
                    }}>
                    <Image
        style={{height:25,width:25,marginRight:10}}
       source={showEmoji?require('../icons/keyboard.png') :require('../icons/smile.png')} resizeMode="contain" /> 
                    </TouchableOpacity>       
                          

                              <TextInput 
                              ref={inputRef}
                              style={styles.mTextfield}
                              value={chatText}
                              
                              minHeight={50}  // Set the minimum height
                              maxHeight={100}  // Set the maximum height
                             // maxLength={78} 
                              multiline={true}
                              autoCapitalize="none"
                              autoCorrect={false}
                              placeholder={"Start Conversation"}
                              keyboardType='default'
                              clearButtonMode='always' 
                              onChangeText={(text)=>{
                                onChangeText(text)
                              }}
                              onFocus={()=>{
                                setShowEmoji(false)
                              }}
                              /> 

                    {/* {documentMenu()} */}
                              </View>
                              
                              <TouchableOpacity disabled={(chatText == null || chatText == "")} 
                            //style={styles.sendMainView}
                            style={{alignItems:"center",justifyContent:"center",paddingLeft:4}}
                             onPress={()=>{sendAction()}}>
                             
                             <Image
        style={{height:40,width:40,}}
       source={require('../icons/send.png')} resizeMode="contain" /> 
                            </TouchableOpacity> 

                            
                                    </View>
                                   {showEmoji && <View style={{height:250}}>
                                   {/* <TouchableOpacity  style={{backgroundColor:"red",width:35, height:30,alignSelf:"flex-end",justifyContent:"center",alignItems:"center",}}
                                  onPress={()=>{
                                    
                                   // setChatText( chatText.slice(0, -1));
 }}
 >
                                   <Text>{"⌫"}</Text>
                                   </TouchableOpacity>           */}
<EmojiSelector
showTabs={false} 
showSearchBar={false}
columns={10}
onEmojiSelected={emoji => {setChatText((prevText) => prevText+emoji);
  
}}
  category={Categories.emotion}
 />
 
 
  
</View>}

                                    </View>

                  )
                }


const documentMenu=()=>{
  return(
    <View>
       <Menu
            visible={openDocumentPickerMenu}
            anchor={
              <Pressable onPress={() => {setOpenDocumentPickerMenu(true)}}>
              <Image
        style={{height:25,width:25,marginRight:10}}
       source={require('../icons/smile.png')} resizeMode="contain" /> 
                 </Pressable>
            }
            onRequestClose={() => {setOpenDocumentPickerMenu(false)}}
          style={{width:"80%",
    marginTop: -20, }}
            
            >
          <MenuItem onPress={() => {
             
             }}>
                <View style={{ flexDirection:"row", alignItems: 'center', marginRight:10 }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/block_user.png')}
  style={{ width: 20, height: 20, marginRight: 10  }}
/>
<Text style={{color:"black",  }}> {"Gallery"}</Text>
     </View>
    
            </MenuItem>
             <MenuItem onPress={() => {
               
             }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/report_abuse.png')}
  style={{ width: 20, height: 20, marginRight: 10 }}
/>
<Text style={{color:"black",  }}> {"Camera"}</Text>
     </View>
    
            </MenuItem> 
            <MenuItem 
            onPress={()=>{
               }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
              <Image
              resizeMode="contain"
          source={require('../icons/mute.png')}
          style={{ width: 20, height: 20, marginRight: 10}}
        />
        <Text style={{color:"black", }}> {"Document"}</Text>
             </View>
            </MenuItem>
          </Menu>
 
    </View>
  )

}
    return(
        <View style={styles.container}>
         {!openViewProfile ? 
        <View style={{flex:1}}> 
            <ChatHeaderView 
             item={props.item}
             onSelectProfile={(item,index)=>{
              // setOpenViewProfile(true);
             }}
              showLastMessage={false}
              onGoback={(e)=> props.goBack()}
            onMenuPress={(e)=> onMenuPress(e)}
            onAudioPress={(e)=> console.log(e)}
       onVideoPress={(e)=>{
        
        checkPermissions()
         }
        
       }
           /> 



            <FlatList style={{marginVertical:8}}
            
        inverted={true}
        data = {data}
        // keyExtractor={(item, index) => (item.creatorId + item.messageId)}
        renderItem={renderRowItem}
        windowSize={30}
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.1}
       // ListFooterComponent={isLoadMore ? <ActivityIndicator  animating={true} size="large" color="blue" /> : null}
    
        />

      {chatInputView()}
      


      {isLoading && (
        <ScreenLoader loading={isLoading} topMargin={0} text={"Loading.."} />
       )}
       </View>

 :
  <ViewProfile

goBack={(e)=> {setOpenViewProfile(false)}}
item={item}
/>
    }
      <ModalScreen
        text1={modalType}
        loading={showModal}
        onDismiss={()=>{
          setShowModal(false)
          setModalType("")
        }}
        image={props.item.userphotoimageurl}
        onMenuPress={(type)=>{
          alert(type);
        }}
      />
       
  

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingTop: Platform.OS == 'ios' ? StatusBar.currentHeight : 0,
      },
    leftView: {
        backgroundColor: "#FFF",
        paddingVertical:8,
        paddingHorizontal:8,
        marginTop: 8,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        borderTopRightRadius:10,
      //  borderRadius:4,
        marginLeft: "5%",
        maxWidth: '75%',
        alignSelf: 'flex-start',
      },
  
  
      rightView: {
        backgroundColor: "#E3F9FE",
        paddingVertical:8,
        paddingHorizontal:8,
        marginLeft: '20%',
        marginTop: 8,
        marginRight: "5%",
        maxWidth: '75%',
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
        borderTopLeftRadius:10,
        alignSelf: 'flex-end',
      },
      mTextfield: {
        backgroundColor: 'white',
        color: '#650202',
        borderRadius:25,
        flex:1,
       
       
      },
      inputMainView:{flexDirection:'row', justifyContent:'space-between', alignContent:'center',paddingVertical:10,paddingHorizontal:12},
      inputInnerView:{flexDirection:"row",backgroundColor:"white", alignItems:"center",borderWidth:1,borderRadius:20,borderColor:"#717171",flex:1},
      sendMainView:{height:45,width:45, backgroundColor:"#DB233D",alignItems:"center",justifyContent:"center",borderRadius:360,paddingLeft:4},
      dateContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
      },
})

export default ChatConversation