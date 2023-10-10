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
const ChatConversation = (props,item) => {
//console.log("props",props)
// const [socket,setsocket] = useState(props.socket)
const {socket} = props
const netInfo = useNetInfo();
const [userData,setUserData] = useState({
  userId:2713882
})
    const [data, setData] = React.useState(
       [
        {
          "created_at": "2023-10-06T09:51:47.187Z",
          "fromSelf": true,
          "message": {
              "test": "reply me"
          },
          "showDate": false,
          readId:"pending"
      },{
        "created_at": "2023-10-06T09:51:47.187Z",
        "fromSelf": true,
        "message": {
            "test": "where r u?"
        },
        "showDate": false,
        readId:"send"
    },
        {
          "created_at": "2023-10-06T09:51:47.187Z",
          "fromSelf": true,
          "message": {
              "test": "good"
          },
          "showDate": false,
          readId:"received"
      },
        {
          "created_at": "2023-10-06T09:51:47.187Z",
          "fromSelf": true,
          "message": {
              "test": "i am fine"
          },
          "showDate": false,
          readId:"read"
      },
       
      {
          "created_at": "2023-10-06T09:51:47.187Z",
          "fromSelf": false,
          "message": {
              "test": "i am fine"
          },
          "showDate": true,
          readId:"send"
      },
      {
        "created_at": "2023-10-05T08:43:41.898Z",
        "fromSelf": true,
        "message": {
            "test": "hi"
        },
        "showDate": false,
        readId:"received"
    },
    {
        "created_at": "2023-10-05T09:48:50.026Z",
        "fromSelf": false,
        "message": {
            "test": "hi"
        },
        "showDate": false,
        readId:"read"
    },
    {
        "created_at": "2023-10-05T09:51:40.567Z",
        "fromSelf": true,
        "message": {
            "test": "how r u?"
        },
        "showDate": true,
        readId:"read"
    },
      {
        "created_at": "2023-09-26T08:43:41.898Z",
        "fromSelf": true,
        "message": {
            "test": "hi"
        },
        "showDate": false,
        readId:"read"
    },
    {
        "created_at": "2023-09-26T09:48:50.026Z",
        "fromSelf": false,
        "message": {
            "test": "hi"
        },
        "showDate": false,
        readId:"read"
    },
    {
        "created_at": "2023-09-26T09:51:40.567Z",
        "fromSelf": true,
        "message": {
            "test": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        "showDate": false,
        readId:"read"
    },
    {
        "created_at": "2023-09-26T09:51:47.187Z",
        "fromSelf": false,
        "message": {
            "test": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        "showDate": true,
        readId:"read"
    },
    

        
    ]);
        const [chatText, setChatText] = React.useState("");
        const [startIndex, setStartIndex] = React.useState(0);
        const [totalCount, setTotalCount] = React.useState(0);
        const [incomeMesage,setIncomeMesage]= React.useState(null);
       const [showEmoji,setShowEmoji] = React.useState(false);
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
          
          if(props.item!=null && props.item.targetUserId!=null && userData!=null){
            //chatHistory() 
          }
      },[props.item,userData]);
  const chatHistory = async ()=>{
    try {
      let obj1={
        from:userData.userId,
        to:props.item.targetUserId,
    }
    const response =  await callApi(ServiceConstant.FETCH_CHAT_HISTORY, obj1);
    console.log("response chat history",response)
  //  const groupedData = response.reduce((result, item) => {
  //   const date = item.created_at.split('T')[0];
  //   if (!result[date]) {
  //     result[date] = { date, message: [] };
  //   }
  //   result[date].message.push(item);
  //   return result;
  // }, {});
  // const formattedData = Object.values(groupedData);
  // console.log("groupedData",groupedData)

  const processedMessages = response.map((message, index) => {
    const showDate =
      index === 0 ||
      new Date(message.created_at).toDateString() !==
        new Date(response[index - 1].created_at).toDateString();
    return { ...message, showDate };
  });
  console.log("processedMessages",processedMessages)
  const reversedArray = processedMessages.reverse();
     // const reversedArray = response.reverse();
  
      setData(reversedArray)
    // setData(processedMessages)
    
  
      
    } catch (error) {
      console.log("error Chat history",error)
    }
   
  }
  useEffect(()=> {
    if(socket!=null && socket!=''){
     
      
        socket.on("msg-recieve", (msg) => {
        console.log("msg",msg);
        const arrData = data;
        console.log("data",data);
        setIncomeMesage(msg);
        //    let arr3={}
        //     if(userData.userId==msg.from){
        //         arr3={
        //             fromSelf:true,
        //             message:{
        //                 test:msg.message
        //             },
        //             created_at:  getCreatedDate()
        //         }
        //        // arrData.push(arr3);
        //      //   setData(arrData)
        // setData(addAfter(data, 0, arr3))
               
        //     }
        //     else if(props.item.targetUserId==msg.from || userData.userId==msg.to){
        //         arr3={
        //             fromSelf:false,
        //             message:{
        //                 test:msg.message
        //             },
        //             created_at:  getCreatedDate()
        //         }
        //        // arrData.push(arr3);
        //         //setData(arrData)
        //         setData(addAfter(data, 0, arr3))
               
        //     }
            })
        
    }
    
   }, [socket])

   useEffect( () => {

    if(incomeMesage == null) return

    onMessageReceived(incomeMesage, data)

    setIncomeMesage(null)

  }, [incomeMesage]);

  const onMessageReceived = (msg, messages) => {

    // console.log('MESSAGE:' + JSON.stringify(message))

     if(msg == null) return

     try {
      let arr3={}
      if(userData.userId==msg.from){
          arr3={
              fromSelf:true,
              message:{
                  test:msg.message
              },
              created_at:  getCreatedDate()
          }
          setData(addAfter(messages, 0, arr3))
       
      }
      else if(props.item.targetUserId==msg.from || userData.userId==msg.to){
          arr3={
              fromSelf:false,
              message:{
                  test:msg.message
              },
              created_at:  getCreatedDate()
          }
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
              //  {roomno: item.targetUserId,rooms :roomNo,
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
            //     new Date(message.created_at).toDateString() !==
            //       new Date(data[index - 1].created_at).toDateString();
            //   return showDate ;
            // });
            // console.log("processedMessages",processedMessages)
//             const lastProcessedMessageValue = revData[revData.length - 1];
// console.log('Last Processed Message Value:', lastProcessedMessageValue);
let value = true;

const lastMsgDate=new Date(data[0].created_at);
const formateDate = DATE.format(lastMsgDate, 'DD/MM/YYYY')
const currentDate = new Date();
const formateCurrentDate = DATE.format(currentDate, 'DD/MM/YYYY')



//console.log(formateDate )
//console.log(formateCurrentDate)

if (formateDate === formateCurrentDate) {
  value = false;
}
//console.log('Value:', value);
            const message ={
              "fromSelf": true,
              "message": {
                  "test":chatText
              },
              "created_at":  getCreatedDate(),
              "showDate":value,
              "readId": netInfo.isConnected ? "send":"pending"
          }
            console.log(getCreatedDate())
           setData(addAfter(data, 0, message))
          //   let arr={
          //     from:userData.userId,
          //     to:props.item.targetUserId,
          //     message:chatText
          // }
          // console.log("socket",socket)
          //   socket.emit("send-msg",arr);

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
              const renderRowItem = ({ item, index }) => {
          
                  // https://www.freecodecamp.org/news/design-imessage-like-chat-bubble-react-native/
          
        //const alignment = 2713882  == item.creatorId ? "left" : "right"; //props.route.params.targetUserId == item.creatorId ? "left" : "right"
        
        const alignment = item.fromSelf  ==false ? "left" : "right"; //props.route.params.targetUserId == item.creatorId ? "left" : "right"
  
                const dateVal = () => {
                  return formatTime(item.created_at)
                 // return formatChatDateTime(item.created_at)
          
                } 
                 
                return (
                  <View>
                     {item.showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
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
            <ChatHeaderView 
            
             item={props.item}
    //          item ={ {
    //   lastMessage:'hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd',
    //   lastMessageTime: '12-06-2023 09:54:57 GMT',
    //   matrimonyUserName: 'Test User',
    //   onlinestatus: 'true',
    //   profileImageDtl: '/documents/images/image-Male.jpg',
    //   targetUserId: 2713882,
    //   userCode: 'AW27605902',
    //   userFullName: 'Test.U(AW27605902)',
    //   userJID:'test.testagent1001@ip-10-200-18-60.ap-southeast-1.compute.internal',
    //   userChatCount: 20,
    // }}
              showLastMessage={false}
              onGoback={(e)=> props.goBack()}
            onMenuPress={(e)=> console.log(e)}
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