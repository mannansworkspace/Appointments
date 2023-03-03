
import React, { Component } from 'react';
import StickyBox from "react-sticky-box";
import SearchResultSlots from './SearchResultSlots';
import DateInput from './DatePick'
import { connect } from 'react-redux'
import AllSlotsSession from './AllSlots';
import * as moment from 'moment'
import ActionsDropDown from './ActionsDropDown';
import {
    removeHolidayAction,
    removeVehicleLimitForADay,
    getAppointmentApi,
} from '../../../store/actions/appointmentAction';
import Hand from '../../../assets/svgs/Hand.svg';
import SetVehicleLimitMoodal from '../models/SetVehicleLimitMoodal';
import Loader from "react-loader-spinner";
import ApptTableView from './ApptTableView';
import { convertTime12to24 } from '../../../utils/convertTime';


class Body extends Component {

    constructor() {
        super();
        this.state = {
            todaysBookedCars: 0,
            todayAppointments: 0,
            isMarkedAsHoliday: false,
            vehicleLimitModal: false,
            open: false,
            apptTableView: false,
            exportedData: []
        }
        this.interval = ''
    }


    static getDerivedStateFromProps(props, state) {
        const { bookedAppointment } = props.appointment
        const { weekDays, vehiclesLimit } = props.auth.user
        const { perDayVehiclesLimit } = props.appointment
        state.vehicleLimit = vehiclesLimit
        if (perDayVehiclesLimit) {
            state.vehicleLimit = {
                vehiclesPerDay: perDayVehiclesLimit.vehiclesPerDay,
                id: perDayVehiclesLimit._id,
                status: true,
                perDayLimitStatus: true,
            }
        }

        if (bookedAppointment && JSON.stringify(bookedAppointment) !== JSON.stringify(state.bookedAppointment)) {
            state.bookedAppointment = bookedAppointment
            state.changeBookedAppointmentTimeOnly = true
            state.todaysBookedCars = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0);
            state.todayAppointments = bookedAppointment.length;



            state.exportedData = bookedAppointment.sort((appt1, appt2) => (new Date(appt1.date).setHours(convertTime12to24(appt1.time_slot), appt1.time_slot.split(":")[1].slice(0, 2))) > (new Date(appt2.date).setHours(convertTime12to24(appt2.time_slot), appt2.time_slot.split(":")[1].slice(0, 2))) ? 1 : -1).map((appointment, index) => {
                const {
                    date,
                    time_slot,
                    orderId,
                    customerId,
                    company_name,
                    car,
                    vehicleDetail,
                    number,
                } = appointment;
                const { customerName } = customerId || {}
                const filteredVehicleDetail = vehicleDetail.filter(
                    (vehicle) => !!vehicle
                );
                // we used map here to show the  complete details of a record in multiple rows instead of all in one cell
                return filteredVehicleDetail.map((vehicle, idx) => ({
                    Date: !index ? moment(date).format("LL") : null,
                    "Appointment Time": !idx ? time_slot : null,
                    "Order ID": !idx ? orderId : null,
                    Customer: !idx ? customerName : null,
                    Carrier: !idx ? company_name : null,
                    "Phone #": !idx ? number : null,
                    "# of Vehicles": !idx ? car : null,
                    lot: vehicle.lotNo,
                    vin: vehicle.vinNumber,
                    vehicle: vehicle.yearMakeModel,

                }));

                // flat will return a new array with all the sub-array elements
            })
                .flat()


        }
        if (weekDays) {
            weekDays.map(item =>
                item.day === moment(props.date).format('dddd') &&
                (state.open = item.open))
        }

