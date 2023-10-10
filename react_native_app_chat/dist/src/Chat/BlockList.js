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
  BackHandler
} from 'react-native';
import { Avatar} from 'react-native-paper';
import { getImageUrl } from '../../NW/ServiceURL';
import { prepareShortName } from '../Utility/Utility';


const BlockList = props => {
    const inputRef = useRef(null);
    const [searchText,setSearchText] = useState("")
    const [data, setData] = useState([
        {
            "targetUserId": 2702140,
            "matrimonyUserName": "Test Marathi",
            "profileImageDtl": "/documents/images/image-Female.jpg",
    },
    {
        "targetUserId": 2699360,
        "matrimonyUserName": "Test Femaletest",
        "profileImageDtl": "/documents/images/image-Female.jpg",
},
{
    "targetUserId": 2702140,
    "matrimonyUserName": "Test Marathi",
    "profileImageDtl": "/documents/images/image-Female.jpg",
},
{
"targetUserId": 2699360,
"matrimonyUserName": "Test Femaletest",
"profileImageDtl": "/documents/images/image-Female.jpg",
}
    ])
    const [previousData,setPreviousData] = useState([

        {
            "targetUserId": 2702140,
            "matrimonyUserName": "Test Marathi",
            "profileImageDtl": "/documents/images/image-Female.jpg",
    },
    {
        "targetUserId": 2699360,
        "matrimonyUserName": "Test Femaletest",
        "profileImageDtl": "/documents/images/image-Female.jpg",
},
{
    "targetUserId": 2702140,
    "matrimonyUserName": "Test Marathi",
    "profileImageDtl": "/documents/images/image-Female.jpg",
},
{
"targetUserId": 2699360,
"matrimonyUserName": "Test Femaletest",
"profileImageDtl": "/documents/images/image-Female.jpg",
}
    ])

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
    const headerView=()=>{
        return(
            <View style={{backgroundColor:"#FFF",flexDirection:"row", height:50,alignItems:'center',paddingHorizontal:10}}>
            <Pressable onPress={() => { 
  
  props.goBack()
    }}>
    <Image
        style={{height:25,width:25,marginRight:10}}
       source={require('../icons/back.png')} resizeMode="contain" /> 
       </Pressable>
           

       <Text style={{color:"black",fontWeight:"500",fontSize:18  }}> {"Block List"} </Text>
            </View>
        )
    }

    const searchView = () => {
        return (
        <View style={ styles.serachMainView}>
       <TouchableOpacity style={{paddingLeft:8}} onPress={()=>{
           
            inputRef.current.focus()
            console.log(inputRef.current.focus())
       }}>
        
        <Image
            style={{height: 20, width: 20}}
            source={require('../icons/search.png')}
            resizeMode="contain"
          />
         
       
            </TouchableOpacity>
          <TextInput
          ref={inputRef}
            style={styles.mTextfield}
            mode="outlined"
            placeholder={"Search"}
            autoCapitalize="none"
            returnKeyType="next"
            value={searchText}
            onChangeText={e => {
              if(e !=""){
                setSearchText(e)
               // console.log(e  )
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
            
            <View style={styles.mainView} >
          
             <View style={styles.imageMainView}>
        
             <Avatar.Image style={{backgroundColor:'white'}} size={55} source={{uri: getImageUrl(item.profileImageDtl)}} /> 
            
             <View style={styles.textMainView}>
         <View style={styles.flexRow}>
             <View style={styles.flex1}>
       
       <Text style={styles.userText}> {prepareShortName(item.matrimonyUserName)}</Text>
       
       </View>
      
       <Pressable style={styles.unBlockMainView}
            onPress={()=>{
              alert("Unblock")
            }}
            >
            <Text style={styles.unBlockText}> {"Unblock"}</Text>
     
            </Pressable>
       </View>
       </View>
            </View>
            </View>
         
        );
      };
    return(
        <View style={styles.container}>
        {headerView()}
        <View style={{paddingHorizontal:15}}>
        {searchView()}
        {userListView()} 
        </View>
        </View>
    )
}

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:"#FFF"
},
flex1:{flex:1},
serachMainView:{flexDirection:"row",alignItems:"center", borderWidth:1,borderColor:"#BDBDBD",borderRadius:10,marginVertical:10,height:48,backgroundColor:"#FFF"},
mainView:{paddingVertical:12, marginLeft:0},
imageMainView:{flexDirection:'row', alignItems:'center'},
userText:{
    fontSize:16,
    fontWeight: "normal",
    color: "#262626"},
    flexRow:{ flexDirection:"row",alignItems:"center",},
    textMainView:{marginLeft:8, flex:1,},
    unBlockMainView:{backgroundColor:"#D2FFD0",alignItems:"center",justifyContent:"center",borderRadius:8, paddingVertical:10,paddingLeft:6,paddingRight:11,},
    unBlockText:{color:"#343434",fontWeight:"600"}
})
export default BlockList