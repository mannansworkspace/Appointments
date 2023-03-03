import React, { Component } from 'react';
import * as moment from 'moment';
import {
    saveApptData
} from '../../store/actions/appointmentAction';
import { connect } from 'react-redux'
import { AvailableSlot } from '../common/Slots';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import Loader from "react-loader-spinner";
import { convertTime12to24 } from '../../utils/convertTime';

class AllSlots extends Component {

    constructor(props) {
        super(props);

        this.state = {
            todayTiming: null,
            bookedAppointment: [],
            mergeAllSlots: false,
            allSlots: [],
            date: null,
            extraTimingsForThisDate: [],
            numberOfCar: 0,
            slotMessage: 'No Slot is Available',
            customerName: ''
        }
    }

    componentDidMount() {
        this.margeAllSlots()
    }

    static getDerivedStateFromProps(props, state) {
        const { numberOfCar, warehouse, changedTimingsForThisDate, date, bookedAppointment, extraTimingsForThisDate, customerName } = props;
        const { vehiclesLimit } = props.warehouse
        const { perDayVehiclesLimit } = props
        //set state  for available vehicle limit 
        state.vehicleLimit = vehiclesLimit

        if (perDayVehiclesLimit) {
            state.vehicleLimit = {
                vehiclesPerDay: perDayVehiclesLimit.vehiclesPerDay,
                vehiclesPerSlot: perDayVehiclesLimit.vehiclesPerSlot,
                status: true,
            }
        }
        console.log("in All slots perday vehicle limit", state.vehicleLimit)

        if (JSON.stringify(date) !== JSON.stringify(state.date)) {
            state.date = date;
            // get today Timings from settings
            const day = moment(new Date(date)).format('dddd')
            const weekDays = _.cloneDeep(warehouse.weekDays)
            const todayTiming = weekDays?.find(el => el.day === day)

            state.todayTiming = todayTiming
            if (changedTimingsForThisDate) {
                // if today timing are set explicitly
                state.todayTiming["openTime"] = changedTimingsForThisDate.from_time
                state.todayTiming["closeTime"] = changedTimingsForThisDate.to_time
            }

            state.mergeAllSlots = true;
        }

        if (bookedAppointment && JSON.stringify(bookedAppointment) !== JSON.stringify(state.bookedAppointment)) {
            state.bookedAppointment = bookedAppointment;
            state.mergeAllSlots = true;
        }

        if (extraTimingsForThisDate && JSON.stringify(extraTimingsForThisDate) !== JSON.stringify(state.extraTimingsForThisDate)) {
            state.extraTimingsForThisDate = extraTimingsForThisDate;
            state.mergeAllSlots = true;
        }

        if (extraTimingsForThisDate && JSON.stringify(extraTimingsForThisDate) !== JSON.stringify(state.extraTimingsForThisDate)) {
            state.extraTimingsForThisDate = extraTimingsForThisDate;
            state.mergeAllSlots = true;
        }

        if (numberOfCar && JSON.stringify(numberOfCar) !== JSON.stringify(state.numberOfCar)) {
            state.numberOfCar = numberOfCar;
            state.mergeAllSlots = true;
        }

        if (customerName && JSON.stringify(customerName) !== JSON.stringify(state.customerName)) {
            state.customerName = customerName;
            state.mergeAllSlots = true;
        }

        return state;
    }

