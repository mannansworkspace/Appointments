import { GET_ALERT_NOTIFICATIONS, MARK_NOTIFICATONS_AS_SEEN } from '../actions/types';
const initialState = {
    notifications: [],
    unSeenNotificationsCount: 0
};

const notificationReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALERT_NOTIFICATIONS:
            return {
                notifications: action.payload.notifications,
                unSeenNotificationsCount: action.payload.unSeenNotificationsCount
            };

        case MARK_NOTIFICATONS_AS_SEEN:
            return {
                ...state,
                unSeenNotificationsCount: 0
            }

        default: 
            return state;
    }
}


export default notificationReducer;