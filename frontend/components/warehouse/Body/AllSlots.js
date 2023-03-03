import React, { Component } from 'react';
import * as moment from 'moment';
import {
    getAppointmentApi, getWeeksdays,
    addExtraTimeSlotOnDay, removeExtraTimeSlotOnDay,
} from '../../../store/actions/appointmentAction';
import { connect } from 'react-redux'
import { AvailableSlot, DisabledSlot, BookedSlot, LunchTimeSlot } from '../../common/Slots';
import '../../common/Slot.css';
import _ from 'lodash'
import Loader from "react-loader-spinner";
import { convertTime12to24 } from '../../../utils/convertTime';


class AllSlots extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todayTiming: null,
            bookedAppointment: [],
            mergeAllSlots: false,
            allSlots: [],
            slotMenuID: null,
            showDropDown: false,
            lunchBreak: {},
            date: null,
            isLoading: true
        }

        this.interval = '';
        this.buttonRef = React.createRef();
    }

    setButtonRef = (node) => {
        this.buttonRef = node;
    }

    static getDerivedStateFromProps(props, state) {
        const { bookedAppointment } = props.appointment
        const { changedTimingsForThisDate, extraTimingsForThisDate, user, date } = props;

        // get today Timings from settings
        const day = moment(new Date(date)).format('dddd')
        const weekDays = _.cloneDeep(user.weekDays)
        const todayTiming = weekDays?.find(el => el.day === day)

        if (changedTimingsForThisDate) {
            // if today timing are set explicitly
            todayTiming["openTime"] = changedTimingsForThisDate.from_time
            todayTiming["closeTime"] = changedTimingsForThisDate.to_time
        }

        state.todayTiming = todayTiming

        if (bookedAppointment && JSON.stringify(bookedAppointment) !== JSON.stringify(state.bookedAppointment)) {
            state.bookedAppointment = bookedAppointment;
            state.mergeAllSlots = true;
        }

        if (extraTimingsForThisDate && JSON.stringify(extraTimingsForThisDate) !== JSON.stringify(state.extraTimingsForThisDate)) {
            state.extraTimingsForThisDate = extraTimingsForThisDate;
            state.mergeAllSlots = true;
        }

        if (user.lunchBreak && JSON.stringify(user.lunchBreak) !== JSON.stringify(state.lunchBreak)) {
            state.lunchBreak = user.lunchBreak
            state.mergeAllSlots = true;
        }

        if (todayTiming && !todayTiming.open) {
            state.mergeAllSlots = false;
        }

        return state;
    }
    componentDidMount() {
        this.props.getWeeksdays();
    }
    componentWillUnmount() {
        this.hideSlotMenu()
    }

    margeAllSlots = () => {
        const { todayTiming, bookedAppointment, extraTimingsForThisDate, lunchBreak } = this.state;

        const startTime = new Date(this.props.date)
        startTime.setHours(todayTiming.openTime.split(":")[0])
        if (todayTiming.openTime.includes(":")) {
            startTime.setMinutes(
                todayTiming.openTime.split(":")[1]
            )
        }

        const endTime = new Date(this.props.date)
        endTime.setHours(todayTiming.closeTime.split(":")[0])
        if (todayTiming.closeTime.includes(":")) {
            endTime.setMinutes(
                todayTiming.closeTime.split(":")[1]
            )
        }

        const lunchStartTime = new Date(this.props.date)
        lunchStartTime.setHours(
            lunchBreak?.startTime?.split(":")[0],
            lunchBreak?.startTime?.split(":")[1]
        )

        const lunchEndTime = new Date(this.props.date)
        lunchEndTime.setHours(
            lunchBreak?.endTime?.split(":")[0],
            lunchBreak?.endTime?.split(":")[1]
        )

        const { loadTime } = this.props.user;

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

        while (startTime.getTime() <= endTime.getTime()) {

            if (allSlots.findIndex(item => new Date(item.date).getTime() === startTime.getTime()) === -1) {

                const newSlot = {
                    date: startTime.getTime(),
                    booked: false
                }

                if (
                    lunchBreak?.status &&
                    startTime.getTime() >= lunchStartTime.getTime() &&
                    startTime.getTime() < lunchEndTime.getTime()
                ) {
                    newSlot['lunchBreak'] = true
                }

                allSlots.push(newSlot);
            }

            startTime.setMinutes(startTime.getMinutes() + parseInt(loadTime?.loadTime1To4 ? loadTime.loadTime1To4 : loadTime))
        }

        //sort asc all slots
        allSlots.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        })

        //show delete option
        // filter not used because we need all slots in new slots
        // also we check & count the number of extra slots for the same slot and save it in slotNo field 
        let slotNo = 0;
        const newSlots = allSlots.map((slot, key) => {

            const extraTimingForSlot = extraTimingsForThisDate.find(item => new Date(item.date).getTime() === new Date(slot.date).getTime())
            slotNo = new Date(allSlots[key - 1]?.date).getTime() === new Date(slot.date).getTime() ? ++slotNo : 0

            //if slot is booked and extra slot for this time is added but not booked
            if (slot.booked && !!extraTimingForSlot) {
                return {
                    ...slot,
                    showDelete: true,
                    deleteSlot: extraTimingForSlot,
                    slotNo
                }
            }
            //if slot is booked and extra slot for this time is added & booked
            else if (slot.booked) {
                return {
                    ...slot,
                    slotNo
                }
            }
            else {
                return {
                    ...slot
                }
            }
        })

        this.setState({
            allSlots: newSlots,
            mergeAllSlots: false,
        })
    }

    componentDidUpdate() {
        const { mergeAllSlots, todayTiming } = this.state;

        if (mergeAllSlots && todayTiming && todayTiming.open) {
            this.margeAllSlots()
        }
    }

    addListHandler = (item, time_slot) => {
        this.hideSlotMenu()
        this.props.addExtraTimeSlotOnDay(item, time_slot);
    }

    removeListHandler = (item, id) => {
        this.hideSlotMenu()
        this.props.removeExtraTimeSlotOnDay(item, id);
    }

    isEmpty = obj => Object.keys(obj).length === 0

    handleClickOutside = (event) => {

        if (this.state.slotMenuID !== null && this.buttonRef && !this.buttonRef.contains(event.target)) {
            this.hideSlotMenu()
        }
    }

    hideSlotMenu = () => {
        document.removeEventListener('click', this.handleClickOutside);
        this.slotMenuHandler(null)
    }

    slotMenuHandler = (slot) => {

        if (slot) {
            document.body.addEventListener('click', this.handleClickOutside, true)
        }

        this.setState({
            slotMenuID: slot
        })
    }

    calculateTotalCars = num => {
        let car = 0
        for (let i = num; i > num - 3; i--) {
            if (this.state.allSlots[i].booked) {
                car += +this.state.allSlots[i].car
            }
            // console.log(i,this.state.allSlots.length-1, i === this.state.allSlots.length-1 && i%3 !== 0)
            // if(i === this.state.allSlots.length-2) {
            //     console.log(car)
            //     break;
            // }
        }
        return car
    }

    render() {
        const { allSlots, slotMenuID, todayTiming, mergeAllSlots } = this.state;

        const timeFormat = parseInt(this.props.user.timeFormat);

        const abs_timeformat = Math.abs(timeFormat) >= 10 ? Math.abs(timeFormat) + '00' : '0' + Math.abs(timeFormat) + '00';

        let nowDateConvertedPerTimeZone =
            timeFormat ?
                timeFormat < 0 ? moment(new Date()).utcOffset('-' + abs_timeformat) : moment(new Date()).utcOffset('+' + abs_timeformat)
                : moment(new Date());

        // since we converted this date with utc offset, we lost the DST (Day Time Saving) offset. 
        // Now we need to check if DST is active and adujust 1 hour accordingly 
        nowDateConvertedPerTimeZone = moment(new Date()).isDST() ? nowDateConvertedPerTimeZone.add(30, 'minutes').format() : nowDateConvertedPerTimeZone.format();

        return (
            <div className="time-slot-tabs mt-5 flex flex-wrap" style={{ maxWidth: '1010px' }}>
                {mergeAllSlots ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    allSlots.length && todayTiming.open ?
                        allSlots.map((value, key) => {
                            const available = moment(value.date).format() > nowDateConvertedPerTimeZone

                            return <React.Fragment key={key}>
                                <div className="flex items-center mb-4">
                                    {
                                        !value.booked ?

                                            value.lunchBreak ?
                                                <LunchTimeSlot
                                                    slot={value}
                                                /> :

                                                available ?
                                                    <AvailableSlot
                                                        openModel={this.props.openModel}
                                                        slot={value}
                                                    />

                                                    :
                                                    <DisabledSlot
                                                        slot={value}
                                                    />
                                            :
                                            <>
                                                <BookedSlot
                                                    slot={value}
                                                    slotMenuID={slotMenuID}
                                                    addTimeSlot={this.addListHandler}
                                                    sidebarHandler={this.props.sidebarHandler}
                                                    slotMenuHandler={this.slotMenuHandler}
                                                    removeTimeSlot={this.removeListHandler}
                                                    setButtonRef={this.setButtonRef}
                                                />
                                            </>
                                    }
                                </div>
                                {(key + 1) % 3 === 0 &&
                                    <div className="flex items-center mb-4 h-16 w-8 cars-width">
                                        <span className="inline-block w-full">{this.calculateTotalCars(key)}</span>
                                    </div>
                                }
                                {/* {key+1 === allSlots.length && (key+1) % 3 !== 0 && (
                                    <div className="flex items-center mb-4 h-16 w-8 cars-width">                                    
                                        <span className="inline-block w-full">{this.calculateTotalCars(key)}</span>
                                    </div>
                                )} */}
                            </React.Fragment>
                        }) :
                        (<h1> No Slot is Available </h1>)
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    appointment: state.appointment,
    changedTimingsForThisDate: state.appointment.changedTimingsForThisDate,
    extraTimingsForThisDate: state.appointment.extraTimingsForThisDate
});

export default connect(mapStateToProps, { getWeeksdays, getAppointmentApi, addExtraTimeSlotOnDay, removeExtraTimeSlotOnDay })(AllSlots);