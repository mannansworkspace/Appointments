import React, { Component } from 'react';
import 'react-calendar/dist/Calendar.css';
import * as moment from 'moment'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    getAppointmentApi, postAppointment
    , cancelAppointment, getWeeksdays
    , markThisDateAsHolidayAction, removeHolidayAction
    , addExtraTimeSlotOnDay, removeExtraTimeSlotOnDay,
    blockedThisDateAction, removeBlockedAction,
    removeApptData
} from '../../store/actions/appointmentAction';
import BlockedAppointmentsModal from './models/BlockedAppointmentsModal';
import CancelAppointmentModel from './models/CancelAppointmentModel';
import AppointmentModel from './models/AppointmentModel';
import SuccessAppointmentModel from './models/SuccessAppointmentModel'
import SideBar from './SideBar';
import Body from './Body';
import LimitVehicleModal from './models/LimitVehicleModal';
import '../common/Slot.css';


const year = new Date().getFullYear()
const month = new Date().getMonth()
const day = new Date().getDate()

class TimeSlots extends Component {

    constructor() {
        super();
        this.state = {
            date: (new Date(`${month + 1}/${day}/${year}`)),
            timeInModel: null,
            loadTime: '',
            sideBarData: null,

            appointmentModel: false,
            blockedAppoitmentModel: false,
            successAppointmentModel: false,
            cancelAppointmentModel: false,
            limitAppointmentModal: false,
            timeFormat: ''
        }

    }

    componentDidMount() {
        const { date } = this.state;
        this.props.getAppointmentApi(date);
    }


    sidebarHandler = (item) => {
        this.setState({
            sideBarData: item
        })
    }
    static getDerivedStateFromProps(props, state) {
        const { perDayVehiclesLimit } = props.appointment;
        const { vehiclesLimit } = props.auth.user
        state.vehicleLimit = perDayVehiclesLimit ? perDayVehiclesLimit : vehiclesLimit

        return state;
    }

    appoitmentModelHandler = (timeInModel) => {
        const { perDayVehiclesLimit, bookedAppointment } = this.props.appointment;
        // const { vehiclesLimit } = this.props.auth.user

        const { vehicleLimit } = this.state
        let bookedCars;
        if (vehicleLimit) {
            bookedCars = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0)
        }
        // if(perDayVehiclesLimit ) {
        //     bookedCars = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0)
        // }
        if (this.props.blockedAppointments) {
            this.setState({
                blockedAppointmentModel: true
            })
        }
        else if (bookedCars && (bookedCars >= parseInt(vehicleLimit.vehiclesPerDay))) {
            this.setState({
                limitAppointmentModal: true
            })
        }
        else {

            this.setState((prevState) => ({
                appointmentModel: !prevState.appointmentModel,
                timeInModel
            }))
        }
    }

    removeBlockedDay = () => {
        this.closeBlockedAppoitmentModel()

        this.props.removeBlockedAction(
            moment(this.state.date).format('YYYY-MM-DD')
        );
    }

    closeBlockedAppoitmentModel = () => {
        this.setState({
            blockedAppointmentModel: false
        })
    }

    closeLimitAppointmentModal = () => {
        this.setState({
            limitAppointmentModal: false
        })
    }

    successAppointmentModelHandler = () => {
        this.setState((prevState) => ({
            successAppointmentModel: !prevState.successAppointmentModel,
        }))
    }

    cancelAppointmentModelHandler = () => {
        this.setState((prevState) => ({
            sideBarData: null,
            cancelAppointmentModel: !prevState.cancelAppointmentModel,
        }))
    }

    onAppointmentSubmit = () => {
        console.log("Submited")
        this.setState({
            appointmentModel: false,
            successAppointmentModel: true
        })
    }

    pickupDate = (date) => {
        this.setState({
            date: date
        }, () => {
            this.props.removeApptData()
            this.props.getAppointmentApi(this.state.date)
        })
    }

    render() {
        const { date, sideBarData, cancelAppointmentModel,
            appointmentModel, successAppointmentModel,
            timeInModel, blockedAppointmentModel,
            limitAppointmentModal } = this.state;

        return (
            <div>

                <SideBar
                    sidebarOpen={!!sideBarData}
                    sideBarData={sideBarData}
                    sidebarHandler={this.sidebarHandler}
                    cancelAppointmentModelHandler={this.cancelAppointmentModelHandler}
                />

                <div className="warehouse top-1-bg-white w-full mx-auto mx-6 mb-20 mx-auto mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-0 px-0 sm:px-5 sm:px-0 mx-auto px-4 sm:px-6 lg:px-15 xl:px-20">
                    <Body
                        date={date}
                        pickupDate={this.pickupDate}
                        openModel={this.appoitmentModelHandler}
                        sidebarHandler={this.sidebarHandler}
                        removeBlockedDay={this.removeBlockedDay}
                    />

                    <BlockedAppointmentsModal
                        openModel={blockedAppointmentModel}
                        closeModel={this.closeBlockedAppoitmentModel}
                        removeBlock={this.removeBlockedDay}
                    />

                    <LimitVehicleModal
                        openModel={limitAppointmentModal}
                        closeModel={this.closeLimitAppointmentModal}
                    />


                    <AppointmentModel
                        date={date}
                        openModel={appointmentModel}
                        timeInModel={timeInModel}
                        modelHandler={this.appoitmentModelHandler}
                        onSucessSubmit={this.onAppointmentSubmit}
                    />

                    <SuccessAppointmentModel
                        openModel={successAppointmentModel}
                        modelHandler={this.successAppointmentModelHandler}
                    />

                    <CancelAppointmentModel
                        openModel={cancelAppointmentModel}
                        modelHandler={this.cancelAppointmentModelHandler}
                        sideBarData={sideBarData}
                        cancelAppointment={this.props.cancelAppointment}
                    />

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    appointment: state.appointment,
    blockedAppointments: state.appointment.isBlockedFurtherAppointments
});

export default connect(mapStateToProps, { getWeeksdays, getAppointmentApi, postAppointment, cancelAppointment, markThisDateAsHolidayAction, removeHolidayAction, addExtraTimeSlotOnDay, removeExtraTimeSlotOnDay, blockedThisDateAction, removeBlockedAction, removeApptData })(withRouter(TimeSlots))