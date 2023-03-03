import React, { Component } from 'react'

class accountSession extends Component {
    render() {
        return (
            <div className="sm:flex">
                <div className="sm:w-2/12 px-2 sm:px-0">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                        Account Information
                    </h3>
                </div>
                <div className="sm:w-10/12 pt-6 px-2 sm:px-3 lg:px-6 bg-white shadow rounded-lg border border-gray-300 mb-5">
                    <div className="space-y-6 sm:space-y-5">
                        <div className="sm:w-9/12">
                            <div className="sm:w-4/6 px-2 mb-4">
                                <label htmlFor="password" className=" text-left block text-sm font-normal text-gray-900">Current Password</label>
                                <div className="mt-1">
                                    <input type="password" onChange={this.props.onChangeHandler} name="oldPassword" value={this.props.value.oldPassword} className="shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter your old password" />
                                </div>
                            </div>
                            <div className="sm:w-3/6 px-2 mb-4">
                                <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Create Password</label>
                                <div className="mt-1">
                                    <input type="password" minLength="8" onChange={this.props.onChangeHandler} name="password" value={this.props.value.password} className="shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                </div>
                                <div className="text-left text-sm text-gray-600">Must be atleast 8 characters</div>
                            </div>
                            <div className="sm:w-3/6 px-2 mb-4">
                                <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Re-type Password</label>
                                <div className="mt-1">
                                    <input type="password" onChange={this.props.onChangeHandler} name="confirmPassword" value={this.props.value.confirmPassword} className="shadow-sm focus:ring-blue-700 focus:border-blue-700 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default accountSession
