import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getSingleAppointment, verifyInformationByDriver } from '../../store/actions/driverAction'
import { removeApptData } from '../../store/actions/appointmentAction'
import * as moment from 'moment';
import Loader from "react-loader-spinner";


function options(timeInModel, driver, customers, car) {
    const { bookedAppointments, perDayVehiclesLimit, appointmentData } = driver;
    const customerName = appointmentData?.customerId?.customerName

    let customerLimit;
    if (customerName) {
        let customerBookedVehicles;
        customerLimit = customers.filter(customer => customer.customerName?.replace(/ /g, '').toLowerCase() === customerName.replace(/ /g, '').toLowerCase())
        if (customerLimit[0]?.customerVehicleLimit) {
            customerBookedVehicles = bookedAppointments
                ?.filter(appt => appt._id !== appointmentData._id && appt.customerId?.customerName?.replace(/ /g, '').toLowerCase() === customerName.replace(/ /g, '').toLowerCase() && !appt.customerId.deleted)
                .reduce((a, b) => a + parseInt(b.car), 0)

            customerLimit = customerLimit.reduce((a, b) => a + parseInt(b.customerVehicleLimit), 0) - customerBookedVehicles

            if (customerLimit < 0) customerLimit = 0
        }
        else customerLimit = undefined
    }

    const currentTime = new Date(timeInModel);
    let carOptions = 9;

    // this will filter out alll appoitment except the current 
    const appt = bookedAppointments?.filter(item => item._id !== appointmentData._id)

    let limit = 0;
    let parDayTotalCarLimit = undefined;

    // this section will set limit if per day limit is set
    if (perDayVehiclesLimit) {
        limit = +perDayVehiclesLimit.vehiclesPerSlot;
        // get all booked vehicls count except current appoitment
        const totalVehicles = appt.reduce((a, b) => a + parseInt(b.car), 0)
        // total remaining par day limit
        parDayTotalCarLimit = perDayVehiclesLimit.vehiclesPerDay - totalVehicles
    }
    // this section will set default warehouse limit
    else if (appointmentData?.warehouse_id?.vehiclesLimit.status) {
        limit = appointmentData?.warehouse_id?.vehiclesLimit.vehiclesPerSlot
        // get all booked vehicls count except current appoitment
        const totalVehicles = appt.reduce((a, b) => a + parseInt(b.car), 0)
        // total remaining par day limit
        parDayTotalCarLimit = appointmentData?.warehouse_id?.vehiclesLimit.vehiclesPerDay - totalVehicles
    }

    if (limit > 0) {
        const before = new Date(timeInModel)
        before.setMinutes(currentTime.getMinutes() - 30);
        const after = new Date(timeInModel)
        after.setMinutes(currentTime.getMinutes() + 30);

        // these both will check total appitments in 30 minuts
        const beforeTime = appt.filter(item =>
            new Date(item.date).getTime() > before.getTime() &&
            new Date(item.date).getTime() <= currentTime.getTime()
        ).reduce((a, b) => a + parseInt(b.car), 0)

        const afterTime = appt.filter(item =>
            new Date(item.date).getTime() < after.getTime() &&
            new Date(item.date).getTime() >= currentTime.getTime()
        ).reduce((a, b) => a + parseInt(b.car), 0)

        // this will save remaining limit for 30 mint window
        const parHalfHourLimit = limit - Math.max(beforeTime, afterTime);

        carOptions = parDayTotalCarLimit ? Math.min(parHalfHourLimit, parDayTotalCarLimit) : parHalfHourLimit;
    }

    if (+carOptions > customerLimit) return customerLimit

    return +carOptions
}

class DriverInfo extends Component {
    constructor(props) {
        super(props)
        const { id } = this.props.match.params || new URLSearchParams(this.props.location.search).get("id")

        this.state = {
            id,
            onlineBooked: id ? false : true,
            appointmentData: null,
            driverName: '',
            driverCar: '',
            driverNumber: '',
            driverEmail: '',
            cancelAppointment: false,
            timeSlot: '',
            numberOfVehicles: null,
            warehouse: {},
            errors: {},
            customerName: ''
        }
    }

    componentDidMount() {

        const { id, onlineBooked } = this.state
        if (!onlineBooked)
            this.props.getSingleAppointment(id)
        else
            this.props.removeApptData()
    }

    static getDerivedStateFromProps(props, state) {
        const { appointmentData } = props.driver;
        const { warehouse, timeSlot, numberOfCar, customerName } = props.appointment;

        if (appointmentData && JSON.stringify(appointmentData) !== JSON.stringify(state.appointmentData)) {
            state.appointmentData = appointmentData;
            state.driverName = appointmentData.company_name;
            state.driverNumber = appointmentData.number?.replace('+1', '');
            state.driverCar = appointmentData.car;
            state.cancelAppointment = appointmentData.cancelAppointment;
            state.warehouse = appointmentData.warehouse_id
            state.timeSlot = appointmentData.date;
        }

        if (state.onlineBooked && JSON.stringify(warehouse) !== JSON.stringify(state.warehouse)) {
            state.warehouse = warehouse
            state.timeSlot = timeSlot
            state.driverCar = numberOfCar;
            state.customerName = customerName
        }

        state.numberOfVehicles = options(appointmentData.date, props.driver, props.customers, +state.driverCar)

        return state;
    }

