import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableHighlight} from 'react-native';
import { ChevronRightIcon, ChevronLeftIcon } from 'react-native-heroicons/outline';

const DateInput = ({date, onlineApptDays, setDate , ApptStartingFrom}) => {
    // console.log(date)
    let setCalenderRef = useRef(null);
    const[showCalender, setShowCalender] = useState(false);
    const[month, setMonth] = useState('');
    const[year, setYear] = useState('');
    const[datepickerValue, setDatepickerValue] = useState(date ? date.toDateString() : '');
    const[no_of_days, setNo_of_days] = useState([]);
    const[blankdays, setBlankdays] = useState([]);


    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const[selectedDay, setSelectedDay] = useState('');

    useEffect(() => {
        // console.log('called')
        initDate();
    }, [])

    useEffect(() => {
        getNoOfDays();
    }, [year, month])

    const initDate = () => {

        let today = date ? date : new Date();
        // console.log(today.getMonth(), today.getFullYear())
        setMonth(today.getMonth());
        setYear(today.getFullYear())
    }

    const selectedDate = (date) => {
        // console.log(month, year)
        const d = (new Date(`${month + 1}/${date}/${year}`));
        // console.log('p',datepickerValue)
        return d.toDateString() === datepickerValue ? true : false;
    }

    const getDateValue = (date) => {

        // let selectedDate = new Date(this.state.year, this.state.month, date);
        let selectedDate = (new Date(`${month + 1}/${date}/${year}`));
        // console.log(selectedDate.toDateString())
        setDatepickerValue(selectedDate.toDateString());

        setDate(selectedDate);
    }

    const getNoOfDays = () => {
        let daysInMonth = new Date(year, month + 1, 0).getDate();

        // find where to start calendar day of week
        let dayOfWeek = new Date(year, month).getDay();
        let blankdaysArray = [];
        for (var i = 1; i <= dayOfWeek; i++) {
            blankdaysArray.push(i);
        }

        let daysArray = [];
        for (var j = 1; j <= daysInMonth; j++) {
            daysArray.push(j);
        }

        setBlankdays(blankdaysArray);
        setNo_of_days(daysArray);
    }

    const getPrevMonth = () => {
        const prevMonth = new Date(year, month, 0)

        setMonth(prevMonth.getMonth());
        setYear(prevMonth.getFullYear());
    }

    const getNextMonth = () => {
        const nextMonth = new Date(year, month + 2, 0);

        setMonth(nextMonth.getMonth());
        setYear(nextMonth.getFullYear());
    }

// subtract the days from date while creating new date 
    const inRange = (date) => {
        let d;
        if(date === new Date().getDate()){
            d = new Date(year, month, ApptStartingFrom ?  date-ApptStartingFrom : date)
        }else{
            d = new Date(year, month, date);// subtract the days from date while creating new date             
        }
        const startDate = new Date(new Date().toDateString())
        const endDate = new Date()
        const days = onlineApptDays ? onlineApptDays - 1  : 4;
        endDate.setDate(startDate.getDate() + days);
        
        return d >= startDate && d <=endDate && d.toDateString() !== datepickerValue ? true : false;
    }

    return (
        <View>
            <View
                ref={ref => setCalenderRef = ref}
                style={{ width: '100%',marginTop: 8, borderRadius: 8, backgroundColor: '#fff', elevation: 3, padding: 16 }}
            >

                <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '35%'}}>
                        <Text style={{fontWeight: 'bold'}}>{months[month]}</Text>
                        <Text>{year}</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <TouchableHighlight underlayColor='none' onPress={getPrevMonth} >
                            <ChevronLeftIcon style={{color: 'rgba(107, 114, 128)'}} />
                        </TouchableHighlight>
                        <TouchableHighlight underlayColor='none' onPress={getNextMonth}>
                            <ChevronRightIcon style={{ color: 'rgba(107, 114, 128)'}} />
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={{display: 'flex', flexDirection: 'row', marginBottom: 12}}>
                    {days.map((d, index) => (
                        <View key={index} style={{ width: '14.26%', paddingHorizontal: 4 }}>
                            <View style={{}}><Text style={{fontWeight: 'bold'}}>{d}</Text></View>
                        </View>
                    ))}
                </View>

                <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: 160, alignItems: 'center'}}>

                    {blankdays.map((blankd, index) => (
                        <View
                            key={index}
                            style={{ width: '14.28%', borderWidth: 1, borderColor: 'transparent', padding: 4 }}
                        ></View>
                    ))}
                    
                    {no_of_days.map((dy, index) => {
                        
                        let daySlot = <View style={{paddingVertical: 4, borderRadius: 99999}}><Text style={{color: '#c8cbd0', textAlign: 'center'}}>{dy}</Text></View>
                        if(selectedDate(dy)){
                            daySlot = <View style={{backgroundColor: '#3f83f8', borderRadius: 9999}}><Text style={{textAlign: 'center', color: 'white'}} onPress={() => getDateValue(dy)}>{dy}</Text></View>
                        }
                        else if(inRange(dy)){
                            daySlot = <View><Text style={{color: 'black', textAlign: 'center'}} onPress={() => getDateValue(dy)}>{dy}</Text></View>

                        }
                        
                        return(
                        <View key={index} style={{ width: '14.28%', paddingHorizontal: 4, marginBottom: 4 }}>
                            { daySlot }
                        </View>
                        )
                    })}

                </View>
            </View>

        </View>

    );
}

// function dateInputPropsAreEqual(prevDate, nextDate){
//     console.log('p', prevDate, nextDate)
//     // if(prevDate.onlineApptDays !== nextDate.onlineApptDays && prevDate.date !== nextDate.date){
//     //     return true;
//     // }
//     return true;
// }

export default DateInput;