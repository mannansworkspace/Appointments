import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { checkedAppointment } from '../../store/actions/appointmentAction'
import { getSingleAppointment } from '../../store/actions/driverAction'
import { getSingleCarrier } from '../../store/actions/warehouseAction'
import * as moment from 'moment'
import { userlogout } from '../../store/actions/authAction';
import { NotificationManager } from 'react-notifications';
import Loader from "react-loader-spinner";


class CheckInOut extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            appointmentData: null,
            checkValue: '',
            step: 1,
            disabled: false,
            checkout: false,
            arival: moment(new Date()).format('HH:mm'),
            early: '',
            late: '',
            vehicles: [],
        }
    }
    componentDidMount() {
        this.props.getSingleAppointment(this.state.id)
    }

    componentDidUpdate(props, state) {
        if (this.state.appointmentData.warehouse_id && state.appointmentData.warehouse_id._id !== props.auth?._id) {
            NotificationManager.error('This link do not belong to your warehouse');
            this.props.userlogout();
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { appointmentData } = props.driver;

        if (appointmentData && JSON.stringify(appointmentData) !== JSON.stringify(state.appointmentData)) {
            state.appointmentData = appointmentData;
            state.checkValue = appointmentData && appointmentData.checkedStatus;
        }

        const vehicles = appointmentData?.vehicleDetail && appointmentData.vehicleDetail

        if (vehicles && !state.vehicles.length) {
            state.vehicles = vehicles && vehicles?.map(item => ({ ...item, checked: item.checked !== undefined ? item.checked : true }))
        }

        if (state.appointmentData) {
            const { date } = state.appointmentData
            state.late = +moment(date).format('HH') + 1 + ':' + moment(date).format('mm')
            state.early = +moment(date).format('HH') + - 1 + ':' + moment(date).format('mm')
        }

        return state;
    }

    changeHandler = (index) => {
        const updatedVehicles = [...this.state.vehicles]

        updatedVehicles[index] = {
            ...updatedVehicles[index],
            checked: !updatedVehicles[index].checked,
        }

        this.setState({
            vehicles: updatedVehicles
        })
    }

    onConfirm = () => {
        if (this.state.appointmentData.check_out) {
            this.setState({ checkout: true })
        }
        
        this.setState({ disabled: true }, () => {

        });

        this.props.checkedAppointment(this.state.id, this.state.vehicles).finally(res => {
            this.setState({ disabled: false, step: 2 })
        })
    }

    render() {


        const { appointmentData, step, disabled, checkout, arival, checkValue, vehicles, late, early } = this.state;

        return (
            this.props.driver.isLoading ? (
                <Loader className="absolute top-1/2 left-1/2"
                    type="Puff"
                    color="#00BFFF"
                />
            ) : (
                <>
                    {step === 1 ? (
                        <div className="bg-gray-100">

                            <div className="h-16" ></div>
                            <div className="max-w-7xl mx-auto py-6 px-2 smpx-6 lg:px-8">
                                <div className="max-w-none mx-auto">
                                    <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
                                        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                            <div>
                                                {checkValue?.length === 0 && (
                                                    <div>
                                                        {arival > late ? (
                                                            <div className="mb-5 text-left bg-red-100 w-full px-3 py-1 text-red-900 italic font-semibold">Driver is more than 1 hour late</div>
                                                        ) : arival < early && (
                                                            <div className="mb-5 text-left bg-red-100 w-full px-3 py-1 text-red-900 italic font-semibold">Driver is more than 1 hour too early</div>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex text-left">
                                                    <label className="mr-2 w-1/4 text-black font-medium">Carrier:</label>
                                                    <span className="pr-4 w-3/4 text-black font-normal text-sm"> {appointmentData?.driver_id?.company_name}</span>
                                                </div>

                                                <div className="flex mt-4 text-left">
                                                    <label className="mr-2 w-1/4 text-black font-medium">Appt:</label>
                                                    <div className="pr-4 w-3/4 text-black font-normal text-sm">
                                                        {appointmentData && moment(appointmentData.date).format("MM/DD/YYYY")}
                                                        <br />
                                                        {appointmentData && moment(appointmentData.date).format("h:mm a")}
                                                    </div>
                                                </div>

                                                <div className="mt-4 text-left">
                                                    <label className="mr-2 w-1/4 text-black font-medium">Vehicle:</label>
                                                    <span className="pr-4 w-3/4 text-black font-normal text-sm">
                                                        <ul>
                                                            {appointmentData && appointmentData.vehicleDetail?.map((v, i) => {
                                                                return <div className='border-t mt-2 flex justify-between'>
                                                                    <li className='mt-5'>{v.yearMakeModel} <br /> <span className='text-gray-500'>{v.vinNumber}</span></li> <br />
                                                                    <label className="flex items-center mb-4 mt-4">
                                                                        <input
                                                                            type="checkbox"
                                                                            disabled={appointmentData.checkedStatus === "check-in"}
                                                                            onChange={(e) => this.changeHandler(i)}
                                                                            name="checked"
                                                                            value="1"
                                                                            checked={vehicles[i].checked}
                                                                            className="form-checkbox text-blue-700"
                                                                        />
                                                                    </label>
                                                                </div>
                                                            })}
                                                        </ul>
                                                    </span>
                                                </div>

                                                <div className="flex justify-center">
                                                    <button disabled={disabled} type="button" onClick={this.onConfirm} className="w-28 ml-2 mt-5 block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                        Confirm
                                                    </button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="bg-gray-100">
                                <div className="h-16" ></div>
                                <div className="max-w-7xl mx-auto py-6 px-2 smpx-6 lg:px-8">
                                    <div className="max-w-none mx-auto">
                                        <div className="bg-white overflow-hidden sm:rounded-lg sm:shadow">
                                            <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="m-auto h-12 w-12 bg-green-100 stroke-current text-green-600 rounded-full text-center" fill="none" viewBox="-6 -7 36 36" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l4 4L19 7" />
                                                </svg>
                                                <div>
                                                    {appointmentData.checkedStatus === "check-in" ? (
                                                        <div>
                                                            <h1 className="text-center text-gray-900 text-lg font-medium m-auto my-4">Driver has been checked in: <br /> </h1> {/* {appointmentData && appointmentData.checkedStatus} on */}
                                                            <p className="text-left bg-green-100 py-3 px-3 rounded mb-12">*Driver must go inside the office to scan-out</p>
                                                            <div className="text-left text-black text-lg font-bold">
                                                                {appointmentData.check_in_time && (
                                                                    <p className="text-left text-gray-900 m-auto"> {moment(appointmentData.check_in_time).format('dddd, MMMM DD on hh:mm a').replace(' on ', ' at ')} </p>
                                                                )}
                                                                {appointmentData?.driver_id?.company_name}
                                                            </div>
                                                        </div>
                                                    ) :
                                                        <div className="text-left">
                                                            {appointmentData.check_out && checkout ?
                                                                <h1 className="text-center text-gray-900 text-lg font-medium m-auto my-6">You have already checked out <br /> {/*{appointmentData && appointmentData.checkedStatus} on */} </h1>
                                                                :
                                                                <h1 className="text-center text-gray-900 text-lg font-medium m-auto my-6">Driver has been checked out <br /> {/* {appointmentData && appointmentData.checkedStatus} on */} </h1>
                                                            }
                                                            <div className="text-left text-black text-lg font-bold">
                                                                {appointmentData.check_out_time && (
                                                                    <p className="text-left text-gray-900 m-auto"> {moment(appointmentData.check_out_time).format('dddd, MMMM DD on hh:mm a').replace(' on ', ' at ')}</p>
                                                                )}
                                                                {appointmentData?.driver_id?.company_name}
                                                            </div>
                                                        </div>
                                                    }

                                                </div>

                                                <div className="text-left text-gray-700 text-base"> {appointmentData && moment(appointmentData.date).format("h:mm a on dddd MM/DD/YYYY")}</div>

                                            </div>
                                            
                                            <div className=" px-6 py-5 text-left text-gray-700 text-base"> {appointmentData && moment(appointmentData.date).format("h:mm a on dddd MM/DD/YYYY")}</div>

                                            <br />
                                            <div className=" px-6 py-5 text-left text-gray-700 text-base">
                                                <ul>
                                                    {appointmentData && appointmentData.vehicleDetail.filter(vehicle => vehicle.checked).map(v =>
                                                        <React.Fragment><li>{v.yearMakeModel} {v.vinNumber}</li> <br /></React.Fragment>
                                                    )}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </>
            )
        )
    }
}

const mapStateToProps = (state) => ({
    driver: state.driver,
    auth: state.auth.user,

})
export default connect(mapStateToProps, { checkedAppointment, getSingleAppointment, getSingleCarrier, userlogout })(withRouter(CheckInOut))
