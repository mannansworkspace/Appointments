import axios from 'axios'
import { GET_ALERT_NOTIFICATIONS, MARK_NOTIFICATONS_AS_SEEN } from './types'

export const getNotificationAlerts = (limit=5) => dispatch => {
    return axios.get(process.env.REACT_APP_API_URL + '/notifications?limit=' + limit)
        .then(res => {
            dispatch({type: GET_ALERT_NOTIFICATIONS, payload: res.data});
            return true;
        })
        .catch(err => {
            console.log('Error while searching appointments for vin or lot number ', err);
            return false;
        });
}

export const markNotificationAsSeenAction = () => dispatch => {
    return axios.post(process.env.REACT_APP_API_URL + '/notifications/markNotificationsAsSeen', {})
        .then( res => {
            dispatch( {type: MARK_NOTIFICATONS_AS_SEEN} );
            return true;
        })
        .catch( err => {
            console.log('Error while marking notifications as seen', err);
            return false;
        })
}