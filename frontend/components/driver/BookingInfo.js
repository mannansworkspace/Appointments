import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import { getSingleAppointment, fetchCarInformation, resetCarInformation, clearDisplayInform } from '../../store/actions/driverAction'
import { completeAppointment } from '../../store/actions/appointmentAction'
import * as moment from 'moment'
import VehicleDetail from './models/VehicleDetail';
import VehicleModal from './models/VehicleModal';
import Loader from "react-loader-spinner";
import { isAlphanumeric } from '../../utils/AlphanumbericValidator';
import { removeApptData } from '../../store/actions/appointmentAction'
import NotificationManager from 'react-notifications/lib/NotificationManager'




class BookingInfo extends Component {
    constructor(props) {
        super(props)
        const { id } = this.props.match.params || new URLSearchParams(this.props.location.search).get("id")

        this.state = {
            id,
            onlineBooked: id ? false : true,
            appointmentData: null,
            type: 'lot',
            driverCarValue: [],
            model: false,
            model2: false,
            displayInform: null,
            key: '',
            vehicleDetail: [],
            vinNumber: '',
            yearMakeModel: '',
            year: '',
            make: '',
            modelC: '',
            loadingIndex: -1,
            confirmBtn: false,
            orderId: '',
            shipper: '',
            error: '',
            warehouse: {},
            timeSlot: '',
            customerName: '',
            driverName: '',
            driverNumber: '',
            email: '',
        }
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

    componentDidMount() {

        const { id, onlineBooked } = this.state
        if (!onlineBooked)
            this.props.getSingleAppointment(id)
        else
            this.props.removeApptData()

    }

    static getDerivedStateFromProps(props, state) {
        const { appointmentData, displayInform } = props.driver;
        const { warehouse, timeSlot, numberOfCar, customerName, number, company_name, email } = props.appointment;

        let driverCarValue = []
        if (appointmentData && JSON.stringify(appointmentData) !== JSON.stringify(state.appointmentData)) {
            state.appointmentData = appointmentData;
            state.driverName = appointmentData && appointmentData.company_name;
            state.driverNumber = appointmentData && appointmentData.number;
            state.driverCar = appointmentData && parseInt(appointmentData.car)
            if (appointmentData && appointmentData.car) {
                Array(parseInt(appointmentData.car)).fill().map((item, i) => {
                    return driverCarValue.push({ value: '', status: false })
                })
                state.driverCarValue = driverCarValue

            }
        }
        
        if (state.driverCarValue && state.driverCarValue.length > 0) {
            state.displayInform = displayInform
            const arr = state.driverCarValue.filter(item => !item.status)
            if (arr.length <= 0) {
                state.confirmBtn = true;
            }
            else {
                state.confirmBtn = false;
            }
        }

        if (state.onlineBooked && JSON.stringify(warehouse) !== JSON.stringify(state.warehouse)) {
            state.warehouse = warehouse
            state.timeSlot = timeSlot
            state.driverCar = numberOfCar;
            state.customerName = customerName
            state.driverNumber = number
            state.driverName = company_name
            state.email = email
            Array(parseInt(numberOfCar)).fill().map((item, i) => {
                return driverCarValue.push({ value: '', status: false })
            })
            state.driverCarValue = driverCarValue
        }

        return state;
    }

    componentDidUpdate(props, state) {
        if (state.appointmentData?.page > 2) {
            props.history.push(`/driver-confirm/${state.id}`)
        }
    }

    onChangeHandler = (e, key = 0,) => {
        let value = e.target.value;

        if (e.target.id === 'vin#') {
            this.setState({
                error: '',
                loadingIndex: -1,
                model: false,
            })
            this.props.clearDisplayInform()
            const driverCarValue = [...this.state.driverCarValue];
            const val = e.target.value.toUpperCase();
            if (this.state.type === 'vin') value = value.substr(0, 17);
            driverCarValue[key].value = val;

            value = driverCarValue
        }
        if (e.target.name === "orderId") {
            if (isAlphanumeric(e.target.value)) {
                this.setState({
                    [e.target.name]: e.target.value
                })
            }
        } else {
            this.setState({
                [e.target.name]: value
            })
        }
    }

    checkCar = (value, key) => {
        if (value) {
            const vehicle = this.state.vehicleDetail.find(item => item?.lotNo === value || value === item?.vinNumber)
            if (vehicle) {
                NotificationManager.error("You have already entered this vin/lot number please choose other!")
            }
            else {
                this.setState({ loadingIndex: key });
                this.props.fetchCarInformation(value, this.state.type)
                    .then(res => {
                        if (res) {
                            this.setState({
                                model: !this.state.model,
                                key: key,
                            })
                        }

                    })
            }
        }
        else {
            alert('please Enter Vin Number First')
        }
    }

    saveModelValue = (e, value) => {
        e.preventDefault()
        let data;
        let vehicleDetail;
        const driverCarValue = [...this.state.driverCarValue];
        driverCarValue[this.state.key].status = true;

        if (!value) {
            data = {
                vinNumber: this.state.vinNumber,
                yearMakeModel: this.state.year + " " + this.state.make + " " + this.state.modelC,
                images: [],
            }
            vehicleDetail = [...this.state.vehicleDetail, data]

            driverCarValue[this.state.key].value = data.vinNumber
        }
        else {
            vehicleDetail = [...this.state.vehicleDetail, this.state.displayInform]
        }

        this.setState({
            driverCarValue: driverCarValue,
            model: value ? !this.state.model : this.state.model,
            model2: !value ? !this.state.model2 : this.state.model2,
            vehicleDetail: vehicleDetail,
            orderId: this.state.orderId,
            shipper: this.state.shipper,
            loadingIndex: -1,
            vinNumber: '',
            yearMakeModel: "",
            year: "",
            make: "",
            modelC: "",

        })
    }

    cancelModelValue = (value) => {

        this.setState({
            model: value === 0 ? !this.state.model : this.state.model,
            model2: !this.state.model2,
            displayInform: null,
            loadingIndex: -1,
            vinNumber: '',
            yearMakeModel: "",
            year: "",
            make: "",
            modelC: "",
        })
        this.props.resetCarInformation()
    }

    editInputFeild = (key) => {
        let driverCarValue = [...this.state.driverCarValue]
        driverCarValue[key].status = false
        const result = this.state.vehicleDetail?.filter(word => (word?.lotNo !== driverCarValue[key].value) && (word?.vinNumber !== driverCarValue[key].value))
        this.setState({
            driverCarValue: driverCarValue,
            vehicleDetail: result,
        })
    }

    submitHandler = (e) => {
        e.preventDefault()

        const answer = this.state.driverCarValue.every(item => item.status)
        if (answer) {
            const customer = this.state.customerName ? this.state.customerName : this.state.appointmentData?.customerId?.customerName
            const data = {
                id: this.state.id ? this.state.id : '',
                company_name: this.state.driverName ? this.state.driverName : this.props.appointment.company_name,
                number: this.state.driverNumber ? this.state.driverNumber : this.props.appointment.number,
                car: this.state.driverCar ? parseInt(this.state.driverCar) : 1,
                email: this.state.driverEmail ? this.state.driverEmail : this.props.appointment.email,
                date: this.state.timeSlot ? this.state.timeSlot : this.state.appointmentData.date,
                appointmentTimeSlot: moment(this.state.timeSlot ? this.state.timeSlot : this.state.appointmentData.date).format("h:mm A"),
                warehouse_id: this.state.warehouse?._id ? this.state.warehouse?._id : this.state.appointmentData.warehouse_id?._id,
                onlineBooked: this.state.onlineBooked,
                customerName: customer,
                vehicleDetail: this.state.vehicleDetail,
                orderId: this.state.orderId.length > 0 ? this.state.orderId : this.state.appointmentData?.orderId,
                shipper: this.state.shipper,
                key: customer?.replace(/\s+/g, '').toLowerCase()
            }
            this.props.completeAppointment(data, this.props.history)
        }
        else {
            alert('Please Complete the Information First')
        }
    }
    render() {
        const { modelC, make, year, vinNumber, model2, appointmentData, driverCarValue, type, model, displayInform, loadingIndex, confirmBtn, orderId, error, onlineBooked, warehouse } = this.state

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
                        <div className="text-left text-black mb-2 font-bold">
                            {onlineBooked ? (
                                <div>
                                    Appointment with {warehouse && warehouse.company_name}
                                </div>
                            ) : (
                                <div>
                                    Appointment with {appointmentData && appointmentData.warehouse_id && appointmentData.warehouse_id.company_name}
                                </div>
                            )}
                        </div>
                        <div className="text-left text-gray-700">{appointmentData && moment(appointmentData.date).format("h:mm a on MM/DD/YYYY")}</div>

                        <div className="text-left font-medium mt-10 mb-5">Please confirm vehicle details</div>
                        <div className="sm:col-span-2">
                            <div className="max-w-lg">

                                <label htmlFor="orderId" className="block text-left text-sm font-normal text-gray-900">Order ID#:</label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        onChange={this.onChangeHandler}
                                        value={orderId.length > 0 ? orderId : appointmentData?.orderId}
                                        name="orderId"
                                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-3/4 sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <hr className="w-full mt-8" />

                                <div className="flex items-center my-5">
                                    <div className="flex items-center w-48">
                                        <input onChange={this.onChangeHandler} checked={type === "lot"} name="type" value="lot" type="radio" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                                        <label htmlFor="push_email" className="ml-3 block text-sm font-normal text-black">
                                            Use Copart or IAAI Iot#
                                        </label>
                                    </div>
                                    <div className="flex items-center w-40">
                                        <input onChange={this.onChangeHandler} checked={type === "vin"} name="type" value="vin" type="radio" className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                                        <label htmlFor="push_everything" className="ml-3 block text-sm font-normal text-black">
                                            Use full vin#
                                        </label>
                                    </div>
                                </div>

                                {driverCarValue && driverCarValue.length && driverCarValue.map((item, key) => {
                                    return <div key={key}>
                                        {item.status ? <div className="flex">
                                            <div className="w-3/4 px-2 mb-4">
                                                <div className="flex justify-between">
                                                    <label htmlFor="email" className="block text-sm font-normal text-gray-900">{type === 'vin' ? 'Full vin' : 'Lot'}# for 1st vehicle:</label>
                                                    <span onClick={() => { this.editInputFeild(key) }} href="#" className="text-blue-600 cursor-pointer">Edit:</span>
                                                </div>
                                                <div className="mt-1">
                                                    <input type="text" value={item.value} id='vin#' readOnly className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                </div>
                                            </div>

                                            <div className="w-1/4">

                                                <button type="submit" className="w-full ml-3 ml-auto mr-auto block justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-normal rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-8">
                                                    SAVED
                                                </button>
                                            </div>
                                        </div>
                                            :
                                            <div className="flex">
                                                <div className="w-3/4 px-2 mb-4">
                                                    <div className="flex justify-between">
                                                        <label htmlFor="email" className="block text-sm font-normal text-gray-900">{type === 'vin' ? 'Full vin' : 'Lot'}# for {key + 1} vehicle:</label>
                                                    </div>
                                                    <div className="mt-1">
                                                        <input type="text" readOnly={loadingIndex !== -1 && loadingIndex !== key} onChange={(e) => this.onChangeHandler(e, key)} id='vin#' value={item.value} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                    </div>

                                                </div>
                                                <div className="w-1/4">
                                                    {!displayInform?.isVehicleExist && loadingIndex === key ?

                                                        <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 cursor-not-allowed mt-6" disabled="">
                                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Processing
                                                        </button>
                                                        :
                                                        <button
                                                            onClick={() => this.checkCar(item.value, key)}
                                                            type="submit"
                                                            className={`w-full ml-3 ml-auto mr-auto block justify-center py-1.5 px-4 border border-transparent shadow-sm text-sm font-normal rounded-md text-white ${(loadingIndex !== -1 && loadingIndex !== key) ? 'bg-gray-400 ' : 'bg-blue-700 hover:bg-blue-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-7`}
                                                            disabled={loadingIndex !== -1 && loadingIndex !== key}
                                                        >
                                                            CHECK
                                                        </button>
                                                    }
                                                </div>
                                            </div>

                                        }

                                    </div>
                                })}


                            </div>
                        </div>

                        <br />
                        <br />
                        <br />
                        <div className="left-0 w-full h-20">
                            <button onClick={this.submitHandler} type="submit" className={`left-0 right-0 bottom-5 w-5/12 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white ${confirmBtn ? 'bg-blue-700 hover:bg-blue-600' : 'bg-gray-400'}  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                                CONFIRM
                            </button>
                        </div>
                        {/* disabled={confirmBtn ? false : true} */}
                        {model && !error.length && (
                            <VehicleModal
                                displayInform={displayInform}
                                cancelModelValue={this.cancelModelValue}
                                saveModelValue={this.saveModelValue}
                            />
                        )}

                        {model2 && (
                            <VehicleDetail
                                year={year}
                                make={make}
                                modelC={modelC}
                                vinNumber={vinNumber}
                                cancelModelValue={this.cancelModelValue}
                                saveModelValue={this.saveModelValue}
                                onChangeHandler={this.onChangeHandler}
                            />
                        )}
                    </>
                )}

            </div>
        )
    }
}
const mapStateToProps = state => ({
    driver: state.driver,
    appointment: state.appointment
});
export default connect(mapStateToProps, { getSingleAppointment, fetchCarInformation, completeAppointment, resetCarInformation, removeApptData, clearDisplayInform })(withRouter(BookingInfo))
