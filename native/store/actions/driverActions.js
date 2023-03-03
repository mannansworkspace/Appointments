import axios from 'axios';
import {backendURL} from '@env';

export const setNotificationToken = (Pushtoken) => async dispatch => {
    
    try{
        await axios.post(backendURL + '/driver/set-notificationtoken', {Pushtoken })
    }   
    catch(err){
        console.log('/set-notificationtoken error : ',err.response )
    }
      
};
