import {Platform} from 'react-native';
import { ServiceConstant } from './ServiceAPI';
import { ServiceUrl } from './ServiceURL';


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
            const headers = {
              'Content-Type': 'application/json',
              Accept: "application/json"
             
            }
            const body=JSON.stringify(param)
              let reqUrlCH = ServiceUrl(type);
              var requestOptions = {
                method: 'POST',
                headers: headers,
                redirect: 'follow',
                body:body
            };
           
            if(__DEV__) { console.log(type + " =====>>>>", reqUrlCH, param)}
              
            const response = await fetch(reqUrlCH, requestOptions)
           
               if(__DEV__) { console.log("response",response)}
          
        const data = await response.json();

              if(__DEV__) { console.log("data",data)}
          
             
              return data;
            } catch (error) {
              if (__DEV__) console.log(type, 'eeroor ==> ', error);
              
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
          
                    const body=JSON.stringify(param)
                    let reqUrlCH = ServiceUrl(type);
                    var requestOptions = {
                      method: 'POST',
                      headers: headers,
                      redirect: 'follow',
                      body:body
                  };
                  if(__DEV__) { console.log(type + " =====>>>>", reqUrlCH, param)}
                    
                  const response = await fetch(reqUrlCH, requestOptions)
                   if(__DEV__) { console.log(type + " =====>>>>", response)}
          
                    const data = await response.json();
            
                    return data
                }
                catch(e){
          
                  if(__DEV__)    console.log(type, "error ==> ", e);
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
                        const body=JSON.stringify(param)
                        let reqUrlCH = ServiceUrl(type);
                        var requestOptions = {
                          method: 'POST',
                          headers: headers,
                          redirect: 'follow',
                          body:body
                      };
                      if(__DEV__) { console.log(type + " =====>>>>", reqUrlCH, param)}
                        
                      const response = await fetch(reqUrlCH, requestOptions)
                   
                   
                        const data = await response.json();
                
                        return data
                    }
                    catch(e){
              
                      if(__DEV__)    console.log(type, " ==> ", e);
                      return getNWError();
                    }
                    break
                    case ServiceConstant.UPDATE_UNREAD_CHAT:
                      try {
                        //  const user = await getUser()
                
                          const headers = {
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                          }
                
                          const body=JSON.stringify(param)
                          let reqUrlCH = ServiceUrl(type);
                          var requestOptions = {
                            method: 'POST',
                            headers: headers,
                            redirect: 'follow',
                            body:body
                        };
                        if(__DEV__) { console.log(type + " =====>>>>", reqUrlCH, param)}
                          
                        const response = await fetch(reqUrlCH, requestOptions)
                     
                     
                        const data = await response.json();
                
                        return data
                      }
                      catch(e){
                
                        if(__DEV__)    console.log(type, " ==> ", e);
                        return getNWError();
                      }
                      break
        
                      case ServiceConstant.VIDEO_CALL_REJECT:
                        try {
                  
                            const headers = {
                              'Content-Type': 'application/json',
                              Accept: 'application/json',
                            }
                            //let url = ServiceUrl(type)
                            const body=JSON.stringify(param)
                            let reqUrlCH = ServiceUrl(type);
                            var requestOptions = {
                              method: 'POST',
                              headers: headers,
                              redirect: 'follow',
                              body:body
                          };
                            if(__DEV__) { console.log(type + " =====>>>>", reqUrlCH, param)}
                            const response = await fetch(reqUrlCH, requestOptions)
                     
                            // const response = await axios.post(url, param, {
                            //   headers,
                            //   timeout: 60000,
                            // })
                  
                           // if(__DEV__) { console.log(type + " =====>>>>", response)}
                  
                           const data = await response.json();
                
                        return data
                        }
                        catch(e){
                  
                          if(__DEV__)    console.log(type, " ==> ", e);;
                          return getNWError();
                        }
                        break
                  
   
                    }
}