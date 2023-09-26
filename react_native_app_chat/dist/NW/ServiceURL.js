import { getEnvironment, ServiceConstant } from "./ServiceAPI";


export const ServiceConfig = {
    TEST: {
      BASE_URL_LIFERAY:"https://testeem.abpweddings.com",
      BASE_URL_SOF: 'https://softestweb.abpweddings.com',
   
      BASE_URL_FILE_UPLOAD: 'https://testdl.abpweddings.com',
      BASE_URL_IMAGE: 'https://testcdn.abpweddings.com',
     BASE_CHAT :"https://chatqa.abpweddings.com:6001/api"
    },
  
    UAT: {
      BASE_URL_LIFERAY:"https://testeem.abpweddings.com",
      BASE_URL_SOF: 'https://sofuat.abpweddings.com',
   
       BASE_URL_FILE_UPLOAD: 'https://uatdl.abpweddings.com:8443',
      BASE_URL_IMAGE: 'https://testcdn.abpweddings.com',
      BASE_CHAT :"https://chatqa.abpweddings.com:6001/api"
    },
  
    PROD: {
      BASE_URL_LIFERAY :"https://testeem.abpweddings.com",
      BASE_URL_SOF: 'https://sof.abpweddings.com',
      BASE_URL_FILE_UPLOAD: 'https://dl.abpweddings.com',
      BASE_URL_IMAGE: 'https://media.abpweddings.com',
      BASE_CHAT :"https://chatqa.abpweddings.com:6001/api"
     },
  };
export const getImageUrl = path => {
    let envVal = getEnvironment(); //ENVIRONMENT.PRODUCTION;
  
    const base = ServiceConfig[envVal];
  
    return base.BASE_URL_IMAGE + path;
  };

  const ServiceApi = {
    FETCH_CHAT_FRIENDS_LIST_URL:
    '/api/jsonws/abpmapp-v2-service-portlet.userchat/get-user-chat-friend-list/user-id/{USER_ID}/auth-id/{AUTH_ID}',
    //'/api/jsonws/abpmapp-v2-service-portlet.userchat/get-user-chat-friend-list/user-id/2713882/auth-id/a9892c654fc28f6c5965d769b8a8ca40',
    FETCH_CHAT_HISTORY_URL:
    '/message/getmsg',
    FETCH_SEND_CHAT_URL:'/message/addmsg'

  }
  export default ServiceApi;

  export const ServiceUrl = serviceConstant => {

    let envVal = getEnvironment();

  const base = ServiceConfig[envVal];

  
  let url = null;

  switch (serviceConstant) {
    case ServiceConstant.FETCH_CHAT_FRIENDS_LIST:
      url = base.BASE_URL_LIFERAY +ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
      break;
      case ServiceConstant.FETCH_CHAT_HISTORY:
      url = base.BASE_CHAT +ServiceApi.FETCH_CHAT_HISTORY_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
      break;
      case ServiceConstant.FETCH_SEND_CHAT:
        url = base.BASE_CHAT +ServiceApi.FETCH_SEND_CHAT_URL //base.BASE_URL_SOF + ServiceApi.FETCH_CHAT_FRIENDS_LIST_URL;
        break;
  }
  return url;
}