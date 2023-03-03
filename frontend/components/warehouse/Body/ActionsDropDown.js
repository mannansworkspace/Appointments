import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import ArrowDown from '../../../assets/svgs/ArrowDown.svg';
import SetVehicleLimitMoodal from '../models/SetVehicleLimitMoodal';
import {
    markThisDateAsHolidayAction, changeDayTimings,
    blockedThisDateAction
} from '../../../store/actions/appointmentAction';

import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import ChangeDayTimingsModal from '../models/ChangeDayTimingsModal';
import { CSVLink } from "react-csv";
import { convertTime12to24 } from '../../../utils/convertTime';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

class ActionsDropDown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showDropDown: false,
            changeTimingModal: false,
            extraTimingsForThisDate: [],
            allSlots: [],
            bookedAppointment: [],
            mergeAllSlots: false,
            slotMenuID: null,
            date: null,
            vehicleLimitModal: false,
            todayAppointments: 0,
            todaysBookedCars: 0,
            apptView: false,
        }

        this.buttonRef = React.createRef();
    }

    setButtonRef = (node) => {
        this.buttonRef = node;
    }

    handleClickOutside = (event) => {

        if (this.state.showDropDown && this.buttonRef && !this.buttonRef.contains(event.target)) {
            this.handleDropDown(false)
            document.body.removeEventListener('click', this.handleClickOutside);
        }
    }


    handleDropDown = (value) => {
        this.setState({
            showDropDown: value
        }, () => {
            if (this.state.showDropDown) {
                document.body.addEventListener('click', this.handleClickOutside, true);
            }
        })
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.toggleDropdown, true);
    }


    markAsHoliday = () => {
        this.props.markThisDateAsHolidayAction(
            moment(this.props.date).format('YYYY-MM-DD')
        );
    }

    markAsBlocked = () => {
        this.props.blockedThisDateAction(
            moment(this.props.date).format('YYYY-MM-DD')
        );
    }

    vehicleLimitModelHandler = () => {
        if (this.props.blockedAppointments) {
            this.setState({
                blockedAppointmentModel: true
            })
        }
        else {
            this.setState((prevState) => ({
                vehicleLimitModal: !prevState.vehicleLimitModal,
            }))
        }
    }

    onLimitSubmit = () => {
        this.setState({
            vehicleLimitModal: false,
        })
    }

    handleChangeTimingModal = (value) => {

        this.setState({
            changeTimingModal: value
        });
    }


    changeDayTimings = (timings) => {
        this.handleChangeTimingModal(false);

        this.props.changeDayTimings(timings,
            moment(this.props.date).format('YYYY-MM-DD')
        );
    }

    printDocument() {


        const pdfTable = document.getElementById('divToPrint');
        //   //html to pdf format
        var html = htmlToPdfmake(pdfTable.innerHTML);
        const documentDefinition = { content: html };
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
        pdfMake.createPdf(documentDefinition).open();

    }

    static getDerivedStateFromProps(props, state) {
        const { bookedAppointment } = props.appointment
        const { extraTimingsForThisDate, user, date } = props;


        if (JSON.stringify(date) !== JSON.stringify(state.date)) {
            const dt = moment(new Date(date)).format('dddd')
            state.todayTiming = user.weekDays?.find(el => el.day === dt)

            state.date = date
            state.mergeAllSlots = true;
        }


        if (bookedAppointment && JSON.stringify(bookedAppointment) !== JSON.stringify(state.bookedAppointment)) {
            state.bookedAppointment = bookedAppointment;
            state.todaysBookedCars = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0);
            state.todayAppointments = bookedAppointment.length
            state.mergeAllSlots = true;
        }

        if (extraTimingsForThisDate && JSON.stringify(extraTimingsForThisDate) !== JSON.stringify(state.extraTimingsForThisDate)) {
            state.extraTimingsForThisDate = extraTimingsForThisDate;
            state.mergeAllSlots = true;
        }

        return state;
    }

    setApptTableView = () => {
        this.props.setTableView()
    }
    margeAllSlots = () => {
        const { todayTiming, bookedAppointment, extraTimingsForThisDate } = this.state;

        const diff = parseInt(todayTiming.closeTime) - parseInt(todayTiming.openTime);

        const allSlots = [
            ...bookedAppointment.map(x => ({ 
                ...x, 
                booked: true,
                date: (new Date(x.date).setHours(
                    convertTime12to24(x.time_slot),
                    x.time_slot.split(":")[1].slice(0, 2)
                )) 
             })),
            ...extraTimingsForThisDate.map(x => ({ 
                ...x, 
                booked: false,
                date: (new Date(x.date).setHours(
                    convertTime12to24(x.time_slot),
                    x.time_slot.split(":")[1].slice(0, 2)
                ))  
            }))
        ];

        let loadTime;
        if (this.props.user?.loadTime?.loadTime1To4) {
            loadTime = this.props.user?.loadTime?.loadTime1To4;
        }
        else {
            loadTime = this.props.user?.loadTime
        }

        for (let minutes = 0; minutes <= diff * 60; minutes = minutes + parseInt(loadTime)) {
            const date = new Date(this.props.date)
            date.setHours(parseInt(todayTiming.openTime));
            date.setMinutes(minutes);

            if (allSlots.findIndex(item => new Date(item.date).getTime() === date.getTime()) === -1) {
                allSlots.push({
                    date: date.getTime(),
                    booked: false
                });
            }
        }

        //sort asc all slots
        allSlots.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        })

        this.setState({
            allSlots,
            mergeAllSlots: false
        })

    }

    componentDidUpdate() {
        if (this.state.mergeAllSlots) {
            this.margeAllSlots()
        }
    }

    calculateTotalCars = num => {
        let car = 0
        for (let i = num; i < num + 3; i++) {
            if (this.state.allSlots[i]?.booked) {
                car += +this.state.allSlots[i].car
            }
        }

        return car
    }

    truncate = (input) => input?.length > 20 ? `${input.substring(0, 20)}...` : input;

    csvHeaders = () => {
        return [
            { label: 'Date', key: 'Date' },
            { label: 'Appointment Time', key: 'Appointment Time' },
            { label: 'Order ID', key: 'Order ID' },
            { label: 'Customer', key: 'Customer' },
            { label: 'Carrier', key: 'Carrier' },
            { label: 'Phone #', key: 'Phone #' },
            { label: '# of Vehicles', key: '# of Vehicles' },
            { label: 'Lot#', key: 'lot' },
            { label: 'Vehicle', key: 'vehicle' },
            { label: 'vin#', key: 'vin' }
        ]
    }
    render() {


        const { showDropDown, changeTimingModal, allSlots, vehicleLimitModal, todayTiming, todayAppointments, todaysBookedCars } = this.state;
        return (
            <div className="mt-4 sm:mt-0 block sm:inline-block text-left lg:absolute">
                <div className="relative bottom-1">
                    <button ref={this.setButtonRef} onClick={() => this.handleDropDown(!showDropDown)} type="button" className="sm:ml-8 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" aria-expanded="true" aria-haspopup="true">
                        Actions
                        <   img src={ArrowDown} alt='ArrowDown' className="-mr-1 ml-2 h-5 w-5" />
                    </button>
                </div>

                <div style={{ display: showDropDown ? "" : "none" }} className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <Link to="#" onClick={this.markAsHoliday} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">Mark as holiday</Link>
                        <Link to="#" onClick={() => this.handleChangeTimingModal(true)} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">Change timing</Link>
                        <Link to="#" onClick={this.markAsBlocked} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">Block further appts</Link>
                        <Link to="#" onClick={this.vehicleLimitModelHandler} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">Set vehicle limit</Link>
                        <Link to="#" onClick={this.printDocument} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabIndex="-1">Print</Link>
                        <CSVLink
                            className="text-gray-700 block px-4 py-2 text-sm"
                            role="menuitem" tabIndex="-1"
                            data={this.props.exportedData}
                            headers={this.csvHeaders()}
                            filename={"Appointments.csv"}
                        >
                            Export as csv
                        </CSVLink>
                        <Link to="#" onClick={this.setApptTableView} className="text-gray-700 block px-4 py-2 text-sm">{this.props.apptTableView ? 'Slot' : 'Table'} View</Link>
                    </div>
                </div>

                <SetVehicleLimitMoodal
                    date={moment(this.props.date).format('YYYY-MM-DD')}
                    openModel={vehicleLimitModal}
                    modelHandler={this.vehicleLimitModelHandler}
                    onSucessSubmit={this.onLimitSubmit}
                />

                <ChangeDayTimingsModal
                    openModel={changeTimingModal}
                    todayTiming={todayTiming}
                    date={this.props.date}
                    modelHandler={this.handleChangeTimingModal}
                    onSubmit={this.changeDayTimings}
                />

                <div style={{ display: 'none' }} id="divToPrint">
                    <table cellSpacing="0" align="center" style={{ width: "600px" }}>

                        <tbody>
                            <tr>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi Hi</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Datalatics Celestials</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi Hi</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Datalatics Celestials</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi Hi</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Datalatics Celestials</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                            </tr>
                            <tr>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                                <td colSpan="2" width="100" height="20" style={{ textAlign: 'center' }}> {moment(this.props.date).format('dddd, M/DD/yyyy')} </td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi </td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi </td>
                            </tr>
                            <tr>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi </td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                                <td colSpan="2" width="100" height="20" style={{ textAlign: 'center', fontSize: "12px" }}> {todayAppointments} appointments ( {todaysBookedCars} vehicles)  </td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi </td>
                                <td style={{ width: "200px", minWidth: "200px", opacity: "0" }}>Hi Hi Hi</td>
                                <td width="100" style={{ textAlign: 'center', }}>Total</td>
                            </tr>

                            {allSlots.map((item, i) => {
                                return (
                                    i % 3 === 0 && (
                                        <tr key={i} className="borderUppertr">
                                            <td className="align-middle text-center inline-block">
                                                <p style={{ marginTop: "15px", marginBottom: "12px", fontWeight: "bold", fontSize: "12px" }}>{i < allSlots.length && moment(allSlots[i].date).format('hh:mm A')}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block" style={{ borderRight: '2px solid black', minWidth: '200px', width: '200px', maxHeight: '20px' }}>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}> {allSlots[i]?.booked && `${this.truncate(allSlots[i]?.company_name)}`} </p>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}>{allSlots[i]?.booked && allSlots[i]?.car}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block">
                                                <p style={{ marginTop: "15px", marginBottom: "12px", fontWeight: "bold", fontSize: "12px" }}>{(i + 1) < allSlots.length && moment(allSlots[i + 1]?.date).format('hh:mm A')}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block" style={{ borderRight: '2px solid black', minWidth: '200px', width: '200px', maxHeight: '20px' }}>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}>{allSlots[i + 1]?.booked && `${this.truncate(allSlots[i + 1]?.company_name)}`}</p>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}>{allSlots[i + 1]?.booked && allSlots[i + 1]?.car}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block">
                                                <p style={{ marginTop: "15px", marginBottom: "12px", fontWeight: "bold", fontSize: "12px" }}>{(i + 2) < allSlots.length && moment(allSlots[i + 2]?.date).format('hh:mm A')}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block" style={{ borderRight: '2px solid black', minWidth: '200px', width: '200px', maxHeight: '20px' }}>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}>{allSlots[i + 2]?.booked && `${this.truncate(allSlots[i + 2]?.company_name)}`}</p>
                                                <p style={{ marginBottom: "0", fontSize: "12px" }}>{allSlots[i + 2]?.booked && allSlots[i + 2]?.car}</p>
                                            </td>
                                            <td className="align-middle text-center inline-block" style={{ borderBottom: '2px solid black', textAlign: 'center', maxHeight: '20px' }}>
                                                <p style={{ marginTop: "15px", marginBottom: "12px", fontWeight: "bold", fontSize: "12px" }}>{this.calculateTotalCars(i) > 0 && this.calculateTotalCars(i)}</p>
                                            </td>
                                        </tr>
                                    )
                                )
                            }
                            )}
                        </tbody>
                    </table>

                </div>
            </div>
        )

    }
}


const mapStateToProps = state => ({
    isMarkedAsHoliday: state.appointment.isMarkedAsHoliday,
    appointment: state.appointment,
    user: state.auth.user,
    weekDays: state.appointment.weekDays,
});

export default connect(mapStateToProps, { markThisDateAsHolidayAction, blockedThisDateAction, changeDayTimings })(ActionsDropDown)