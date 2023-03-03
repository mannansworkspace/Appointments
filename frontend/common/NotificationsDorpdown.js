import React, { Component } from 'react';

import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {getNotificationAlerts, markNotificationAsSeenAction} from '../store/actions/notificationActions';

class NotificationsDorpdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            unSeenNotificationsCount : 0,
            displaySettings: 'none',
            displayAlerts : 'none',
            displayMobileMenu : 'none' ,
            activeNumber : 0
        };

        this.alertRef = React.createRef();
        this.setAlertRef = this.setAlertRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }


    componentDidMount(){
        document.addEventListener('mousedown', this.handleClickOutside);
        this.props.getAlerts();

        var intervalId = setInterval(this.props.getAlerts, 20000);
        this.setState({ intervalId: intervalId });
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        clearInterval(this.state.intervalId);
    }


    static getDerivedStateFromProps(props, state) {
        let {unSeenNotificationsCount} = props;
        
        let changedstate = {};
        let statechanged = false;

        if(JSON.stringify(state.unSeenNotificationsCount) !== JSON.stringify(unSeenNotificationsCount)){
            changedstate.unSeenNotificationsCount = unSeenNotificationsCount
            statechanged = true;
        }
  
        if(statechanged){
            return changedstate;
        }
       
        return null;
    }



    handleDisplaySettings = (value) =>{
        if(value === 'block'){
            document.addEventListener('click', this.handleClickOutside);
        }
        if(value === 'none'){
            document.removeEventListener('click', this.handleClickOutside);
        }

        this.setState({
            displaySettings: value
        });
    }

    
    handleDisplayAlerts = (value) =>{
        if(value === 'block'){
            document.addEventListener('click', this.handleClickOutside);
        }
        if(value === 'none'){
            document.removeEventListener('click', this.handleClickOutside);
        }

        this.setState({
            displayAlerts: value
        });
    }

    handleDisplayMenu = (value) =>{

        this.setState({
            displayMobileMenu : value
        });
    }


    setAlertRef = (node)=> {
        this.alertRef = node;
    }


    handleClickOutside =(event)=> {
        if (this.alertRef && !this.alertRef.contains(event.target)) {
            this.handleDisplayAlerts('none');
        }
    }
   
    showAlerts = () => {
        if(this.state.displayAlerts === 'none') {
            // this.props.unSetAletNotification()
            this.handleDisplayAlerts('block') 
        } else {
            this.handleDisplayAlerts('none') 
        }
        this.props.markNotificationAsSeen();
        this.setState({
            unSeenNotificationsCount: 0
        })
    }



    render() {
        
        return (

            <div ref={ this.setAlertRef } className="ml-3 relative" onClick={ this.showAlerts }>
                
                <button className="p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:text-gray-500 focus:bg-gray-100 transition duration-150 ease-in-out">
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    { this.state.unSeenNotificationsCount ? 
                        <span className="absolute inset-0 object-right-top -mr-6">
                        <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                        { this.state.unSeenNotificationsCount }
                        </div>
                      </span> 
                      : '' }
                </button>
            
                <div style={{display : this.state.displayAlerts, zIndex: 99999 }} className="origin-top-right absolute right-0 mt-2 w-60 rounded-md shadow-lg">
                    <div className="rounded-md bg-white shadow-xs">
                        {
                            this.props.notifications.map((alert, idx) => {
                                return(<span key={idx} className="text-left block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900">
                                    {alert.alert}
                                    
                                </span>)
                            })
                        }
                            <Link to={"/notifications"} className="block underline font-bold text-blue-600 px-4 py-2 text-sm leading-5 text-gray-700 focus:outline-none focus:bg-blue-100 focus:text-blue-900"> All Alerts</Link>
                    </div>
                </div>

            </div>

        )
    }
}


const mapStateToProps = state => ({
    notifications: state.notifications.notifications,
    unSeenNotificationsCount: state.notifications.unSeenNotificationsCount
});

const mapDispatchToProps = dispatch => {
    return {
        getAlerts: () => dispatch( getNotificationAlerts(5) ),
        markNotificationAsSeen: () => dispatch( markNotificationAsSeenAction() )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(NotificationsDorpdown);




