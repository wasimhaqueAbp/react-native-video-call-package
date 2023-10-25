import React from 'react';
import DATE from 'date-and-time';
import Toast from 'react-native-simple-toast';
export const prepareShortName = (matrimonyUserName, maxLimit = 30) => {
    if (matrimonyUserName == null || matrimonyUserName.trim() == '') {
      return '';
    }
  
    let finalStr = '';
  
    try {
      const arrOfStr = matrimonyUserName.split(' ');
  
      if (arrOfStr.length > 1) {
        finalStr = arrOfStr[0].substring(0, 1).toUpperCase() + ' ';
        let lastName =
          arrOfStr[arrOfStr.length - 1].substring(0, 1).toUpperCase() +
          arrOfStr[arrOfStr.length - 1].substring(1).toLowerCase();
        finalStr += lastName;
      } else {
        finalStr =
          arrOfStr[0].substring(0, 1).toUpperCase() +
          arrOfStr[0].substring(1).toLowerCase();
      }
  
      if (finalStr.length > maxLimit) {
        finalStr = finalStr.substring(0, maxLimit - 3);
        finalStr += '...';
      }
    } catch (e) {
      finalStr = matrimonyUserName;
    }
  
    return finalStr;
  };

  export const formatChatDateTime = (createdAt) =>{

    let displayVal = "Now"
  
    try {
  
        const dateString = new Date(createdAt) //.replace(" GMT", "")
        
        const formattedDateTime = DATE.format(dateString, 'DD-MM-YYYY HH:mm:ss');

        const date =  DATE.parse(formattedDateTime, 'DD-MM-YYYY HH:mm:ss', true)
        
        const currentDate = new Date() 
  
        let yesterDayDate  = new Date()
        yesterDayDate.setDate(currentDate.getDate() - 1);
        const yesterDay =  DATE.format(yesterDayDate, 'DD', true)
  
         const diff = (currentDate.getTime() - date.getTime())/1000
  
         if(diff < 60){
          displayVal = "Now"
         }
         else if (date.getDate() == yesterDay) {
  
          displayVal =  "Yesterday"
         }
         else if (diff < 60*60*24) { //Today
  
          //displayVal =  format(date, 'h:mm a')
  
          displayVal = DATE.format(date, 'hh:mm A');
  
         } 
         else {
  
          displayVal =  DATE.format(date, 'DD MMM, YYYY')
  
         }
        }
        catch(e){
  
          //console.log(e)
  
         // displayVal = dateString
        }
  
       return  displayVal
  
  }
  export const formatChatDateTimeGMT = (createdAt) =>{

    let displayVal = "Now"
  
    try {
        const newCreatedDate = createdAt.replace(" GMT", "")
        
        const dateString = newCreatedDate //.replace(" GMT", "")
        //const formattedDateTime = DATE.format(dateString, 'DD-MM-YYYY HH:mm:ss');

        const date =  DATE.parse(dateString, 'DD-MM-YYYY HH:mm:ss', true)
        
        const currentDate = new Date() 
  
        let yesterDayDate  = new Date()
        yesterDayDate.setDate(currentDate.getDate() - 1);
        const yesterDay =  DATE.format(yesterDayDate, 'DD', true)
  
         const diff = (currentDate.getTime() - date.getTime())/1000
  
         if(diff < 60){
          displayVal = "Now"
         }
         else if (date.getDate() == yesterDay) {
  
          displayVal =  "Yesterday"
         }
         else if (diff < 60*60*24) { //Today
  
          //displayVal =  format(date, 'h:mm a')
  
          displayVal = "Today"//DATE.format(date, 'hh:mm A');
  
         } 
         else {
  
          displayVal =  DATE.format(date, 'DD/MM/YYYY')
  
         }
        }
        catch(e){
  
          console.log(e)
  
         // displayVal = dateString
        }
  
       return  displayVal
  
  }
  export const formatTime = (createdAt) =>{

    let displayVal = "Now"
  
    try {
  
        const dateString = new Date(createdAt) //.replace(" GMT", "")
        
        const formattedDateTime = DATE.format(dateString, 'hh:mm A');

        displayVal = formattedDateTime
        }
        catch(e){
  
          //console.log(e)
  
         // displayVal = dateString
        }
  
       return  displayVal
  
  }
  export const formatDate = (createdAt) =>{

    let displayVal = "Now"
  
    try {
  
        const dateString = new Date(createdAt) //.replace(" GMT", "")
       // console.log("dateString",dateString)
       // const date = DATE.format(dateString, 'DD/MM/YYYY HH:mm:ss');

       // displayVal = formattedDateTime
       const currentDate = new Date() 
 
       let yesterDayDate  = new Date()
       
       yesterDayDate.setDate(currentDate.getDate() - 1);
       const yesterDay =  DATE.format(yesterDayDate, 'DD', true)
       
        const diff = (currentDate.getTime() - dateString.getTime())/1000
        
        if(diff < 60){
         displayVal = "Today"
        }
        else if (dateString.getDate() == yesterDay) {
 
         displayVal =  "Yesterday"
        }
        else if (diff < 60*60*24) { //Today
 
         //displayVal =  format(date, 'h:mm a')
 
         displayVal = "Today" //DATE.format(date, 'hh:mm A');
 
        } 
        else {
 
         displayVal =  DATE.format(dateString, 'DD/MM/YYYY')
 
        }
      
        }
        catch(e){
  
          console.log(e)
  
         // displayVal = dateString
        }
  
       return  displayVal
  
  }
  export const getCreatedDate = () => {

    //const val = format(new Date(), 'dd-MM-yyyy hh:mm:ss')

   // const val = DATE.format(new Date(), 'DD-MM-YYYY HH:mm:ss', true) + " GMT"
   const currentDate = new Date();
   const epochDate = currentDate.getTime();  // Get the Unix timestamp (in milliseconds)
   const val =  epochDate //currentDate.toISOString();
    return val
}

export const showToast = (
  message,
  timeout = 5,
  length = Toast.LONG,
  gravity = Toast.CENTER,
) => {

    setTimeout(() => {
      Toast.showWithGravity(message, length, gravity);
    }, timeout)

};

  // export default class NavigationState {

  //   static navigation = {}
  //   static previous = null;
  //   static currentScreen = 0;
  //   static isInteractionPerformed = 0;
  //   static isDefaultTheme = true;
  //   static isFirebaseUserSet = false;
  
  //   static isUserLoggedIn = false;
  // }
  