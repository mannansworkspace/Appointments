import React, { Component } from 'react'
import * as moment from 'moment'
import { connect } from 'react-redux'
import {
    postAppointment, removeApptData
} from '../../../store/actions/appointmentAction';
import { getDriver, clearDriverList } from '../../../store/actions/driverAction'
import { searchCustomer, clearCustomerList } from '../../../store/actions/customersAction'
import Loader from "react-loader-spinner";
import { isAlphanumeric } from "../../../utils/AlphanumbericValidator.js"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { createKey } from '../../../utils/CustomerKeyCreator'

class AppointmentModel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            orderId: '',
            company_name: '',
            customerName: '',
            number: '',
            numberOfCar: '1',
            appointmentSubmitFormLoader: false,
            carOptions: -1,
            error: '',
            customerLimit: false
        }

        this.searchDriver = this.debounce(this.searchDriver, 500);
        this.searchCustomer = this.debounce(this.searchCustomer, 500);
    }

    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    searchDriver = value => {
        this.props.getDriver(value);
    }

    searchCustomer = value => {
        const data = {
            name: value,
            id: this.props.user?._id
        }
        this.props.searchCustomer(data);
    }

    selectDriver = (driver) => {
        this.setState({
            company_name: driver.company_name,
            number: driver.number.replace('+1', ''),
        })

        this.props.clearDriverList();
    }

    selectCustomer = (customer) => {
        this.setState({
            customerName: customer.customerName,
        }, (
            this.options(this.props.timeInModel, customer.customerName)
        ))

        this.props.clearCustomerList();
    }

    options = (timeInModel, customerName = undefined) => {
        const { bookedAppointment, perDayVehiclesLimit, customers } = this.props.appointment;
        const { vehiclesLimit } = this.props.user;

        // use per day limit over default limit
        const vehicleLimit = perDayVehiclesLimit ? { ...perDayVehiclesLimit, status: true } : vehiclesLimit

        const { vehiclesPerDay, vehiclesPerSlot, status } = vehicleLimit

        // find selected customer
        const customer = customerName ? customers.find(customer => customer.key === createKey(customerName)) : null

        const customerBookedVehicles = bookedAppointment
            ?.filter(appt => appt.customerId?._id === customer?._id && !appt.customerId.deleted)
            .reduce((a, b) => a + parseInt(b.car), 0)

        const customerLimit = (customer && customer.customerVehicleLimit) ? customer.customerVehicleLimit - customerBookedVehicles : 9

        const currentTime = new Date(timeInModel);

        const totalVehicles = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0);

        const limit = status ? Math.min(vehiclesPerSlot, vehiclesPerDay - totalVehicles, customerLimit) : customerLimit;

        const before = new Date(timeInModel)
        before.setMinutes(currentTime.getMinutes() - 30);
        const after = new Date(timeInModel)
        after.setMinutes(currentTime.getMinutes() + 30);

        const beforeTime = bookedAppointment.filter(item =>
            new Date(item.date).getTime() > before.getTime() &&
            new Date(item.date).getTime() <= currentTime.getTime()
        ).reduce((a, b) => a + parseInt(b.car), 0)

        const afterTime = bookedAppointment.filter(item =>
            new Date(item.date).getTime() < after.getTime() &&
            new Date(item.date).getTime() >= currentTime.getTime()
        ).reduce((a, b) => a + parseInt(b.car), 0)
        const slotLimit = status ? vehiclesPerSlot - Math.max(afterTime, beforeTime) : 9;

        this.setState({
            carOptions: Math.min(limit, slotLimit)
        })
    }

    onChangeHandle = (e) => {
        const value = e.target.value;
        const name = e.target.name
        if (name === 'customerName') {
            this.searchCustomer(value)
        }

        if (name === "orderId") {
            if (isAlphanumeric(value)) {
                this.setState({
                    [name]: value
                })
            }
        }
        else {
            this.setState({
                [name]: value
            })
        }
    }

    customerSelected = () => {
        setTimeout(() => {
            this.props.clearCustomerList();
        }, 5000)
        this.setState({
            customerLimit: false
        })
        if (this.state.customerName.length > 0) {
            this.options(this.props.timeInModel, this.state.customerName)
        }
        else {
            this.options(this.props.timeInModel)
        }
    }

    onChangeHandle2 = (e) => {
        this.searchDriver(e.target.value)

        if (e.target.value === '') {
            this.setState({
                [e.target.name]: e.target.value,
                driver: ''
            });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value
            });
        }
    }

    submitAppointment = (e) => {
        e.preventDefault()

        if (isAlphanumeric(this.state.orderId)) {
            this.setState({ appointmentSubmitFormLoader: true })

            const data = {
                id: this.props.user._id,
                orderId: this.state.orderId,
                company_name: this.state.company_name,
                number: this.state.number,
                car: this.state.numberOfCar ? this.state.numberOfCar : '1',
                time: this.props.timeInModel,
                date: this.props.date,
                customerName: this.state.customerName,
                appointmentTimeSlot: moment(this.props.timeInModel).format("h:mm a"),
                key: this.state.customerName?.replace(/\s+/g, '').toLowerCase()
            }

            this.props.postAppointment(data)
                .then(() => {

                    this.props.onSucessSubmit()
                    this.props.clearDriverList()
                    this.props.clearCustomerList()

                    this.setState({ appointmentSubmitFormLoader: false })
                })
        } else {
            alert("Order id couldn't contain special characters")
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.openModel !== prevProps.openModel) {
            this.setState({ customerLimit: false })
            this.options(this.props.timeInModel)
        }

        if (prevProps.openModel && !this.props.openModel) {
            this.setState({
                objectId: '',
                orderId: '',
                company_name: '',
                customerName: '',
                number: '',
                numberOfCar: '',
                customerLimit: false
            })
            this.props.clearDriverList()
            this.props.clearCustomerList()
        }
    }

    render() {
        const { openModel, timeInModel, modelHandler, driverList, user, customerList } = this.props;
        const { orderId, company_name, number, numberOfCar, appointmentSubmitFormLoader, carOptions, customerName, customerLimit } = this.state;


        return (
            <div style={{ display: openModel ? "" : 'none' }} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                    <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full" style={{ maxWidth: '410px' }}>
                        <nav className="bg-white shadow">
                            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                                <div className="relative flex justify-space-between h-16">
                                    <div className="flex-1 flex items-center justify-between sm:items-stretch">
                                        <div></div>
                                        <div className="">
                                            <div className="text-gray-900 font-medium text-center text-xl font-semibold">Book Appointment</div>
                                            <p className="font-normal text-center text-gray-600">{`For ${moment(timeInModel).format('hh:mm A')} on ${String(moment(this.props.date).format('dddd MM/DD'))}`}</p>
                                        </div>
                                        <div className="cursor-pointer" onClick={modelHandler}>
                                            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        <div className="form-width mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                            <form onSubmit={this.submitAppointment}>
                                <div className="max-w-7xl mx-auto bg-white mb-5">
                                    <div className="space-y-6 sm:space-y-5">
                                        <div className="sm:flex flex-col">

                                            <div className="sm:w-10/12">
                                                <div className="w-full px-2 mb-4">

                                                    <label htmlFor="company_name" className="block text-sm font-normal text-gray-900">Carrier Name</label>
                                                    <div className="mt-1">
                                                        <input
                                                            required
                                                            type="text"
                                                            onChange={this.onChangeHandle2}
                                                            value={company_name}
                                                            name="company_name"
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <ul className="shadow rounded absolute bg-white z-50 w-90 sm:col-span-12">
                                                        {driverList && driverList.map((driver, index) =>
                                                            <li key={{ index }} onClick={() => this.selectDriver(driver)} className="flex justify-between p-2 hover:bg-gray-100 border-solid border-b border-gray-200 w-80">
                                                                <span>
                                                                    <b>
                                                                        {driver.company_name}
                                                                    </b>
                                                                    <br />
                                                                    <span className="text-gray-500">Tel: {driver.number}</span>
                                                                    <br />
                                                                    {driver.city ? driver.city + ', ' + driver.state : driver.address}
                                                                </span>
                                                            </li>
                                                        )}
                                                    </ul>

                                                    <div className="w-full my-4">
                                                        <label htmlFor="email" className="block text-sm font-normal text-gray-900">Cell phone#</label>
                                                        <div className="mt-1 relative">
                                                            <span style={{ background: '#eee', height: '36px', width: '40px', lineHeight: '38px', top: '1px', left: '1px', borderRadius: '6px 0px 0px 6px', position: 'absolute', paddingLeft: '10px' }}>+1</span>
                                                            <input required type="text" onChange={this.onChangeHandle} value={number} name="number" pattern="^[0-9]+$" maxLength="10" minLength="10" style={{ paddingLeft: '45px' }} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            <hr className="w-full" />
                                            <div className="sm:w-10/12">
                                                <div className="w-full px-2 mb-4">
                                                    <label htmlFor="orderId" className="block text-sm font-normal text-gray-900 mt-4">Order ID#</label>
                                                    <div className="mt-1" style={{
                                                        marginBottom: '15px'
                                                    }}>
                                                        <input
                                                            type="text"
                                                            onChange={this.onChangeHandle}
                                                            value={orderId}
                                                            name="orderId"
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>

                                                    <label htmlFor="customer" className="block text-sm font-normal text-gray-900 mt-4">Customer (shipper/broker on dispatch sheet)</label>
                                                    <div className="mt-1" style={{
                                                        marginBottom: '15px'
                                                    }}>
                                                        <input
                                                            type="text"
                                                            required
                                                            onBlur={this.customerSelected}
                                                            onChange={this.onChangeHandle}
                                                            value={customerName}
                                                            name="customerName"
                                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    {customerLimit && (
                                                        <span className="text-xs text-red-400">Limit for this customer has already been filled</span>
                                                    )}
                                                    <ul className="shadow rounded absolute bg-white z-50 w-90 sm:col-span-12">
                                                        {customerList && customerList.map((customer, index) =>
                                                            <li key={{ index }} onClick={() => this.selectCustomer(customer)} className="flex justify-between p-2 hover:bg-gray-100 border-solid border-b border-gray-200 w-80">
                                                                <span>
                                                                    <b>
                                                                        {customer.customerName}
                                                                    </b>
                                                                </span>
                                                            </li>
                                                        )}
                                                    </ul>

                                                </div>



                                                <div className="w-full px-2 my-4">
                                                    <div>
                                                        <label htmlFor="numberOfCar" className="block text-sm font-normal text-gray-900">  How many cars?</label>
                                                        <select required onChange={this.onChangeHandle} value={numberOfCar} name="numberOfCar" className="mt-1 block sm:w-3/6 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                            {carOptions >= 0 && (
                                                                Array(carOptions).fill().map((option, i) =>
                                                                    <option key={i} id={i} value={i + 1}>{i + 1}</option>
                                                                )
                                                            )}
                                                        </select>
                                                        {user.status && carOptions <= 0 && (
                                                            <span className="text-xs text-red-400">Limit for this slot has already been filled</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {appointmentSubmitFormLoader ? (<Loader
                                    type="Puff"
                                    color="#00BFFF"
                                    height={32}
                                    width={32}
                                    style={{ margin: 'auto', width: '32px', height: '32px' }}
                                />) : (
                                    <button disabled={carOptions <= 0} type="submit" className={`w-32 mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${user.limit_appointments && carOptions > 0 ? 'bg-blue-700 hover:bg-blue-600 focus:ring-blue-500' : !user.limit_appointments ? 'bg-blue-700 hover:bg-blue-600 focus:ring-blue-500' : 'bg-gray-400'} focus:outline-none focus:ring-2 focus:ring-offset-2 `}>
                                        CONFIRM
                                    </button>)}
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        )
    }

}

const mapStateToProps = state => ({
    user: state.auth.user,
    appointment: state.appointment,
    driver: state.driver,
    driverList: state.driver.driverList,
    customerList: state.customers.customersList,
});

export default connect(mapStateToProps, { clearDriverList, getDriver, postAppointment, removeApptData, searchCustomer, clearCustomerList })(AppointmentModel);