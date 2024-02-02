import {Platform} from 'react-native';

export const ENVIRONMENT = {
  TEST: 'TEST',
  UAT: 'UAT',
  PRODUCTION: 'PROD',
}

export const getEnvironment = () => {

  return ENVIRONMENT.TEST
}

export const PlatformValue = () => {
    return Platform.OS === 'ios' ? 'iPhone' : 'android';
  }
  
  export const ServiceConstant = {
    FETCH_CHAT_FRIENDS_LIST: 'fetch_chat_friends_list',
    FETCH_CHAT_HISTORY:"fetch_chat_history",
    FETCH_SEND_CHAT:"fetch_send_chat",
    UPDATE_UNREAD_CHAT:"update_unread_chat",
    VIDEO_CALL_REJECT:"video_call_reject",
  }