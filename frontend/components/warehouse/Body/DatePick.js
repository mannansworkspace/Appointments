import React, { Component } from 'react';

class DateInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalender: true,
            month: '',
            year: '',
            datepickerValue: '',
            no_of_days: [],
            blankdays: [],
            days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }

    }

    initDate = () => {
        let today = new Date();
        this.setState({
            month: today.getMonth(),
            year: today.getFullYear(),
            datepickerValue: today.toDateString()
        }, () => {
            this.getNoOfDays()
        })
    }

    selectedDate = (date) => {
        const d = new Date(this.state.year, this.state.month, date);

        return d.toDateString() === this.state.datepickerValue ? true : false;
    }

    getDateValue = (date) => {
        let selectedDate = new Date(this.state.year, this.state.month, date);

        this.setState({
            datepickerValue: selectedDate.toDateString()
        })

        this.props.setDate(selectedDate);
    }

    getNoOfDays = () => {
        let daysInMonth = new Date(this.state.year, this.state.month + 1, 0).getDate();

        // find where to start calendar day of week
        let dayOfWeek = new Date(this.state.year, this.state.month).getDay();
        let blankdaysArray = [];
        for (var i = 1; i <= dayOfWeek; i++) {
            blankdaysArray.push(i);
        }

        let daysArray = [];
        for (var j = 1; j <= daysInMonth; j++) {
            daysArray.push(j);
        }

        this.setState({
            blankdays: blankdaysArray,
            no_of_days: daysArray
        })
    }
    componentDidMount() {
        this.initDate()
    }

    getPrevMonth = () => {
        const prevMonth = new Date(this.state.year, this.state.month, 0)

        this.setState({
            month: prevMonth.getMonth(),
            year: prevMonth.getFullYear()
        }, () => {
            this.getNoOfDays();
        })
    }

    getNextMonth = () => {
        const nextMonth = new Date(this.state.year, this.state.month + 2, 0)

        this.setState({
            month: nextMonth.getMonth(),
            year: nextMonth.getFullYear()
        }, () => {
            this.getNoOfDays();
        })
    }

    render() {

        return (

            <div className="relative">
                <input type="hidden" name="date" x-ref="date" />

                <div
                    ref={this.setCalenderRef}
                    className="bg-white mt-2 rounded-lg shadow p-4 absolute top-0 left-0"
                    style={{ width: '100%', display: 'block' }}
                >

                    <div className="flex justify-between items-center mb-2">
                        <div>
                            <span className="text-lg font-bold text-gray-800">{this.state.months[this.state.month]}</span>
                            <span x-text="year" className="ml-1 text-lg text-gray-600 font-normal">{this.state.year}</span>
                        </div>
                        <div>
                            <button onClick={this.getPrevMonth} type="button" className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full">
                                <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>
                            
                            <button onClick={this.getNextMonth} type="button" className="transition ease-in-out duration-100 inline-flex cursor-pointer hover:bg-gray-200 p-1 rounded-full">
                                <svg className="h-6 w-6 text-gray-500 inline-flex" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap mb-3 -mx-1">
                        {this.state.days.map((d, index) => (
                            <div key={index} style={{ width: '14.26%' }} className="px-1">
                                <div className="text-gray-800 font-medium text-center text-xs">{d}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap -mx-1 h-40">

                        {this.state.blankdays.map((blankd, index) => (
                            <div
                                key={index}
                                style={{ width: '14.28%' }}
                                className="text-center border p-1 border-transparent text-sm"
                            ></div>
                        ))}

                        {this.state.no_of_days.map((dy, index) => (
                            <div key={index} style={{ width: '14.28%' }} className="px-1 mb-1">
                                <div
                                    onClick={() => this.getDateValue(dy)}
                                    className={[this.selectedDate(dy) === true ? "bg-blue-500 text-white " : ' text-gray-700 hover:bg-blue-200 ', " cursor-pointer text-center text-sm leading-none rounded-full leading-loose transition ease-in-out duration-100  hover:bg-blue-200 py-1"]}
                                >{dy}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        );
    }
}

export default DateInput;
