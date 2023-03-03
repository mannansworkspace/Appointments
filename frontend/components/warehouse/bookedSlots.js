import React, { Component } from 'react'
import * as moment from 'moment'

class bookedSlots extends Component {
    render() {
        const { bookedAppointment } = this.props.value
        return (
            <div className="time-slot-tabs mt-5">
                {bookedAppointment && bookedAppointment.length ? bookedAppointment.map((item, key) => {
                    return <div key={key} className="flex items-center mb-4">
                        <div className="h-14 w-56 relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-2 cursor-pointer">
                            {item.status ? <div className="flex-shrink-0">
                                <svg className={item.status ? item.check_out ? "w-6 h-6 text-green-600" : "w-6 h-6 text-gray-500" : "text-gray-500 w-6 h-6"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                                :
                                <div className="flex-shrink-0">
                                    <svg className="text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            }

                            <div className="time-section text-center ml-0 w-full">
                                <span className="absolute inset-0" aria-hidden="true"></span>
                                <p className="text-sm font-normal text-gray-700">
                                    {moment(item.date).format('hh:mm A')}
                                </p>
                                <p className="text-sm text-gray-700 truncate">
                                    {item.car} vehicle
                                </p>
                            </div>
                        </div>
                    </div>
                }) : <h4>No Booking is Avaiable</h4>}
            </div>
        )
    }
}

export default bookedSlots
