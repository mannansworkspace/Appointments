import React, { Component } from 'react';

class AllowOnlineAppointments extends Component {

    render() {
        const { allow_online_appointments, mailingAddress, onlineApptDays, ApptStartingFrom, vehiclesLimit } = this.props.value


        return (
            <div className="sm:flex">
                <div className="sm:w-2/12 px-2 sm:px-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                        Online Appointments
                    </h3>
                </div>
                <div className="sm:w-10/12 mb-4 pt-6 px-2 sm:px-3 lg:px-6 bg-white shadow rounded-lg border border-gray-300 mb-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div className=" mb-4">
                            <div style={{ textAlign: 'left' }} className="mb-3 sm:w-3/6">
                                <label className="flex items-center mb-4">
                                    <input
                                        type="checkbox"
                                        onChange={this.props.onChangeHandler}
                                        name="allow_online_appointments"
                                        checked={allow_online_appointments}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Allow drivers to make appointments at </span>
                                </label>
                                <div className="flex items-center">
                                    <input disabled={!allow_online_appointments} type="text" onChange={this.props.onChangeHandler} name="warehouse_subdomain_name" value={this.props.value.warehouse_subdomain_name} className="shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                </div>
                            </div>

                            <div style={{ textAlign: 'left' }} className="mb-3 sm:w-3/6">
                                <div className="flex items-center">
                                    <span className="w-4/5">Email alerts will be sent to:</span>
                                    <input
                                        type="email"
                                        onChange={this.props.onChangeHandler}
                                        name="mailingAddress"
                                        value={mailingAddress}
                                        className=" w-full shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md"
                                        placeholder=""
                                    />
                                </div>
                            </div>

                            <div style={{ textAlign: 'left' }} className="mb-3 sm:w-2/3">
                                <div className="flex items-center ">
                                    <span className="w-5/6">How far ahead can drivers make appts?</span>
                                    <div className="mb-4">
                                        <select
                                            onChange={this.props.onChangeHandler}
                                            value={onlineApptDays}
                                            name="onlineApptDays"
                                            className="mt-1 -ml-60 block py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="1">1 day</option>
                                            <option value="2">2 days</option>
                                            <option value="3">3 days</option>
                                            <option value="4">4 days</option>
                                            <option value="5">5 days</option>
                                            <option value="6">6 days</option>
                                            <option value="7">7 days</option>
                                            <option value="8">8 days</option>
                                            <option value="9">9 days</option>
                                            <option value="10">10 days</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ textAlign: 'left' }} className="mb-3 sm:w-2/3">
                                <div className="flex items-center ">
                                    <span className="w-5/6">How soon can drivers make appointments?</span>
                                    <div className="mb-4 ">
                                        <select
                                            onChange={this.props.onChangeHandler}
                                            value={ApptStartingFrom}
                                            name="ApptStartingFrom"
                                            className="mt-1 -ml-60 block py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="0">Same Day</option>
                                            <option value="1">Atleast 1 day in Advance</option>
                                            <option value="2">Atleast 2 days in Advance</option>
                                            <option value="3">Atleast 3 days in Advance</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    onChange={this.props.onChangeHandler}
                                    name="showCustomerAutofill"
                                    checked={this.props.value.showCustomerAutofill}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">Show drivers autofill suggestions for your "Customers"</span>
                            </label>
                            <hr />
                            <div style={{ textAlign: 'left' }}>
                                <label className="flex items-center mb-4 mt-4">
                                    <input
                                        type="checkbox"
                                        onChange={this.props.vehicleLimitHandler}
                                        name="status"
                                        value="1"
                                        checked={vehiclesLimit.status}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Limit # of appointments </span>
                                </label>
                                {vehiclesLimit.status ? (
                                    <>
                                        <div style={{ textAlign: 'left' }} className="mb-3 sm:w-2/3">
                                            <div className="flex items-center ">
                                                <label htmlFor="vehiclesPerDay" className=" flex items-center mt-4">Maximum number of vehicles to receive per day?
                                                    <input
                                                        onChange={this.props.vehicleLimitHandler}
                                                        value={vehiclesLimit.vehiclesPerDay}
                                                        name="vehiclesPerDay"
                                                        type='number'
                                                        className="text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md ml-3"
                                                    />
                                                </label>

                                            </div>
                                            <div className="mt-0 ">
                                                <span className="text-sm text-red-600 font-normal">{vehiclesLimit.vehiclesPerDay > 400 || vehiclesLimit.vehiclesPerDay < 0 ? "Number of vehicles must be between 1 & 400" : null}</span>
                                            </div>
                                        </div>
                                        <div className="mb-8">
                                            <span className="w-full">What is the maximum number of vehicles you want to receive every 30 mins?</span>
                                            <div className="sm:w-10/12 mb-4">
                                                <select
                                                    onChange={this.props.vehicleLimitHandler}
                                                    value={vehiclesLimit.vehiclesPerSlot}
                                                    name="vehiclesPerSlot"
                                                    className="mt-1 block sm:w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                >
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="mb-32"></div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default AllowOnlineAppointments
