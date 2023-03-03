import { combineReducers } from 'redux';
import auth from './auth'
import appointment from './appointmentReducer'
import superadminAuthReducer from './superadmin-authReducer';
import superadminDashboardReducer from './superadmin-DashboardReducer';
import DriverReducer from './driverReducer'
import WarehouseReducer from './warehouseReducer';
import NotificationReducer from './notificationReducer';
import customersReducer from './customersReducer';

export default combineReducers({
    auth: auth,
    superAdminAuth: superadminAuthReducer,
    appointment: appointment,
    superAdminDashboard: superadminDashboardReducer,
    driver: DriverReducer,
    warehouse: WarehouseReducer,
    notifications: NotificationReducer,
    customers: customersReducer
})