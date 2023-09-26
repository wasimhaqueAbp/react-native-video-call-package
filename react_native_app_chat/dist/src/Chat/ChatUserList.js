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
    // {
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
    // },
    // {
    //   lastMessage: 'hello',
    //   lastMessageTime: '09-06-2023 10:07:02 GMT',
    //   matrimonyUserName: 'Test User',
    //   onlinestatus: 'false',
    //   profileImageDtl:'/documents/4c8659d9d0d078cb5669b01d6b0981b1/1686311304191.jpg',
    //   targetUserId: 2713678,
    //   userCode: 'AW54903997',
    //   userFullName: 'Test.U(AW54903997)',
    //   userJID: 'test.agent5@ip-10-200-18-60.ap-southeast-1.compute.internal',
    //   userChatCount: 0,
    // },
  ]);

  const [previousData,setPreviousData] = useState([
    // {
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
    // },
    // {
    //   lastMessage: 'hello',
    //   lastMessageTime: '09-06-2023 10:07:02 GMT',
    //   matrimonyUserName: 'Test User',
    //   onlinestatus: 'false',
    //   profileImageDtl:'/documents/4c8659d9d0d078cb5669b01d6b0981b1/1686311304191.jpg',
    //   targetUserId: 2713678,
    //   userCode: 'AW54903997',
    //   userFullName: 'Test.U(AW54903997)',
    //   userJID: 'test.agent5@ip-10-200-18-60.ap-southeast-1.compute.internal',
    //   userChatCount: 0,
    // },
  ])

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
      fetchChatFriends()

    //const result = await isUserPaidMember(null)
    //setIsPaidMember(result)
   
  },[])
  const fetchChatFriends = async () => {
    
    try {

     // startAWEngageTracking(AWEngageEvent.CHAT)

    //  trackAWEngageScreen(AWEngageEvent.CHAT)

      //setIsLoading(true)

      const response =  await callApi(ServiceConstant.FETCH_CHAT_FRIENDS_LIST, null);

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