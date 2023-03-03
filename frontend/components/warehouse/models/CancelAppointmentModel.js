import React, { Component } from 'react'
import * as moment from 'moment'
import { cancelAppointment } from '../../../store/actions/appointmentAction';
import { cancelDriverAppointment } from '../../../store/actions/driverAction';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

class CancelAppointmentModel extends Component {

    constructor() {
        super();
        this.state = {
            sideBarData: null,
            cancelByDriver: false
        }

    }

    static getDerivedStateFromProps = (props, state) => {
        if (props.sideBarData !== null) {
            state.sideBarData = props.sideBarData
            state.cancelByDriver = props.cancelByDriver
        }

        return state
    }

    cancelAppointmentHandler = async() => {

        const { sideBarData, cancelByDriver } = this.state
        console.log({ sideBarData })
        const data = {
            id: sideBarData._id,
            name: sideBarData.company_name,
            time: sideBarData.time_slot,
            date: sideBarData.date,
        }
        let response;
        if (cancelByDriver)
            response = await this.props.cancelDriverAppointment(data)
        else
            response = await this.props.cancelAppointment(data)

        if (response) {
            this.props.modelHandler()
        }
    }


    render() {
        const { openModel, modelHandler } = this.props;
        const { sideBarData, cancelByDriver } = this.state;
        console.log({sideBarData})
        return (
            <div style={{ display: openModel ? "" : 'none' }} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                        <div className="sm:flex sm:items-start">
                            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Cancel appointment
                                </h3>
                                <div className="mt-2">
                                    {
                                        cancelByDriver ?
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to cancel the appointment?. You will lose your time-slot.
                                            </p>
                                            :
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to cancel the {sideBarData && moment(sideBarData.date).format('hh:mm A')} appointment for {sideBarData?.company_name}?
                                            </p>
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                                onClick={this.cancelAppointmentHandler}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-nomral text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                                Cancel appointment
                            </button>
                            <button
                                onClick={modelHandler}
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-nomral text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                                {cancelByDriver ? 'Keep Appt' : 'Dismiss'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}


export default connect(null, { cancelAppointment, cancelDriverAppointment })(withRouter(CancelAppointmentModel));