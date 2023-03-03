import React, { useState, useEffect } from "react";
import { Text, SafeAreaView, StyleSheet, FlatList, View, LogBox } from 'react-native'
import Slot from "./slot";
import { connect } from "react-redux";
import { createAppointment } from '../../store/actions/appointment';
import Spinner from "../common/Spinner";
import moment from 'moment'
import _ from 'lodash'
import { useDispatch } from "react-redux";

const AvailableSlots = ({ date, numberOfCar, navigation, isLoading, appointmentReducer, user , customerName}) => {

  const dispatch = useDispatch()
  const {
    warehouse,
    changedTimingsForThisDate,
    isMarkedAsHoliday,
    isBlockedFurtherAppointments,
    appointment
  } = appointmentReducer;

  const [todayTiming, setTodayTiming] = useState(null)
  const [allSlots, setAllSlots] = useState([])
  const [slotMessage, setSlotMessage] = useState(null)
  const [nowDateConvertedPerTimeZone, setNowDateConvertedPerTimeZone] = useState(0)


  useEffect(()=>{
    appointment && navigation.navigate('AppointmentDetail')
  },[appointment])

  useEffect(() => {
    const day = moment(new Date(date)).format('dddd')
    const weekDays = _.cloneDeep(warehouse.weekDays)
    const todayTiming = weekDays?.find(el => el.day === day)

    if (changedTimingsForThisDate) {
      // if today timing are set explicitly
      todayTiming["openTime"] = changedTimingsForThisDate.from_time
      todayTiming["closeTime"] = changedTimingsForThisDate.to_time
    }

    setTodayTiming(todayTiming)

    const timeFormat = parseInt(warehouse.timeFormat);
        
    const abs_timeformat = Math.abs(timeFormat) >= 10 ? Math.abs(timeFormat) + '00' : '0' + Math.abs(timeFormat) + '00';
    
    let nowDateConvertedPerTimeZone =
    timeFormat ?
    timeFormat < 0 ? moment(new Date()).utcOffset('-' + abs_timeformat) : moment(new Date()).utcOffset('+' + abs_timeformat)
    : moment(new Date());
    
    // since we converted this date with utc offset, we lost the DST (Day Time Saving) offset. 
    // Now we need to check if DST is active and adujust 1 hour accordingly 
    nowDateConvertedPerTimeZone = moment(new Date()).isDST() ? nowDateConvertedPerTimeZone.add(1, 'hours').format() : nowDateConvertedPerTimeZone.format();
    setNowDateConvertedPerTimeZone(nowDateConvertedPerTimeZone)

  }, [date])

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    if (todayTiming && todayTiming.open){
      margeAllSlots()
      // setSlotMessage(null)
    } else{
      setAllSlots([])
      setSlotMessage('No Slot is Available')
    }
  }, [todayTiming, numberOfCar])
  
  const convertTime12to24 = (time12h) => {
    const [time, modifier] = time12h.split(' ');

    let [hours] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return hours;
  }


  const margeAllSlots = () => {
    
    const { limit_appointments, loadTime, number_of_vehicles, lunchBreak } = warehouse;
    const { perDayVehiclesLimit, warehouseVehiclesLimit,bookedAppointment, extraTimingsForThisDate, } = appointmentReducer

  
    // default start timing 
    const currentTime = new Date(date)
    currentTime.setHours(todayTiming.openTime.split(":")[0])
    if (todayTiming.openTime.includes(":")) {
      currentTime.setMinutes(
        todayTiming.openTime.split(":")[1]
      )
    }

    // default end timing calculation
    const endTime = new Date(date)
    endTime.setHours(todayTiming.closeTime.split(":")[0])
    if (todayTiming.closeTime.includes(":")) {
      endTime.setMinutes(
        todayTiming.closeTime.split(":")[1]
      )
    }

    // lunch start time calculation
    const lunchStartTime = new Date(date)
    lunchStartTime.setHours(
      lunchBreak?.startTime?.split(":")[0],
      lunchBreak?.startTime?.split(":")[1]
    )

    //lunch end time calculation
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
    if (warehouseVehiclesLimit && warehouseVehiclesLimit.vehiclesPerDay) {

      // console.log('b',bookedAppointment)

      const totalBookedCount = bookedAppointment.reduce((a, b) => a + parseInt(b.car), parseInt(numberOfCar))

      // console.log('p', totalBookedCount, perDayVehiclesLimit.totalVehicles);

      if (totalBookedCount > warehouseVehiclesLimit.vehiclesPerDay) {
        // console.log('condition')
        setSlotMessage('The warehouse has reached the vehicle limit for this date. Please select another date.')
        setAllSlots([])
        
        return;
      }
      else{
        setSlotMessage(null);
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
        let cars = 0;

        if (limit_appointments) {
          cars = number_of_vehicles
        }

        if (warehouseVehiclesLimit) {
          cars = warehouseVehiclesLimit.vehiclesPerDay
        }

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

          // console.log(afterTime, beforeTime);

          number = Math.max(beforeTime, afterTime);
        }
        // console.log(number, parseInt(numberOfCar)+cars)
        if (cars >= number + (+numberOfCar) || (!warehouseVehiclesLimit && !limit_appointments)) {
          allSlots.push({
            date: currentTime.getTime(),
            booked: false
          });

        }

      }

      currentTime.setMinutes(currentTime.getMinutes() + parseInt(loadTime?.loadTime1To4 ? loadTime.loadTime1To4 : loadTime))
    }

    const availableSlots = allSlots.filter(slot => moment(new Date(slot.date)).format() > nowDateConvertedPerTimeZone)
    // console.log(" hjeeeeeeyyyy available slots are : ",availableSlots)
    
    //sort asc all slots  
    availableSlots.sort(function (a, b) {
      return new Date(a.date) - new Date(b.date);
    })

    if (!availableSlots.length) {
      setSlotMessage('All available times have been booked for this date. Please select another date.');
      return;
    }

    setAllSlots(availableSlots)
    setSlotMessage(null);
  }

  const onPressSlot = async (appointmentSlot) => {
    console.log("Appointment Selected")
    const { company_name, email, number } = user;

    const data = {
      appointmentTimeSlot:  moment(new Date(appointmentSlot)).format("h:mm a"),
      company_name,
      email,
      number,
      car: numberOfCar,
      warehouse_id: warehouse,
      date: appointmentSlot,
      onlineBooked: true,
      customerName : customerName,
      fromMobile : true
    }
    dispatch(createAppointment(data));
  }


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        Available times for
        <Text style={{ fontWeight: 'bold' }}> {date.toDateString()}:</Text>
      </Text>
      {isMarkedAsHoliday && <Text>Is Marked as holiday</Text>}
      {isBlockedFurtherAppointments && <Text style={{marginLeft: 10, marginTop: 10}}>The warehouse has blocked further appointments for this date. Please select another date.</Text>}
      {slotMessage && <Text style={{marginLeft: 10, marginTop: 10}}>{slotMessage}</Text> }
      {isLoading ?
        <Spinner />
        :
        <>
        {
        !isMarkedAsHoliday && !isBlockedFurtherAppointments && (
          <FlatList
            data={allSlots}
            renderItem={({ item }) => <Slot item={item} onPress={onPressSlot} />}
            keyExtractor={(item) => item.date}
          />
        )}
        </>
      }
    </SafeAreaView>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user,
  appointmentReducer: state.appointmentReducer,
  isLoading: state.pageReducer.loading
})

export default connect(mapStateToProps, { createAppointment })(AvailableSlots);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    marginTop: 20,
    marginHorizontal: 10
  },
})