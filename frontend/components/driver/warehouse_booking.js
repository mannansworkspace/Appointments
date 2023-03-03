import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import StickyBox from "react-sticky-box";
import * as moment from 'moment'
import DateInput from './DateInput';
import AllSlotsSession from './AllSlots';
import { getWarehouseAppointmentDetailsByDomainName, removeApptData } from '../../store/actions/appointmentAction';
import { searchCustomer, clearCustomerList } from '../../store/actions/customersAction';
import chevronExpand from '../../assets/svgs/chevron-expand.svg';
import Loader from "react-loader-spinner";
import { createKey } from '../../utils/CustomerKeyCreator'

class WarehouseBooking extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: '',
            date: null,
            warehouse_domain: props.match.params.warehouse_domain,
            carOptions: 9,
            numberOfCar: '',
            onlineApptDays: null,
            customerName: '',
            showCustomerAutofill: true
        }
    }

    options = (customerName) => {


        const { bookedAppointment, perDayVehiclesLimit } = this.props.appointment;
        const { customers } = this.props
        const { vehiclesLimit } = this.props.warehouse;
        // use per day limit over default limit
        const vehicleLimit = perDayVehiclesLimit ? { ...perDayVehiclesLimit, status: true } : vehiclesLimit

        const { vehiclesPerDay, vehiclesPerSlot, status } = vehicleLimit
        // find selected customer
        const customer = customerName ? customers.find(customer => customer.key === createKey(customerName)) : null

        const customerBookedVehicles = bookedAppointment
            ?.filter(appt => appt.customerId?._id === customer?._id && !appt.customerId.deleted)
            .reduce((a, b) => a + parseInt(b.car), 0)
        const customerLimit = (customer && customer.customerVehicleLimit) ? customer.customerVehicleLimit - customerBookedVehicles : 9
        const totalVehicles = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0);
        const limit = status ? Math.min(vehiclesPerSlot, vehiclesPerDay - totalVehicles, customerLimit) : customerLimit;
        return this.setState({
            carOptions: limit
        })
    }


    static getDerivedStateFromProps(props, state) {

        const { showCustomerAutofill } = props.warehouse;

        state.showCustomerAutofill = showCustomerAutofill

        return state;
    }

    componentDidMount() {
        this.props.getWarehouseAppointmentDetailsByDomainName(this.state.warehouse_domain, this.state.date, this.props.history);
    }

    pickupDate = (date) => {
        this.setState({
            date: date
        }, () => {
            this.props.removeApptData()
            this.props.getWarehouseAppointmentDetailsByDomainName(this.state.warehouse_domain, this.state.date, this.props.history);
        })
    }

    searchCustomer = value => {

        const data = {
            name: value,
            id: this.props.warehouse?._id
        }
        this.props.searchCustomer(data);
    }

    onBlurHandler = () => {
        setTimeout(() => {
            this.props.clearCustomerList()
        }, 5000)
    }

    selectCustomer = (customer) => {
        this.setState({
            customerName: customer.customerName,
        }, (
            this.options(customer.customerName)
        )
        )

        this.props.clearCustomerList();
    }

    onChangeHandler = (e) => {

        if (e.target.name === 'customerName' && this.state.showCustomerAutofill) {
            this.searchCustomer(e.target.value)
        }

        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {

        const { company_name, address, city, state, zip_code, number, onlineApptDays, ApptStartingFrom } = this.props.warehouse;
        const { date, numberOfCar, carOptions, customerName } = this.state;
        const { isMarkedAsHoliday, blockedAppointments, customerList } = this.props

        return (
            <div className="top-1-bg-white w-full mx-auto mx-6 mb-20 mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 px-3 sm:px-0 px-0 sm:px-5 sm:px-0 mx-auto px-4 sm:px-6 lg:px-15 xl:px-20 mt-16">
                {this.props.warehouseLoader ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    <>
                        <div className="h-12"></div>
                        <div className="text-left md:w-2/5 lg:w-1/5 text-center border-b-2 pb-4">
                            <div className="font-semibold text-lg text-black ">{company_name}</div>
                            <div className="text-black text-sm">{address}<br /> {city}, {state} {zip_code}</div>
                            <div className="text-black text-sm">Tel: {number}</div>
                        </div>

                        <div className="md:w-2/5 lg:w-1/5 md:mr-5 lg:mr-0 mb-5 md:mb-0 z-0">
                            <label htmlFor="cars" className="px-2 text-left block text-sm font-normal text-gray-900">Pick a date & time: </label>
                            <StickyBox className="hidden sm:block">
                                <div className="h-2"></div>
                                <DateInput
                                    className="hidden sm:block"
                                    setDate={this.pickupDate}
                                    driver_appintment="true"
                                    onlineApptDays={onlineApptDays}
                                    ApptStartingFrom={ApptStartingFrom}
                                />
                            </StickyBox>

                            <div className="block sm:hidden md:hidden lg:hidden h-72">
                                <DateInput
                                    setDate={this.pickupDate}
                                    driver_appintment="true"
                                    onlineApptDays={onlineApptDays}
                                    ApptStartingFrom={ApptStartingFrom}
                                />
                            </div>
                        </div>

                        {date &&
                            <div className="border-0 md:flex">
                                <div className="md:w-2/5 lg:w-1/5 px-2 sm:mt-72 mb-4 ">
                                    <div className="border-0 md:flex">
                                        <div className="px-2 mb-4 ">
                                            <label htmlFor="customerName" className="block text-left text-sm font-normal text-gray-900 mt-5">Shipper / Broker (as per dispatch sheet)</label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    onBlur={this.onBlurHandler}
                                                    onChange={this.onChangeHandler}
                                                    value={customerName}
                                                    name="customerName"
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm border-gray-300 rounded-md"
                                                />
                                            </div>

                                            <ul className="shadow rounded absolute bg-white z-50 w-90 sm:col-span-12 cursor-pointer">

                                                {customerList && customerList.map((customer, index) =>
                                                    <li key={{ index }} onClick={() => this.selectCustomer(customer)} className="flex justify-between p-2 hover:bg-gray-100 border-solid border-b border-gray-200 w-60">

                                                        <span>
                                                            <b>
                                                                {customer.customerName}
                                                            </b>
                                                        </span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {!!customerName.length && (
                                        <div>
                                            <label htmlFor="cars" className="text-left block text-sm font-normal text-gray-900">How many cars are you delivering?</label>

                                            <div className="mt-1 block w-1/2 py-2 relative">
                                                <span className="absolute inset-y-0 right-1 mt-1 top-3 flex items-center pointer-events-none h-8 w-7 bg-white pr-0 rounded">
                                                    <img src={chevronExpand} className="h-5 w-5 text-gray-400" alt="chevronExpand" />
                                                </span>
                                                <select
                                                    required
                                                    onChange={this.onChangeHandler}
                                                    value={numberOfCar}
                                                    name="numberOfCar"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                >
                                                    <option></option>
                                                    {Array(carOptions).fill(0).map((option, i) =>
                                                        <option key={i} id={i} value={i + 1}>{i + 1}</option>
                                                    )}

                                                </select>
                                            </div>
                                        </div>
                                    )}

                                </div>
                                <div className="md:w-3/5 lg:w-4/5 z-0 main-content-warehouse relative">

                                    {carOptions > 0 ? (

                                        <>
                                            {numberOfCar && (

                                                <div className="lg:flex justify-between">

                                                    <div className="lg:pl-9">
                                                        {this.props.isLoading ? (
                                                            <Loader className="absolute top-1/2 left-0 right-0 mx-auto"
                                                                type="Puff"
                                                                color="#00BFFF"
                                                                style={{ width: '80px' }}
                                                            />
                                                        ) : (

                                                            <>
                                                                <StickyBox style={{ background: '#f3f4f6', zIndex: '9', paddingBottom: '10px' }}>
                                                                    <div className="h-4"></div>
                                                                    <h2 className="sm:text-sm md:text-xl leading-7 text-gray-900 sm:truncate text-left mt-4">
                                                                        Available times for <span className="font-bold"> {moment(date).format('dddd, MMM D')}:</span>
                                                                    </h2>
                                                                </StickyBox>
                                                                {!blockedAppointments ? (
                                                                    <div>
                                                                        {!isMarkedAsHoliday ?
                                                                            <>
                                                                                <AllSlotsSession
                                                                                    date={date}
                                                                                    numberOfCar={numberOfCar}
                                                                                    customerName={customerName}
                                                                                />
                                                                            </>
                                                                            :
                                                                            <>
                                                                                <div className="md:ml-48 lg:ml-64 mt-20">
                                                                                    <div className="mb-2 md:w-56">
                                                                                        <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 md:w-full justify-center text-center">Marked as holiday</div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-full">
                                                                            <h4 className="text-left">The warehouse has blocked further appointments for this date. Please select another date.</h4>
                                                                        </div>
                                                                    </>
                                                                )}

                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-full">
                                                <h4 className="text-left md:ml-4 md: mt-4">The customer has reached the vehicle limit for this date. Please select another date.</h4>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        }
                    </>
                )}
            </div>
        )
    }
}


const mapStateToProps = state => ({
    warehouse: state.appointment.warehouse,
    user: state.auth.user,
    appointment: state.appointment,
    perDayVehiclesLimit: state.appointment.perDayVehiclesLimit,
    isMarkedAsHoliday: state.appointment.isMarkedAsHoliday,
    blockedAppointments: state.appointment.isBlockedFurtherAppointments,
    isLoading: state.appointment.isLoading,
    warehouseLoader: state.appointment.warehouseLoader,
    customerList: state.customers.customersList,
    customers: state.customers.customers,
    bookedAppointment: state.appointment.bookedAppointment,
});

export default connect(mapStateToProps, { getWarehouseAppointmentDetailsByDomainName, removeApptData, searchCustomer, clearCustomerList })(withRouter(WarehouseBooking))
