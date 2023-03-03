import React, { Component } from 'react'
import { connect } from 'react-redux'
import Switch from "react-switch";
class warehouse extends Component {
    render() {
        return (
            <div className="max-w-7xl mx-auto pt-6 pb-5 px-2 sm:px-3 lg:px-6 bg-white shadow rounded-lg border border-gray-300">
                <div className="space-y-6 sm:space-y-5">
                    <div className="sm:flex">
                        <div className="mb-3 sm:mb-0 sm:w-2/6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                                Warehouse Timings
                            </h3>
                        </div>
                        <div className="sm:w-9/12 px-2">
                            <div className="sm:w-5/12 mb-4">
                                <div>
                                    <label htmlFor="location" className="text-left block text-sm font-normal text-gray-900">  Time Zone</label>
                                    <select onChange={this.props.onChangeHandler} value={this.props.value.timeFormat} name="timeFormat" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option timezoneid="15" gmtadjustment="GMT-05:00" usedaylighttime="1" value="-5">(GMT-05:00) Eastern Time</option>
                                        <option timezoneid="5" gmtadjustment="GMT-08:00" usedaylighttime="1" value="-8">(GMT-08:00) Pacific Time</option>
                                        <option timezoneid="11" gmtadjustment="GMT-06:00" usedaylighttime="1" value="-6">(GMT-06:00) Central Time</option>
                                        <option timezoneid="9" gmtadjustment="GMT-07:00" usedaylighttime="1" value="-7">(GMT-07:00) Mountain Time</option>
                                        <option timezoneid="3" gmtadjustment="GMT-10:00" usedaylighttime="0" value="-10">(GMT-10:00) Hawaii</option>
                                        <option timezoneid="4" gmtadjustment="GMT-09:00" usedaylighttime="1" value="-9">(GMT-09:00) Alaska</option>
                                    </select>
                                </div>
                            </div>

                            {this.props.value.weekDays?.map((item, key) => {
                                return <div key={key} className="sm:flex items-center mb-3">
                                    <div className="flex sm:w-1/4 justify-between mt-3 mb-3 sm:m-0">
                                        <span>{item.day}</span>
                                        <button type="button" className="switch-btn  relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" aria-pressed="false">
                                            <span className="sr-only">Use setting</span>
                                            <Switch uncheckedIcon={false} checkedIcon={false} onColor={'#4f46e5'} onChange={(e) => this.props.handleChangeCheckBox(`${item.day}`, e)} checked={item.open} />
                                        </button>
                                    </div>
                                    {item.open ?
                                        <div className="flex items-center sm:ml-20">
                                            <select onChange={(e) => this.props.changeStartTime(`${item.day}`, e)} value={item.openTime} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                <option value="0">12:00 am</option>
                                                <option value="1">1:00 am</option>
                                                <option value="2">2:00 am</option>
                                                <option value="4">4:00 am</option>
                                                <option value="3">3:00 am</option>
                                                <option value="5">5:00 am</option>
                                                <option value="6">6:00 am</option>
                                                <option value="7">7:00 am</option>
                                                <option value="8" >8:00 am</option>
                                                <option value="9">9:00 am</option>
                                                <option value="10">10:00 am</option>
                                                <option value="11">11:00 am</option>
                                            </select>

                                            <span className="mx-4">to</span>

                                            <select onChange={(e) => this.props.changeEndTime(`${item.day}`, e)} value={item.closeTime} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                <option value="12">12:00 pm</option>
                                                <option value="13">1:00 pm</option>
                                                <option value="14">2:00 pm</option>
                                                <option value="15">3:00 pm</option>
                                                <option value="16">4:00 pm</option>
                                                <option value="17">5:00 pm</option>
                                                <option value="18">6:00 pm</option>
                                                <option value="19">7:00 pm</option>
                                                <option value="20">8:00 pm</option>
                                                <option value="21">9:00 pm</option>
                                                <option value="22">10:00 pm</option>
                                                <option value="23">11:00 pm</option>

                                            </select>
                                        </div>
                                        :
                                        <div className="flex items-center sm:ml-20">
                                            <span >Holiday</span>
                                        </div>
                                    }
                                </div>
                            })}
                            <div className="sm:w-3/6 mb-4">
                                <div>
                                    <label htmlFor="time" className="text-left block text-sm font-normal text-gray-900">  How long does it take you to offload 1 vehicle?</label>
                                    <select onChange={this.props.onChangeHandler} value={this.props.value.loadTime} name="loadTime" className="mt-1 block sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                        <option value="10">10 mins</option>
                                        <option value="15">15 mins</option>
                                        <option value="30">30 mins</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})
export default connect(mapStateToProps, {})(warehouse)