    margeAllSlots = () => {
        const { todayTiming, bookedAppointment, extraTimingsForThisDate, date } = this.state;
        const { loadTime, lunchBreak } = this.props.warehouse

        const { status: limitStatus, vehiclesPerDay, vehiclesPerSlot } = this.state.vehicleLimit || {}

        const currentTime = new Date(date)
        currentTime.setHours(todayTiming.openTime.split(":")[0])
        if (todayTiming.openTime.includes(":")) {
            currentTime.setMinutes(
                todayTiming.openTime.split(":")[1]
            )
        }

        const endTime = new Date(date)
        endTime.setHours(todayTiming.closeTime.split(":")[0])
        if (todayTiming.closeTime.includes(":")) {
            endTime.setMinutes(
                todayTiming.closeTime.split(":")[1]
            )
        }

        const lunchStartTime = new Date(date)
        lunchStartTime.setHours(
            lunchBreak?.startTime?.split(":")[0],
            lunchBreak?.startTime?.split(":")[1]
        )

        const lunchEndTime = new Date(date)
        lunchEndTime.setHours(
            lunchBreak?.endTime?.split(":")[0],
            lunchBreak?.endTime?.split(":")[1]
        )

        const allSlots = [
            ...extraTimingsForThisDate.map(x => ({ 
                ...x, 
                booked: false,
                date: (new Date(x.date).setHours(
                    convertTime12to24(x.time_slot),
                    x.time_slot.split(":")[1].slice(0, 2)
                )) 
            }))
        ];

        // COUNT IF TOTAL DAY LIMIT IS EXCEDE
        if (limitStatus) {
            console.log("limit status", limitStatus)
            const totalBookedCount = bookedAppointment.reduce((a, b) => a + parseInt(b.car), parseInt(this.state.numberOfCar))

            if (totalBookedCount > (vehiclesPerDay)) {

                this.setState({
                    allSlots: [],
                    mergeAllSlots: false,
                    slotMessage: 'The warehouse has reached the vehicle limit for this date. Please select another date.'
                })

                return;
            }
        }

        while (currentTime.getTime() <= endTime.getTime()) {
            let isLunchTime = false;
            if (
                lunchBreak?.status &&
                currentTime.getTime() >= lunchStartTime.getTime() &&
                currentTime.getTime() < lunchEndTime.getTime()
            ) {

                isLunchTime = true
            }

            if (!isLunchTime && bookedAppointment.findIndex(item => (new Date(item.date).setHours(convertTime12to24(item.time_slot), item.time_slot.split(":")[1].slice(0, 2))) === currentTime.getTime()) === -1) {
                let number = 0
                const cars = limitStatus ? vehiclesPerSlot : 0;


                if (cars > 0) {
                    const before = new Date(currentTime)
                    before.setMinutes(currentTime.getMinutes() - 30);
                    const after = new Date(currentTime)
                    after.setMinutes(currentTime.getMinutes() + 30);

                    const beforeTime = bookedAppointment.filter(item =>
                        new Date(item.date).getTime() > before.getTime() &&
                        new Date(item.date).getTime() <= currentTime.getTime()
                    ).reduce((a, b) => a + parseInt(b.car), 0)

                    const afterTime = bookedAppointment.filter(item =>
                        new Date(item.date).getTime() < after.getTime() &&
                        new Date(item.date).getTime() >= currentTime.getTime()
                    ).reduce((a, b) => a + parseInt(b.car), 0)

                    number = Math.max(beforeTime, afterTime);
                }

                if ((!limitStatus) || cars >= (number + +this.state.numberOfCar)) {
                    allSlots.push({
                        date: currentTime.getTime(),
                        booked: false
                    });

                }

            }

            currentTime.setMinutes(currentTime.getMinutes() + parseInt(loadTime?.loadTime1To4 ? loadTime.loadTime1To4 : loadTime))
        }

        //sort asc all slots
        allSlots.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date);
        })

        if (!allSlots.length) {
            this.setState({
                slotMessage: 'All available times have been booked for this date. Please select another date.'
            })
        }

        this.setState({
            allSlots,
            mergeAllSlots: false,
        })
    }

    componentDidUpdate() {
        if (this.state.mergeAllSlots) {
            this.margeAllSlots()
        }
    }

    modelOpen = (item) => {
        const { warehouse } = this.props

        this.props.saveApptData({
            timeSlot: item,
            warehouse,
            numberOfCar: this.state.numberOfCar,
            customerName: this.state.customerName
        })

        this.props.history.push('/driver')
    }

    render() {
        const { allSlots, todayTiming, slotMessage, mergeAllSlots } = this.state;
        const timeFormat = parseInt(this.props.warehouse.timeFormat);
        const abs_timeformat = Math.abs(timeFormat) >= 10 ? Math.abs(timeFormat) + '00' : '0' + Math.abs(timeFormat) + '00';

        let nowDateConvertedPerTimeZone =
            timeFormat ?
                timeFormat < 0 ? moment(new Date()).utcOffset('-' + abs_timeformat) : moment(new Date()).utcOffset('+' + abs_timeformat)
                : moment(new Date());

        // since we converted this date with utc offset, we lost the DST (Day Time Saving) offset. 
        // Now we need to check if DST is active and adujust 1 hour accordingly 
        nowDateConvertedPerTimeZone = moment(new Date()).isDST() ? nowDateConvertedPerTimeZone.add(1, 'hours').format() : nowDateConvertedPerTimeZone.format();

        return (
            <div className="flex flex-wrap">
                {mergeAllSlots ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    todayTiming.open && allSlots.length ? allSlots.map((value, key) => {

                        const available = moment(value.date).format() > nowDateConvertedPerTimeZone
                        return <div key={key}>
                            {available ?
                                <div className={"flex items-center mb-4 overflow-x-auto"}>
                                    <AvailableSlot
                                        openModel={this.modelOpen}
                                        slot={value}
                                    />
                                </div>
                                :
                                null
                            }
                        </div>
                    }) : <h4 className='text-left'>{slotMessage}</h4>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    warehouse: state.appointment.warehouse,
    user: state.auth.user,
    bookedAppointment: state.appointment.bookedAppointment,
    changedTimingsForThisDate: state.appointment.changedTimingsForThisDate,
    perDayVehiclesLimit: state.appointment.perDayVehiclesLimit,
    extraTimingsForThisDate: state.appointment.extraTimingsForThisDate,
});

export default connect(mapStateToProps, { saveApptData })(withRouter(AllSlots));