import { getEnvironment, ServiceConstant } from "./ServiceAPI";


export const ServiceConfig = {
    TEST: {
      BASE_URL_SOF: 'https://softestweb.abpweddings.com',
   
      BASE_URL_FILE_UPLOAD: 'https://testdl.abpweddings.com',
      BASE_URL_IMAGE: 'https://testcdn.abpweddings.com',
     BASE_CHAT :"https://messageserviceqa.abpweddings.com", //"http://messageserviceqa.abpweddings.com:8083"
     BASE_DEFAULT_IMAGE_URL :"https://testcdn.abpweddings.com",
     
    },
  
    UAT: {
      BASE_URL_SOF: 'https://sofuat.abpweddings.com',
   
       BASE_URL_FILE_UPLOAD: 'https://uatdl.abpweddings.com:8443',
      BASE_URL_IMAGE: 'https://testcdn.abpweddings.com',
      BASE_CHAT :"https://messageserviceqa.abpweddings.com", //"http://messageserviceqa.abpweddings.com:8083"
      BASE_DEFAULT_IMAGE_URL :"https://testcdn.abpweddings.com"
    },
  
    PROD: {
      BASE_URL_SOF: 'https://sof.abpweddings.com',
      BASE_URL_FILE_UPLOAD: 'https://dl.abpweddings.com',
      BASE_URL_IMAGE: 'https://media.abpweddings.com',
      BASE_CHAT :"https://messegingservice.abpweddings.com",
      BASE_DEFAULT_IMAGE_URL :"https://cdn.abpweddings.com",
     },
  };

  export const getDefaultImageUrl = (genderId) => {
    let envVal = getEnvironment();
    const base = ServiceConfig[envVal];

    const defaultImageUrl =
     genderId == "male" || genderId == undefined
       ?base.BASE_DEFAULT_IMAGE_URL + '/application-images/imagefemale.jpg'
       : base.BASE_DEFAULT_IMAGE_URL +  '/application-images/imagemale.jpg'
    ;

    return defaultImageUrl;

  }

export const getImageUrl = (path,genderId) => {
  
    let envVal = getEnvironment(); //ENVIRONMENT.PRODUCTION;
  
    const base = ServiceConfig[envVal];
   // console.log("path??",genderId)
   const defaultUrl =
   path != null
     ? genderId == "male" ||genderId == undefined
       ?base.BASE_DEFAULT_IMAGE_URL + '/application-images/imagefemale.jpg'//getImageUrl('/documents/images/image-Female.jpg')
       : base.BASE_DEFAULT_IMAGE_URL +  '/application-images/imagemale.jpg'///getImageUrl('/documents/images/image-Male.jpg')
     : '';

     let lrservice='https://lrservice.abpweddings.com';
     let pattern='/documents/20181';

     if(path != null){
      if(path.indexOf('https') > -1){ // if host already found
        return path;
        }
        else if( path.indexOf(pattern) > -1 ){
          return lrservice + path;
        }else{
            return base.BASE_URL_IMAGE + path;
        }
     }
     else{
        return defaultUrl;
     }
     

    //const imageUrl = path != null ? base.BASE_URL_IMAGE + path : defaultUrl;



    //return imageUrl //base.BASE_URL_IMAGE + path;
  };

  const ServiceApi = {
    FETCH_CHAT_FRIENDS_LIST_URL:
    '/messegingservice/user/chat/getUsersFriendList',
    //'/api/jsonws/abpmapp-v2-service-portlet.userchat/get-user-chat-friend-list/user-id/2713882/auth-id/a9892c654fc28f6c5965d769b8a8ca40',
    FETCH_CHAT_HISTORY_URL:
    '/messegingservice/user/chat/usersSpecificChathistory',
    FETCH_SEND_CHAT_URL:'/messegingservice/user/chat/usersFriendListUpdation',
    UPDATE_UNREAD_CHAT_URL:"/messegingservice/user/chat/updateunreadCount",
    VIDEO_CALL_REJECT_URL:'/messegingservice/user/chat/videocallrejection'
  }
  export default ServiceApi;

  export const ServiceUrl = serviceConstant => {

    let envVal = getEnvironment();

  const base = ServiceConfig[envVal];

  
  let url = null;

  switch (serviceConstant) {
    case ServiceConstant.FETCH_CHAT_FRIENDS_LIST:
      url = base.BASE_CHAT +ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
      break;
      case ServiceConstant.FETCH_CHAT_HISTORY:
      url = base.BASE_CHAT +ServiceApi.FETCH_CHAT_HISTORY_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
      break;
      case ServiceConstant.FETCH_SEND_CHAT:
        url = base.BASE_CHAT +ServiceApi.FETCH_SEND_CHAT_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
        break;
        case ServiceConstant.UPDATE_UNREAD_CHAT:
          url = base.BASE_CHAT +ServiceApi.UPDATE_UNREAD_CHAT_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
          break;
          case ServiceConstant.VIDEO_CALL_REJECT:
      url = base.BASE_CHAT + ServiceApi.VIDEO_CALL_REJECT_URL;

      break;
  }
  return url;
}