    componentDidUpdate(props, state) {
        if (state.appointmentData?.page > 1) {
            props.history.push(`/driver-detail/${state.id}`)
        }

    }

    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    submitHandler = (e) => {
        this.setState({ errors: {} })
        e.preventDefault()

        if (this.errorHandler()) {
            return;
        }
        else {

            const data = {
                email: this.state.driverEmail,
                company_name: this.state.driverName,
                number: this.state.driverNumber,
                onlineBooked: this.state.onlineBooked,
                car: this.state.driverCar,
                id: this.state.appointmentData._id
            }

            this.props.verifyInformationByDriver(data)
            if (this.state.onlineBooked) {
                this.props.history.push('/driver-detail')
            }
            else {
                this.props.history.push(`/driver-detail/${this.state.id}`)
            }
        }
    }

    errorHandler = () => {
        const error = {}
        if (!this.state.driverName || this.state.driverName?.length === 0) {
            error['driverName'] = "Name field is empty"
        }

        if (!this.state.driverNumber || this.state.driverNumber?.length === 0) {
            error['driverNumber'] = "Phone field is empty"
        }

        this.setState({
            errors: error
        })

        return (Object.keys(error).length);
    }

    render() {
        const { warehouse, timeSlot, cancelAppointment, driverName, driverCar, driverNumber, driverEmail, onlineBooked, errors, numberOfVehicles } = this.state

        return (
            <div className="p-3">
                {this.props.driver.isLoading ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    <>
                        <div className="h-16" ></div>
                        {cancelAppointment ?
                            <div className="bg-gray-100">
                                <div className="max-w-7xl mx-auto py-6 px-2 smpx-6 lg:px-8">
                                    <div className="max-w-none mx-auto">
                                        <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
                                            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                                <div className="flex justify-center mb-3 items-center">

                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-center text-gray-900 text-lg font-medium">Your appointment is cancelled. For more information contact {warehouse.company_name} (warehouse) </span>
                                                </div>
                                                <div className="text-center text-black text-sm">
                                                    Appointment with {warehouse.company_name}
                                                </div>
                                                <div className="text-center text-gray-700 text-base"> {moment(timeSlot).format("h:mm a on dddd MM/DD/YYYY")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="text-left text-black mb-2 font-bold">
                                    Appointment with {warehouse?.company_name}
                                </div>
                                <div className="text-left text-gray-700">{moment(timeSlot).format("h:mm a on MM/DD/YYYY")}</div>
                                <div className="text-left font-medium text-black mt-10 mb-5">Please verify your information</div>
                                <form onSubmit={this.submitHandler}>
                                    <div className="w-full px-2 mb-4">
                                        <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Company name:</label>
                                        <div className="mt-1">
                                            <input onChange={this.onChangeHandler} value={driverName} type="text" name="driverName" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="ABC Towing" />
                                            <span className="text-left block font-normal text-xs text-red-400">{errors && errors.driverName}</span>
                                        </div>
                                    </div>
                                    <div className="w-full px-2 mb-4">
                                        <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Cell phone#:</label>
                                        <div className="mt-1 relative">
                                            <span style={{ background: '#eee', height: '36px', width: '40px', lineHeight: '38px', top: '1px', left: '1px', borderRadius: '6px 0px 0px 6px', position: 'absolute' }}>+1</span>
                                            <input onChange={this.onChangeHandler} value={driverNumber} type="text" pattern="^[0-9]*$" maxLength="10" minLength="10" name="driverNumber" style={{ paddingLeft: '45px' }} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                            <span className="text-left block font-normal text-xs text-red-400">{errors && errors.driverNumber}</span>
                                        </div>
                                    </div>

                                    <div className="w-full px-2 mb-4">
                                        <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Email:</label>
                                        <div className="mt-1">
                                            <input onChange={this.onChangeHandler} value={driverEmail} type="email" name="driverEmail" className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="user@email.com" />
                                        </div>
                                    </div>

                                    {!onlineBooked &&
                                        <div className="w-6/12 px-2 mb-4 relative">
                                            <label htmlFor="driverCar" className="text-left block text-sm font-normal text-gray-900">How many cars?</label>
                                            <span className="absolute inset-y-0 right-3 top-10 flex items-center pointer-events-none h-8 w-7 bg-white pr-0 rounded mt-7">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                                </svg>
                                            </span>
                                            <select
                                                onChange={this.onChangeHandler}
                                                value={driverCar}
                                                name="driverCar"
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                            >
                                                {numberOfVehicles >= 0 && (
                                                    Array(numberOfVehicles).fill().map((option, i) =>
                                                        <option key={i} id={i} value={i + 1}>{i + 1}</option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    }
                                    <br />
                                    <br />
                                    <br />

                                    <div className="left-0 w-full h-20">
                                        <button disabled={warehouse?._id ? false : true} type="submit" className="left-0 right-0 bottom-5 w-5/12 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            NEXT
                                        </button>
                                    </div>
                                </form>
                            </div>

                        }
                    </>
                )}

            </div>
        )
    }
}
const mapStateToProps = state => ({
    driver: state.driver,
    appointment: state.appointment,
    customers: state.customers.customers
});
export default connect(mapStateToProps, { getSingleAppointment, verifyInformationByDriver, removeApptData })(withRouter(DriverInfo))
