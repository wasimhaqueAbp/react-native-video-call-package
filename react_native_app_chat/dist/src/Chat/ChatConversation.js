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
  BackHandler
} from 'react-native';
import { formatChatDateTime,formatTime,formatDate, getCreatedDate } from '../Utility/Utility';
import { ChatHeaderView } from './ChatHeaderView';
import { callApi } from '../../NW/APIManager';
import  { ServiceConstant } from '../../NW/ServiceAPI';
import EmojiSelector,{Categories} from 'react-native-emoji-selector'
import {useNetInfo} from "@react-native-community/netinfo";
import DATE from 'date-and-time';
import ModalScreen from '../Utility/Modal';
import ViewProfile from './ViewProfile';
const ChatConversation = (props) => {
//console.log("props",props)
// const [socket,setsocket] = useState(props.socket)
const {socket,item,userCode} = props
console.log("props",item)
const netInfo = useNetInfo();
const [userData,setUserData] = useState({
  userId:2713882
})
    const [data, setData] = React.useState(
       []);
        const [chatText, setChatText] = React.useState("");
        const [startIndex, setStartIndex] = React.useState(0);
        const [totalCount, setTotalCount] = React.useState(0);
        const [incomeMesage,setIncomeMesage]= React.useState(null);
       const [showEmoji,setShowEmoji] = React.useState(false);
       const [showModal,setShowModal] = useState(false)
       const [modalType,setModalType] = useState("");
       const [openViewProfile,setOpenViewProfile] = useState(false)
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
          
          if(props.item!=null && item.mappedUserid!=null && userData!=null){
            chatHistory() 
          }
      },[props.item,userData]);
  const chatHistory = async ()=>{
    try {
    //   let obj1={
    //     from:userData.userId,
    //     to:item.mappedUserid,
    // }
    let obj1= {
      "userid":userCode,
      "mappeduserid":item.mappedUserid
    }
    const response =  await callApi(ServiceConstant.FETCH_CHAT_HISTORY, obj1);
    console.log("response chat history",response)
  if(response.status != 0){
    const processedMessages = response.map((message, index) => {
      const showDate =
        index === 0 ||
        new Date(message.createdon).toDateString() !==
          new Date(response[index - 1].createdon).toDateString();
      return { ...message, showDate };
    });
    console.log("processedMessages",processedMessages)
    const reversedArray = processedMessages.reverse();
       // const reversedArray = response.reverse();
    
        setData(reversedArray)
      // setData(processedMessages)
      
  }

  
      
    } catch (error) {
      console.log("error Chat history",error)
    }
   
  }
  useEffect(()=> {
    if(socket!=null && socket!=''){
     
      
        socket.on(userCode, (msg) => {
        console.log("msg",msg);
      //  onMessageReceived(msg, data)
       
        setIncomeMesage(msg);
            })
        
    }
    
   }, [socket])

   useEffect( () => {
console.log("incomeMesage",incomeMesage)
    if(incomeMesage == null) return

    onMessageReceived(incomeMesage, data)

    setIncomeMesage(null)

  }, [incomeMesage]);

  const onMessageReceived = (msg, messages) => {

    // console.log('MESSAGE:' + JSON.stringify(message))

     if(msg == null) return

     try {


      let arr3={}
      let value = true;
      const lastMsgDate= data.length == 0?new Date() :new Date(data[0].createdon);
      const formateDate = DATE.format(lastMsgDate, 'DD/MM/YYYY')
      const currentDate = new Date();
      const formateCurrentDate = DATE.format(currentDate, 'DD/MM/YYYY')
      
      
      
      //console.log(formateDate)
      //console.log(formateCurrentDate)
      if(data.length == 0 ){
        value = true
      }
      else if (formateDate === formateCurrentDate) {
        value = false;
      }
            if(userCode==msg.senderName){
              
       
                arr3={
                    fromSelf:true,
                    message:{
                        test:msg.message
                    },
                    createdon:  getCreatedDate(),
                    "showDate":value,
                }
               // arrData.push(arr3);
             //   setData(arrData)
        setData(addAfter(messages, 0, arr3))
               
            }
            else if(item.mappedUserCode==msg.senderName || userCode==msg.targetUserName){
                arr3={
                    fromSelf:false,
                    message:{
                        test:msg.message
                    },
                   createdon:  getCreatedDate(),
                   "showDate":value,
                }
               // arrData.push(arr3);
                //setData(arrData)
                setData(addAfter(messages, 0, arr3))
               
            }
          
     } 
     catch(e) {

      console.log(e)
    }
 
  }
        const onChangeText = (text) => {

            //  //console.log(text)
            
        setChatText(text)
        
            }

      
        const _handleLoadMore = async () => {

            if (startIndex >= totalCount || incomeMesage != null) {
          
              return;
            }
          
           //setStartIndex(startIndex+40)
           //setIsLoadMore(true)
            //setPageSize(40)
          
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
              console.log("ksk")
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
           // console.log("chatText",data);
           // const reverseData =data.reverse()
            // const processedMessages = data.map((message, index) => {
            //   const showDate =
            //     index === 0 ||
            //     new Date(message.createdon).toDateString() !==
            //       new Date(data[index - 1].createdon).toDateString();
            //   return showDate ;
            // });
            // console.log("processedMessages",processedMessages)
//             const lastProcessedMessageValue = revData[revData.length - 1];
// console.log('Last Processed Message Value:', lastProcessedMessageValue);
let value = true;

const lastMsgDate= data.length == 0?new Date() :new Date(data[0].createdon);
const formateDate = DATE.format(lastMsgDate, 'DD/MM/YYYY')
const currentDate = new Date();
const formateCurrentDate = DATE.format(currentDate, 'DD/MM/YYYY')



//console.log(formateDate )
//console.log(formateCurrentDate)
if(data.length == 0 ){
  value = true
}
else if (formateDate === formateCurrentDate) {
  value = false;
}
//console.log('Value:', value);
            const message ={
              "fromSelf": true,
              "message": {
                  "test":chatText
              },
              "createdon":  getCreatedDate(),
              "showDate":value,
              "readId": netInfo.isConnected ? "send":"pending"
          }
           
           setData(addAfter(data, 0, message))
            let arr={
              senderName: userCode,
 targetUserName: item.mappedUserCode,
 message: chatText,
 type:'text'
          }
          console.log("socket",socket)
            socket.emit("messageSendToUser",arr);

           setChatText("")
          // const response =  await callApi(ServiceConstant.FETCH_SEND_CHAT, arr);
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
        
        const alignment = item.fromSelf  ==false ? "left" : "right"; 
  
                const dateVal = () => {
                  console.log("item.createdon",item)
                  console.log("item.createdon",item.createdon)
                  return formatTime(item.createdon)
                 // return formatChatDateTime(item.createdon)
          
                } 
                 
                return (
                  <View>
                     {item.showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.createdon)}</Text>
          </View>
        )}
              
                    <View style={alignment == "right" ?  styles.rightView : styles.leftView}>
                   
                      <Text style={{ fontSize: 14, color: "black", }} key={index}>{item.message.test}</Text>
                      <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                      <Text style={{ fontSize:10, color: "black", textAlign:"right"}}> {dateVal()}  </Text>
                      
                      {item.readId=="send"&& alignment == "right" &&
                      <Image
        style={{height:10,width:10,marginLeft:6,marginTop:2}}
       source={require('../icons/send_tick.png')} resizeMode="contain" /> 
                      }
                      {item.readId=="received"&& alignment == "right" && 
                      <Image
        style={{height:15,width:15,marginLeft:6,}}
       source={require('../icons/received_tick.png')} resizeMode="contain" /> 
                      } 
                      {item.readId=="read"&& alignment == "right" && 
                      <Image
        style={{height:15,width:15,marginLeft:6,}}
       source={require('../icons/seen_tick.png')} resizeMode="contain" /> 
                      } 
                      {item.readId=="pending"&& alignment == "right" && 
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
                    <View style={styles.inputInnerView}>
                    <TouchableOpacity style={{paddingLeft:5}} onPress={()=>{ 
                     // console.log(showEmoji)
                      const emoji = showEmoji
                      console.log(emoji)
                      setShowEmoji(!showEmoji)
                      
                     // Keyboard.dismiss()
                      if(emoji){
                        inputRef.current.focus() 
                      }
                      else{
                        Keyboard.dismiss()
                      }
                      
                     //inputRef.current.focus()
                    }}>
                    {/* <RNVectorIcon group='MaterialCommunityIcons' name="emoticon-happy-outline" size={30} color={"gray"} /> */}
                    <Image
        style={{height:25,width:25,marginRight:10}}
       source={showEmoji?require('../icons/mute.png') :require('../icons/smile.png')} resizeMode="contain" /> 
                    </TouchableOpacity>       
                              <TextInput 
                              ref={inputRef}
                              style={styles.mTextfield}
                              value={chatText}
                              maxLength={78} 
                              multiline={true}
                              autoCapitalize="none"
                              autoCorrect={false}
                              // placeholder="Type here ..."
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
                              </View>
                              
                             <TouchableOpacity disabled={(chatText == null || chatText == "")} 
                            //style={styles.sendMainView}
                            style={{alignItems:"center",justifyContent:"center",paddingLeft:4}}
                             onPress={()=>{sendAction()}}>
                             {/* <RNVectorIcon group='MaterialCommunityIcons' name="send" size={25} color={"white"} /> */}
                             <Image
        style={{height:40,width:40,marginRight:10}}
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



    return(
        <View style={styles.container}>
        {!openViewProfile ?
        <View style={{flex:1}}>
            <ChatHeaderView 
             item={props.item}
             onSelectProfile={(item,index)=>{
               setOpenViewProfile(true);
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
        onEndReachedThreshold={0.5}
        />

      {chatInputView()}
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
        width: "84%",
        marginLeft: 8,
        borderRadius:25
        
      },
      inputMainView:{flexDirection:'row', justifyContent:'space-between', alignContent:'center',paddingVertical:10,paddingHorizontal:12},
      inputInnerView:{flexDirection:"row",backgroundColor:"white", alignItems:"center",borderWidth:1,borderRadius:20,borderColor:"#717171",width:"85%"},
      sendMainView:{height:45,width:45, backgroundColor:"#DB233D",alignItems:"center",justifyContent:"center",borderRadius:360,paddingLeft:4},
      dateContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
      },
})

export default ChatConversation