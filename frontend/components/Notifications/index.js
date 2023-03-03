import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {getNotificationAlerts} from '../../store/actions/notificationActions';


class Notifications extends  React.Component {

  componentDidMount(){ 
    this.getNotifications()
  }


  getNotifications = () =>{
    this.props.getNotifications();  
  }


  render(){

        const {notifications} = this.props;
        let pageContent = '';

            pageContent = (
                notifications.map(alert => {
                    let data = (
                      <div key ={alert._id} role="alert" className="mb-5">
                        <div className="bg-gray-500 text-white font-bold rounded-t px-4 py-2 ">
                          <p className="flex justify-between">
                          <span className="font-bold text-xs">{ new Date(alert.date).toDateString()}</span>
                        </p>
                        </div>
                        <div className="border border-t-0 border-gray-500 rounded-b bg-gray-100 px-4 py-3 text-gray-700">
                          <p>{ alert.alert }.</p>
                        </div>
                      </div>
                    );
                    return data; 
                })
                
            )    
          

        return (
            <main className="flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6" >
               
               <div className="mx-auto px-4 sm:px-6 md:px-8">
                
                  <div className="py-4">
                     <div>
                        <div className="hidden sm:block">
                           <div className="border-b border-gray-200">
                              <nav className="-mb-px flex">
                                <div className="heading-font cursor-pointer whitespace-no-wrap ml-8 py-4 px-1 border-b-2 border-indigo-500 font-medium text-sm leading-5 text-indigo-600 focus:outline-none focus:text-indigo-800 focus:border-indigo-700">
                                Notifications
                                </div> 
                              </nav>
                           </div>
                        </div>
                    </div>
                    <div className="flex flex-col">

                        <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                          <div className="normal-font align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg bg-white p-5 border-b border-gray-200">
                            
                            {pageContent}
                        </div>
                    </div>


                  </div>
                </div>
               </div>
            </main>
        );
    }
}


const mapStateToProps = state => ({
   notifications: state.notifications.notifications
});

const mapDispatchToProps = dispatch => {
    return {
        getNotifications: () => dispatch( getNotificationAlerts(100) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)( withRouter( Notifications ) );