import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard
} from 'react-native';

import { ChatUserRow } from './ChatUserRow';
import ChatConversation from './ChatConversation';
import io from 'socket.io-client';
import { callApi } from '../../NW/APIManager';

import  { ServiceConstant } from '../../NW/ServiceAPI';
import { DefaultView } from '../Utility/DefaultView';
 const ChatUserList = props => {
//console.log("ChatUserList props",props.route.params.props)
const newProps = props //props.route.params.props; //props
//const navigation = useNavigation();
const inputRef = useRef(null);
const [searchText,setSearchText] = useState("")
const [openUserDetailPage,setOpenUserDetailPage] = useState(false)
const [items,setItems] = useState(null)
const [socket,setsocket]=useState(null);
const [userData,setUserData] = useState({
  userId:2713882
})
let selectItem = null
const [data, setData] = useState([
  {
    "lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
    "lastMessageTime": "05-10-2023 15:26:46 GMT",
    "matrimonyUserName": "Test Marathi",
    "onlinestatus": "true",
    "profileImageDtl": "/documents/images/image-Female.jpg",
    "targetUserId": 2702140,
    "userCode": "AW69998014",
    "userFullName": "Test.M(AW69998014)",
    "userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
    "userChatCount": 20,
},
{
    "lastMessage": "hello",
    "lastMessageTime": "05-10-2023 05:24:46 GMT",
    "matrimonyUserName": "Test Femaletest",
    "onlinestatus": "false",
    "profileImageDtl": "/documents/images/image-Female.jpg",
    "targetUserId": 2699360,
    "userCode": "AW93971116",
    "userFullName": "Test.F(AW93971116)",
    "userJID": "test.test99367@ip-10-200-18-60.ap-southeast-1.compute.internal",
    "userChatCount": 0,
},
{
  "lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
  "lastMessageTime": "04-10-2023 06:44:46 GMT",
  "matrimonyUserName": "Test Marathi new",
  "onlinestatus": "false",
  "profileImageDtl": "/documents/images/image-Female.jpg",
  "targetUserId": 2702140,
  "userCode": "AW69998014",
  "userFullName": "Test.M(AW69998014)",
  "userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
  "userChatCount": 0,
},
{
"lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
"lastMessageTime": "13-06-2023 06:44:46 GMT",
"matrimonyUserName": "Test new",
"onlinestatus": "false",
"profileImageDtl": "/documents/images/image-Female.jpg",
"targetUserId": 2702140,
"userCode": "AW69998014",
"userFullName": "Test.M(AW69998014)",
"userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
"userChatCount": 0,
},
   
]);

  const [previousData,setPreviousData] = useState([
    {
      "lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
      "lastMessageTime": "13-06-2023 06:44:46 GMT",
      "matrimonyUserName": "Test Marathi",
      "onlinestatus": "true",
      "profileImageDtl": "/documents/images/image-Female.jpg",
      "targetUserId": 2702140,
      "userCode": "AW69998014",
      "userFullName": "Test.M(AW69998014)",
      "userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
      "userChatCount": 20,
  },
  {
      "lastMessage": "hello",
      "lastMessageTime": "13-06-2023 06:02:33 GMT",
      "matrimonyUserName": "Test Femaletest",
      "onlinestatus": "false",
      "profileImageDtl": "/documents/images/image-Female.jpg",
      "targetUserId": 2699360,
      "userCode": "AW93971116",
      "userFullName": "Test.F(AW93971116)",
      "userJID": "test.test99367@ip-10-200-18-60.ap-southeast-1.compute.internal",
      "userChatCount": 0,
  },
  {
    "lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
    "lastMessageTime": "13-06-2023 06:44:46 GMT",
    "matrimonyUserName": "Test Marathi new",
    "onlinestatus": "false",
    "profileImageDtl": "/documents/images/image-Female.jpg",
    "targetUserId": 2702140,
    "userCode": "AW69998014",
    "userFullName": "Test.M(AW69998014)",
    "userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
    "userChatCount": 0,
},
{
  "lastMessage": "hii shgfdhf fjhkjgfhgkfjh fgjhgfkjhgfkjhgf kjfghkfhgfkj jhsfkjghfd",
  "lastMessageTime": "13-06-2023 06:44:46 GMT",
  "matrimonyUserName": "Test new",
  "onlinestatus": "false",
  "profileImageDtl": "/documents/images/image-Female.jpg",
  "targetUserId": 2702140,
  "userCode": "AW69998014",
  "userFullName": "Test.M(AW69998014)",
  "userJID": "user.1677476722397@ip-10-200-18-60.ap-southeast-1.compute.internal",
  "userChatCount": 0,
},
  ])
  const [isConnected, setIsConnected] = useState(false);

  // useEffect(() => {
  //   const handleConnectivityChange = (connectionInfo) => {
  //     setIsConnected(connectionInfo.isConnected);
  //   };

  //   NetInfo.addEventListener('connectionChange', handleConnectivityChange);

  //   return () => {
  //     NetInfo.removeEventListener('connectionChange', handleConnectivityChange);
  //   };
  // }, []);
  useEffect(()=>{
    //setsocket(io("http://10.132.100.175:5001"));
    //setsocket(io("http://10.133.14.23:5001"));
      //const socketConnection = io("https://chatqa.abpweddings.com");

      const socketConnection = io('wss://chatqa.abpweddings.com:6001',{
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
        socket.emit('ad-user',userData.userId)
    }
},[userData,socket]);
  useEffect(()=>{
    //  fetchChatFriends()

    //const result = await isUserPaidMember(null)
    //setIsPaidMember(result)
   
  },[])
  const fetchChatFriends = async () => {
    
    try {

     // startAWEngageTracking(AWEngageEvent.CHAT)

    //  trackAWEngageScreen(AWEngageEvent.CHAT)

      //setIsLoading(true)

      const response =  await callApi(ServiceConstant.FETCH_CHAT_FRIENDS_LIST, null);
      console.log(response)
      if(response != null && response['chatFriendList'] != null){

        let result = response.chatFriendList

        /// Remove self from the list
        //  const loggedInUserId = response['loggedinUserId']
        //  if(loggedInUserId != null){
        //   result = response.chatFriendList.filter( (item) => { if(item['targetUserId'] != loggedInUserId) { return item}  } )
        //  }

       // console.log(response); 
        setData(result)
        setPreviousData(result)
        //setUserName(response['loggedinUserName'])
      }

    //  setIsLoading(false)

     // endAWEngageTracking(AWEngageEvent.CHAT)

    // trackAWEngageScreen(AWEngageEvent.CHAT, false)

    }
    catch(e){

       console.log(e)

       //setIsLoading(false)
     
      //trackAWEngageScreen(AWEngageEvent.CHAT, false)
    }

  }
  
 
    const headerView = () => {
        return (
            
          <View style={newProps.headerStyle? [newProps.headerStyle,styles.headerMainView]:styles.headerMainView}>
         {newProps.leftIcon && <TouchableOpacity
              style={styles.menuView}
              onPress={() => {
                newProps.onPressLeft()
               // eventEmitter.emit('DID_OPEN_MORE', {isSideMenuVisible: true});
              }}>
                
                  {newProps.leftIcon != null ? newProps.leftIcon :<Image
        style={{height:25,width:25,marginRight:10}}
       source={require('../icons/back.png')} resizeMode="contain" /> 
       }  

            </TouchableOpacity>}
            <View style={newProps.headerTitle? newProps.headerTitle:styles.flex1}>
              <Text style={newProps.headerTitleText? newProps.headerTitleText:styles.headerTitle}>{newProps.headerText?newProps.headerText:"Chat"}</Text>
            </View>
           { newProps.rightIcon&&<TouchableOpacity
              style={styles.menuView}
              onPress={()=>{
                newProps.onPressRight()
              
              }
                
                 
               // eventEmitter.emit('DID_OPEN_MORE', {isSideMenuVisible: true});
              }>
                
                  {newProps.rightIcon != null ? newProps.rightIcon :<Image
        style={{height:25,width:25}}
       source={require('../icons/menu.png')} resizeMode="contain" /> 
       }  

            </TouchableOpacity>}
          </View>
       
          
           );
      };
      const searchView = () => {
        return (
        <View style={newProps.searchCustomStyle?newProps.searchCustomStyle : styles.serachMainView}>
       <TouchableOpacity style={{paddingLeft:8}} onPress={()=>{
           
            inputRef.current.focus()
            console.log(inputRef.current.focus())
       }}>
        {newProps.searchIcon != null ? newProps.searchIcon :
        <Image
            style={{height: 20, width: 20}}
            source={require('../icons/search.png')}
            resizeMode="contain"
          />
       }  
       
            </TouchableOpacity>
          <TextInput
          ref={inputRef}
            style={styles.mTextfield}
            mode="outlined"
            placeholder={newProps.searchPlaceholder?newProps.searchPlaceholder:"Search"}
            autoCapitalize="none"
            returnKeyType="next"
            value={searchText}
            onChangeText={e => {
              if(e !=""){
setSearchText(e)
                console.log(e  )
                const filteredData = previousData.filter(item => item.matrimonyUserName.toLowerCase().includes(e.toLowerCase()));
                //props.onChangeText(e)
                console.log("filteredData",filteredData)
               setData(filteredData)
              }else{
                setSearchText(e)
                console.log(e)

                setData(
                  previousData
                )
              }
                }}
    
          />
          </View>
      
      
      );
      };

      const userListView = () => {
        return (
         
          
          <FlatList
              style={{marginVertical: 5,}}
              data={data}
              renderItem={renderRowItem}
              windowSize={15}
            /> 
         
        );
      };

      const renderRowItem = ({item, index}) => {
        return (
          <ChatUserRow
            item={item}
            index={index}
             onSelectProfile={onSelectProfile}
          />
        );
      };
      
      const onSelectProfile = (item, index) => {

        //  console.log("onSelectProfile", item)
    
          if(item == null) return
    
          item['chatUserName'] =  "Test"//userName.current
         // props.navigation.push("ChatConversation", item)
        // navigation.navigate("ChatConversation",item)
        setItems(item)
        selectItem = item;

       // console.log("in",selectItem)
        setTimeout(()=>{
          setOpenUserDetailPage(true);
        }, 1000)
       
        }

        const onPressGoBack=()=>{
          setOpenUserDetailPage(false);
        }
    return (
      
      <View style={styles.container}>
      {openUserDetailPage == false? 
        <View style={styles.container}>
        {headerView()}  
       <View  style={{flex:1, padding: 15}}>
       {searchView()} 
        {userListView()} 
        </View> 
      </View>
      : 
      <ChatConversation props={props}
        item={items}
        goBack={()=>onPressGoBack()}
        socket={socket}
      />

      }
      </View>
     
      
        
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    backgroundColor: '#FFF',
    },
    mainView: {flex:1, padding: 15},
    mTextfield:{
        
        width:"88%",
        height:45,
      //backgroundColor: '#FFF',
      
    },
    serachMainView:{flexDirection:"row",alignItems:"center", borderWidth:1,borderColor:"#BDBDBD",borderRadius:10,marginVertical:10,height:48,backgroundColor:"#FFF"},
    headerMainView:{flexDirection: 'row', height: 40, alignItems: 'center',paddingHorizontal:15},
    flex1:{flex: 1},
    headerTitle:{fontSize: 17, fontWeight: '500',color:"#000"},
    menuView:{top: 0, alignItems: 'center', paddingRight: 3}
  });
  
export default ChatUserList