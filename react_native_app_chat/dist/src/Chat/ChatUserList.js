import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Keyboard,
  //AsyncStorage
  
} from 'react-native';

import { ChatUserRow } from './ChatUserRow';
import ChatConversation from './ChatConversation';

import { callApi } from '../../NW/APIManager';
import {useNetInfo} from "@react-native-community/netinfo";
import  { ServiceConstant } from '../../NW/ServiceAPI';
import { DefaultView } from '../Utility/DefaultView';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import BlockList from './BlockList';
import PendingRequest from './PendingRequest';
import { getCreatedDate,showToast } from '../Utility/Utility';
import AsyncStorage from '@react-native-async-storage/async-storage';


 const ChatUserList = props => {
//console.log("ChatUserList props",props.route.params.props)
const newProps = props //props.route.params.props; //props
const  {userCode,chatuserId,profileImage,profileName,pushData } = props;
 console.log(userCode,"userCodes")
 
//const navigation = useNavigation();
const netInfo = useNetInfo();
const inputRef = useRef(null);
const [searchText,setSearchText] = useState("")
const [openUserDetailPage,setOpenUserDetailPage] = useState(false)
const [items,setItems] = useState(null)
//const [socket,setsocket]=useState(props.socket);

const ws = useRef(null);
let selectItem = null
const [data, setData] = useState([]);

  const [previousData,setPreviousData] = useState([]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [pageType,setPageType] = useState(null)
  const [incomeMesage,setIncomeMesage]= React.useState(null);


  useEffect(  ()=>{
   
      fetchChatFriends()

    //const result = await isUserPaidMember(null)
    //setIsPaidMember(result)
   
  },[openUserDetailPage,props])
  useEffect(()=>{
   if(pushData != null && pushData.from == "push"){
     console.log("pushData",pushData);
     if(data.length >0){
      for (const friend of data) {
        console.log(friend.mappedUserid,pushData.userId,"data.mappedUserid")
        if (friend.mappedUserid == pushData.userId) {
           // foundFriend = friend;
           console.log("friend",friend)
           setItems(friend);
           setTimeout(()=>{
            setOpenUserDetailPage(true);
            setPageType("detail")
          }, 1000)
           break; // Exit the loop once the item is found
        }
    }
     }

   }
   
},[pushData])

 const onRefreshList =()=>{
  if(netInfo.isConnected == null || netInfo.isConnected  ){
    fetchChatFriends()
  }
  else{
    showToast("Please check your Internet Connection");
  }

 }
  const fetchChatFriends = async () => {
    
    try {
      
     // startAWEngageTracking(AWEngageEvent.CHAT)

    //  trackAWEngageScreen(AWEngageEvent.CHAT)

      //setIsLoading(true)
      let arr = {
          "userid":chatuserId
        }
        
      const response =  await callApi(ServiceConstant.FETCH_CHAT_FRIENDS_LIST, arr);
      
      console.log("response.friendlist",response)
      if(response != null && response['friendlist'] != null){

        let result = response.friendlist

        /// Remove self from the list
        //  const loggedInUserId = response['loggedinUserId']
        //  if(loggedInUserId != null){
        //   result = response.chatFriendList.filter( (item) => { if(item['targetUserId'] != loggedInUserId) { return item}  } )
        //  }

       // console.log("result",result); 
      //  const asyncData = await AsyncStorage.getItem("chatData")
      //  const parsedValue = JSON.parse(asyncData);
      
      //  console.log("valuse",parsedValue); 
        

// if(asyncData != null){
  
 
//   const updatedFriendlist =  result.map(item => {
//     const asyncUser = parsedValue.find((user) => user.mappedUserid === item.mappedUserid);
//     if (asyncUser ) {
//    return {...item,
//     "userChatHistory":asyncUser.userChatHistory.length > 0? asyncUser.userChatHistory:[]
//    }
//     }
//     return item
//   });

// //console.log("Updated friendlist:", updatedFriendlist);
// await AsyncStorage.setItem("chatData", JSON.stringify(updatedFriendlist))
// }     
// else{
 
//   const asyncData =  result.map(item => ({
//           ...item,
//           "userChatHistory": []
//         }));
        
//         await AsyncStorage.setItem("chatData", JSON.stringify(asyncData))
    
// }  

       const sortedFriendList = response.friendlist.sort((a, b) => b.modifyon - a.modifyon);

        setData(sortedFriendList)
        setPreviousData(sortedFriendList)

        // const value = await AsyncStorage.getItem("chatData")
        //setUserName(response['loggedinUserName'])
      }

    //  setIsLoading(false)

     // endAWEngageTracking(AWEngageEvent.CHAT)

    // trackAWEngageScreen(AWEngageEvent.CHAT, false)

    }
    catch(e){

       console.log(e)
       alert("userlist "+e)
       //setIsLoading(false)
     
      //trackAWEngageScreen(AWEngageEvent.CHAT, false)
    }

  }
  

  useEffect(()=> {
    if(props.socket!=null && props.socket!='' && openUserDetailPage == false){
     
      
      props.socket.on(userCode, (msg) => {
        console.log("msgsss",msg);
      //  onMessageReceived(msg, data)
       
        setIncomeMesage(msg);
            })
        
    }
    
   }, [props.socket])

   useEffect( () => {

    if(incomeMesage == null) return
    console.log("incomeMesage",incomeMesage)
    onMessageReceived(incomeMesage, data)

    setIncomeMesage(null)

  }, [incomeMesage]);


  const onMessageReceived = (msg, messages) => {

    if (__DEV__) { console.log('MESSAGE:' + JSON.stringify(messages))}

     if(msg == null) return

     try {

      //console.log(messages)
      
      const updatedData = messages.map(item => {
        if (item.mappedUserCode === msg.senderName) {
          // Update the messagebody for the specified mappedUserCode
         
         
          return {
            ...item,
            messagebody: msg.message,
           modifyon :getCreatedDate(),
           unreadcount:item.unreadcount+1
           
          };
        }
        return item;
      });
      const sortedFriendList = updatedData.sort((a, b) => {
        return b.modifyon - a.modifyon;  // Corrected the return order
      });
      console.log("updatedData",sortedFriendList)
      setPreviousData(sortedFriendList);
      setData(sortedFriendList)     
     } 
     catch(e) {

      console.log(e)
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

            {/* <View>
            <Menu
            visible={isMenuVisible}
            anchor={
              <Pressable onPress={() => setIsMenuVisible(true)}>
              <Image
        style={{height:20,width:20,marginLeft:10}}
       source={require('../icons/app_menu_black.png')} resizeMode="contain" /> 
                  </Pressable>
            }
            onRequestClose={() => setIsMenuVisible(false)}>
          <MenuItem onPress={() => {
              setIsMenuVisible(false)
              //setTimeout(()=>{
          setOpenUserDetailPage(true);
          setPageType("block")
        //}, 1000)
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight:10 }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/block_user.png')}
  style={{ width: 20, height: 20, marginRight: 10  }}
/>
<Text style={{color:"black",  }}> {"Block List"}</Text>
     </View>
    
            </MenuItem>
             <MenuItem onPress={() => {
               setIsMenuVisible(false)
               setOpenUserDetailPage(true);
          setPageType("pending")
              
             }}>
             <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      
      <Image
      resizeMode="contain"
  source={require('../icons/pending_request.png')}
  style={{ width: 20, height: 20, marginRight: 10 }}
/>
<Text style={{color:"black", }}> {"Pending Request"}</Text>
     </View>
    
            </MenuItem> 
                   </Menu>
  
            </View> */}
           
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
                console.log(e )
                const filteredData = previousData.filter(item => item.mappedUserName.toLowerCase().includes(e.toLowerCase()));
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
              showsVerticalScrollIndicator={false}
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

          console.log("onSelectProfile", item)
    
          if(item == null) return
    
          item['chatUserName'] =  item.mappedUserName//"Test"//userName.current
         // props.navigation.push("ChatConversation", item)
        // navigation.navigate("ChatConversation",item)
        setItems(item)
        selectItem = item;

       // console.log("in",selectItem)
        setTimeout(()=>{
          setOpenUserDetailPage(true);
          setPageType("detail")
        }, 1000)
       
        }

        const onPressGoBack=()=>{
          setOpenUserDetailPage(false);
          setPageType(null)
        }
    return (
      
      <View style={styles.container}>
      {openUserDetailPage == false? 
        <View style={styles.container}>
        {/* {headerView()}   */}
         {netInfo.isConnected == null || netInfo.isConnected  ?  
          <View  style={{flex:1, paddingHorizontal: 15}}>
       {searchView()} 
        {userListView()} 
        </View> 
        :
        <DefaultView title ={"You are not connected to internet" } action={onRefreshList()} />

        } 
       
      </View>
      : 
     pageType != null && pageType =="detail"? 
     <ChatConversation props={props}
        item={items}
        goBack={()=>onPressGoBack()}
        socket={props.socket}
        userCode={userCode}
        chatuserId={chatuserId}
      />
      :
      pageType != null && pageType =="block"?
      <BlockList
         goBack={()=>onPressGoBack()}
      />
      :
      <PendingRequest
        goBack={()=>onPressGoBack()}
      />
      }

     
      {/* <WS
          ref={ws}
          url="http://10.133.12.25:8080/websocket-chat"
          onOpen={() => {
            console.log('Open!')
            ws.send('Hello')
          }}
          onMessage={(e)=>{console.log("message",e)}}
          onError={(e)=>{console.log("onError",e)}}
          onClose={(e)=>{console.log("onClose",e)}}
          reconnect={false} // Will try to reconnect onClose
        /> */}
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
    headerMainView:{flexDirection: 'row', height: 50, alignItems: 'center',paddingHorizontal:15,},
    flex1:{flex: 1},
    headerTitle:{fontSize: 17, fontWeight: '500',color:"#000"},
    menuView:{ alignItems: 'center', paddingRight: -10, }
  });
  
export default ChatUserList