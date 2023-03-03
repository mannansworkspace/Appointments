import React, { Component } from 'react'
import Switch from "react-switch";
import timingOptionList from '../../../utils/timingOptionList'

class WarehouseTimings extends Component {

    render() {
        const { value, onChangeHandler, changeStartTime, changeEndTime, changeLunchBreak, changeLoadTime} = this.props;

        const openTimingList= timingOptionList('00:00', '11:30', 30) 
        const closeTimingList= timingOptionList('12:00', '23:30', 30)

        return (
            <div className="sm:flex">
                <div className="mb-3 sm:mb-0 sm:w-2/12">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                        Warehouse Timings
                    </h3>
                </div>
                <div className="sm:w-10/12 pt-6 pb-5 px-2 sm:px-3 lg:px-6 bg-white shadow rounded-lg border border-gray-300 mb-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div className="sm:w-9/12 px-2">
                            <div className="sm:w-5/12 mb-4">
                                <div>
                                    <label htmlFor="location" className="text-left block text-sm font-normal text-gray-900">  Time Zone</label>
                                    <select onChange={onChangeHandler} value={value.timeFormat} name="timeFormat" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option timezoneid="15" gmtadjustment="GMT-05:00" usedaylighttime="1" value="-5">(GMT-05:00) Eastern Time</option>
                                        <option timezoneid="5" gmtadjustment="GMT-08:00" usedaylighttime="1" value="-8">(GMT-08:00) Pacific Time</option>
                                        <option timezoneid="11" gmtadjustment="GMT-06:00" usedaylighttime="1" value="-6">(GMT-06:00) Central Time</option>
                                        <option timezoneid="9" gmtadjustment="GMT-07:00" usedaylighttime="1" value="-7">(GMT-07:00) Mountain Time</option>
                                        <option timezoneid="3" gmtadjustment="GMT-10:00" usedaylighttime="0" value="-10">(GMT-10:00) Hawaii</option>
                                        <option timezoneid="4" gmtadjustment="GMT-09:00" usedaylighttime="1" value="-9">(GMT-09:00) Alaska</option>
                                        
                                    </select>
                                </div>
                            </div>

                            {value.weekDays?.map((item, key) => {
                                return <div key={key} className="sm:flex items-center mb-3">
                                    <div className="flex sm:w-1/4 justify-between mt-3 mb-3 sm:m-0">
                                        <span>{item.day}</span>
                                        <button type="button" className="switch-btn  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-pressed="false">
                                            <span className="sr-only">Use setting</span>
                                            <Switch uncheckedIcon={false} checkedIcon={false} onColor={'#1d4fd8'} onChange={(e) => this.props.handleChangeCheckBox(`${item.day}`, e)} checked={item.open} />
                                        </button>
                                    </div>
                                    
                                    {item.open ?
                                        <div className="flex items-center sm:ml-20">
                                            <select 
                                                onChange={(e) => changeStartTime(`${item.day}`, e)} 
                                                value={item.openTime} 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                {openTimingList}
                                            </select>

                                            <span className="mx-4">to</span>
                                        
                                            <select 
                                                onChange={(e) => changeEndTime(`${item.day}`, e)} 
                                                value={item.closeTime} 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                {closeTimingList}
                                            </select>
                                        </div>
                                        :
                                        <div className="flex items-center sm:ml-20">
                                            <span >Holiday</span>
                                        </div>
                                    }
                                </div>
                            })}
                            <div className="sm:w-3/6 mb-4 mt-10">
                                <div>
                                    <label htmlFor="time" className="text-left block text-sm font-normal text-gray-900">  How long does it take you to offload vehicles?</label>
                                    <div className='flex items-center mt-6'>
                                        <label htmlFor="time" className="text-left text-base block text-sm font-normal text-gray-900">  1 to 4 vehicles: </label>
                                        <select 
                                            onChange={changeLoadTime} 
                                            value={value.loadTime.loadTime1To4}  
                                            name="loadTime1To4" 
                                            className="ml-5 mt-1 block sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="10">10 mins</option>
                                            <option value="15">15 mins</option>
                                            <option value="30">30 mins</option>
                                        </select>
                                    </div>

                                    <div className='flex items-center mt-6'>
                                        <label htmlFor="time" className="text-left text-base block text-sm font-normal text-gray-900">  5 to 7 vehicles: </label>
                                        <select 
                                            onChange={changeLoadTime} 
                                            value={value.loadTime.loadTime5To7}  
                                            name="loadTime5To7" 
                                            className="ml-5 mt-1 block sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="30">30 mins</option>
                                            <option value="45">45 mins</option>
                                            <option value="60">1 hour</option>
                                        </select>
                                    </div>

                                    <div className='flex items-center mt-6'>
                                        <label htmlFor="time" className="text-left text-base block text-sm font-normal text-gray-900">  8 to 9 vehicles: </label>
                                        <select 
                                            onChange={changeLoadTime} 
                                            value={value.loadTime.loadTime8To9}  
                                            name="loadTime8To9" 
                                            className="ml-5 mt-1 block sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="30">30 mins</option>
                                            <option value="45">45 mins</option>
                                            <option value="60">1 hour</option>
                                            <option value="90">1.5 hour</option>
                                            <option value="120">2 hour</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{textAlign: 'left'}} className="mb-3">
                                <label className="flex items-center mb-4">
                                    <input 
                                        type="checkbox" 
                                        onChange={changeLunchBreak} 
                                        name="status"
                                        checked={value.lunchBreak?.status} 
                                        className="form-checkbox" 
                                    />
                                    <span className="ml-2">Lunch Break </span>
                                    <div className="flex items-center sm:ml-20">
                                            <select 
                                                disabled={!value.lunchBreak?.status}
                                                onChange={changeLunchBreak} 
                                                value={value.lunchBreak?.startTime} 
                                                name='startTime' 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                { timingOptionList('00:00', '23:00', 30) }
                                            </select>

                                            <span className="mx-4">to</span>
                                        
                                            <select 
                                                disabled={!value.lunchBreak?.status }
                                                onChange={changeLunchBreak} 
                                                value={value.lunchBreak?.endTime}
                                                name='endTime' 
                                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                            >
                                                { timingOptionList( value.lunchBreak?.startTime, '24:00', 30) }
                                            </select>
                                        </div>
                                </label>
                            </div>

                            <div style={{textAlign: 'left'}} className="mb-3">
                                <label className="flex items-center mb-4">
                                    <input 
                                        type="checkbox" 
                                        onChange={onChangeHandler} 
                                        name="duplicateSlot"
                                        checked={value.duplicateSlot} 
                                        className="form-checkbox" 
                                    />
                                    <span className="ml-2">Automatically add duplicate time-slot for same time </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default WarehouseTimings;