        return state;

    }

    componentDidMount() {
        this.props.getAppointmentApi(this.props.date)
        this.interval = setInterval(() => {
            this.props.getAppointmentApi(this.props.date)
        }, 30000)
    }
    componentWillUnmount() {
        clearInterval(this.interval)
    }

    removeHoliday = (dateToMark) => {
        this.props.removeHolidayAction(moment(dateToMark).format('YYYY-MM-DD'));
    }

    vehicleLimitModelHandler = () => {
        this.setState((prevState) => ({
            vehicleLimitModal: !prevState.vehicleLimitModal,
        }))
    }

    onLimitSubmit = () => {
        this.setState({
            vehicleLimitModal: false,
        })
    }

    removeLimit = (id) => {
        this.props.removeVehicleLimitForADay(this.props.date, id)
    }
    setApptTableView = () => {
        this.setState({ apptTableView: !this.state.apptTableView })
    }

    render() {
        const { isMarkedAsHoliday, date, removeBlockedDay, blockedAppointments, appointment } = this.props;
        const { todaysBookedCars, todayAppointments, vehicleLimitModal, open, exportedData } = this.state
        const { perDayVehiclesLimit, searchAppointmentsHappening, searchAppointmentResults, bookedAppointment } = appointment
        const { vehicleLimit } = this.state
        return (
            <div className="md:flex">
                {this.props.auth.loadData ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    <>
                        <div className="md:w-2/5 lg:w-1/5 md:mr-5 lg:mr-0 mb-5 md:mb-0 z-0">
                            <StickyBox className="hidden sm:block">
                                <div className="h-10"></div>
                                <DateInput className="hidden sm:block" setDate={this.props.pickupDate} />
                            </StickyBox>
                            <div className="block sm:hidden md:hidden lg:hidden h-72">

                                <DateInput setDate={this.props.pickupDate} />
                            </div>
                        </div>

                        <div className="md:w-3/5 lg:w-4/5 z-0 main-content-warehouse">
                            {this.props.appointment.isLoading ? (
                                <Loader className="absolute top-1/2 left-1/2"
                                    type="Puff"
                                    color="#00BFFF"
                                />
                            ) : (

                                <div className="">
                                    <SetVehicleLimitMoodal
                                        date={moment(this.props.date).format('YYYY-MM-DD')}
                                        openModel={vehicleLimitModal}
                                        modelHandler={this.vehicleLimitModelHandler}
                                        onSucessSubmit={this.onLimitSubmit}
                                        perDayVehiclesLimit={perDayVehiclesLimit}
                                    />
                                    <div className="lg:pl-9">
                                        {searchAppointmentsHappening ?
                                            <SearchResultSlots
                                                value={this.state}
                                                onSetSidebarOpen={this.onSetSidebarOpen}
                                                sidebarHandler={this.props.sidebarHandler}
                                                searchAppointmentsHappening={searchAppointmentsHappening}
                                                searchAppointmentResults={searchAppointmentResults}
                                            /> :
                                            <>
                                                <StickyBox
                                                    style={{ background: '#f3f4f6', zIndex: '9', paddingBottom: '10px' }}
                                                >
                                                    <div className="h-20"></div>

                                                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate text-left">
                                                        {moment(date).format('dddd, MMM Do')}
                                                        {open && !isMarkedAsHoliday &&
                                                            <ActionsDropDown
                                                                date={date}
                                                                exportedData={exportedData}
                                                                allowDownload={!!bookedAppointment.length}
                                                                setTableView={this.setApptTableView}
                                                                apptTableView={this.state.apptTableView}
                                                            />
                                                        }

                                                    </h2>
                                                    <div className='flex'>
                                                        {open && (
                                                            <>
                                                                <p className="text-left mt-3 text-gray-700">{todayAppointments} appointments booked ( {todaysBookedCars} vehicles) </p>
                                                                {(vehicleLimit.status) && (
                                                                    <div className='flex items-center'>
                                                                        <img src={Hand} className="h-6 w-6 mt-2 ml-3" alt="hand" />
                                                                        <div className='mt-2 ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 md:w-full justify-center text-center'>{vehicleLimit.vehiclesPerDay + ' Car limit'}</div>
                                                                        {vehicleLimit.perDayLimitStatus && (<>
                                                                            <div className="cursor-pointer mt-3 ml-2 text-blue-700" onClick={this.vehicleLimitModelHandler}>Change</div>
                                                                            <div className='text-blue-700 mt-4 ml-1'>/</div>
                                                                            <div className="cursor-pointer mt-3 ml-1 text-blue-700" onClick={() => this.removeLimit(vehicleLimit.id)}>Remove</div>
                                                                        </>)
                                                                        }

                                                                    </div>
                                                                )

                                                                }
                                                            </>
                                                        )}
                                                    </div>
                                                    {blockedAppointments && (
                                                        <div className="flex itmes-center">
                                                            <p className="text-left mt-2 text-red-800 bg-red-100 rounded-full pl-4 pr-6 py-1">More appointments blocked for {moment(date).format('MMM Do')}</p>
                                                            <div className="cursor-pointer mt-4 ml-2 text-blue-700 underline" onClick={removeBlockedDay}>Remove Block</div>
                                                        </div>
                                                    )}
                                                </StickyBox>

                                                {!isMarkedAsHoliday ?
                                                    <>
                                                        {open && (
                                                            <>
                                                                {this.state.apptTableView ? "" : <div className="mr-auto text-right" style={{ maxWidth: '940px' }}>Total</div>}
                                                            </>
                                                        )}
                                                        {this.state.apptTableView ?
                                                            <ApptTableView bookedAppts={exportedData} />
                                                            :
                                                            <AllSlotsSession
                                                                date={date}
                                                                sidebarHandler={this.props.sidebarHandler}
                                                                openModel={this.props.openModel}
                                                            />
                                                        }
                                                    </>
                                                    :
                                                    <>
                                                        <div className="md:ml-48 lg:ml-64 mt-20">
                                                            <div className="mb-2 md:w-56">
                                                                <div className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 md:w-full justify-center text-center">Marked as holiday</div>
                                                                <div onClick={() => this.removeHoliday(date)} className="cursor-pointer text-blue-500">Remove Holiday</div>
                                                            </div>

                                                        </div>
                                                    </>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    appointment: state.appointment,
    auth: state.auth,
    isMarkedAsHoliday: state.appointment.isMarkedAsHoliday,
    blockedAppointments: state.appointment.isBlockedFurtherAppointments
});

export default connect(mapStateToProps, { removeHolidayAction, removeVehicleLimitForADay, getAppointmentApi })(Body);
