import {Platform} from 'react-native';
import { ServiceConstant } from './ServiceAPI';
import { ServiceUrl } from './ServiceURL';

import axios from 'axios';
const getNWError = () => {
    //const {t, i18n} = useTranslation();
    //t('lbl-Something-went-wrong-Please-try-again-later')
  
    return {
      status: false,
      errorCode: 500,
      msg: 'Something went wrong. Please try again later.',
    };
  };
export const callApi = async (type, param = null, showError = false) => {
    switch (type) {
        case ServiceConstant.FETCH_CHAT_FRIENDS_LIST:
            try {
            //  const userDatach = await getUser();
      
              let reqUrlCH = ServiceUrl(type);
               reqUrlCH = reqUrlCH.replace('{USER_ID}', "2713882");
               reqUrlCH = reqUrlCH.replace('{AUTH_ID}', "a9892c654fc28f6c5965d769b8a8ca40");
      
              const response = await fetch(reqUrlCH);
      
              const json = await response.json();
      
              return json;
            } catch (error) {
              if (__DEV__) console.log(type, ' ==> ', error);
      
              return getNWError();
            }
            break;
            case ServiceConstant.FETCH_CHAT_HISTORY:
                try {
                   
                //  const user = await getUser()
          
                    const headers = {
                      'Content-Type': 'application/json',
                      Accept: 'application/json',
                    }
          
                    let url = ServiceUrl(type)
          
                    if(__DEV__) { console.log(type + " =====>>>>", url, param)}
          
                    const response = await axios.post(ServiceUrl(type), param, {
                      headers,
                    });
                    // const response = await axios.post(url, body, {
                    //   headers,
                    //   //timeout: 30000,
                    // })
          
                    const data = await response.data;
          
                    return data
                }
                catch(e){
          
                  if(__DEV__)    console.log(type, " ==> ", e);
                  return getNWError();
                }
                break
                case ServiceConstant.FETCH_SEND_CHAT:
                    try {
                      //  const user = await getUser()
              
                        const headers = {
                          'Content-Type': 'application/json',
                          Accept: 'application/json',
                        }
              
                        let url = ServiceUrl(type)
              
                        if(__DEV__) { console.log(type + " =====>>>>", url, param)}
              
                        const response = await axios.post(ServiceUrl(type), param, {
                          headers,
                        });
                        // const response = await axios.post(url, body, {
                        //   headers,
                        //   //timeout: 30000,
                        // })
              
                        const data = await response.data;
              
                        return data
                    }
                    catch(e){
              
                      if(__DEV__)    console.log(type, " ==> ", e);
                      return getNWError();
                    }
                    break
      
    }
}