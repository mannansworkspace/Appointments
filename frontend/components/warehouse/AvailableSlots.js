import React, { Component } from 'react'
import * as moment from 'moment'

class AvailableSlots extends Component {
    render() {
        const { availableAppointment } = this.props.value
        return (
            <div className="time-slot-tabs mt-5">
                {availableAppointment && availableAppointment.length ? availableAppointment.map((item, key) => {
                    return <div className="flex items-center mb-4">
                        <div className="h-14 w-56 bg-indigo-600 text-white relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-2">
                            <div className="flex-shrink-0">
                            </div>
                            <div className="time-section text-center ml-0 w-full">
                                <span className="absolute inset-0" aria-hidden="true"></span>
                                <p className="text-sm font-semibold text-white">
                                    {moment(item.date).format('hh:mm A')}
                                </p>
                            </div>
                        </div>
                    </div>
                }) : <h4>No Available Slot are Available.</h4>}
            </div>
        )
    }
}

export default AvailableSlots
