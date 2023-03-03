import React, { Component } from 'react'
import { connect } from 'react-redux'

class companySession extends Component {
    render() {
        return (
            <div className="max-w-7xl mx-auto pt-6 px-2 sm:px-3 lg:px-6 bg-white shadow rounded-lg border border-gray-300 mb-5">
                <div className="space-y-6 sm:space-y-5">
                    <div className="sm:flex">
                        <div className="sm:w-2/6 px-2 sm:px-0">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 text-left">
                                Carrier Edit Page
                            </h3>
                        </div>
                        <div className="sm:w-9/12">
                            <div className="sm:w-3/6 px-2 mb-4">
                                <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Company Name</label>
                                <div className="mt-1">
                                    <input type="text" onChange={this.props.onChangeHandler} name="company_name" value={this.props.value.company_name} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">First Name</label>
                                    <div className="mt-1">
                                        <input type="text" onChange={this.props.onChangeHandler} name="first_name" value={this.props.value.first_name} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>

                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Last Name</label>
                                    <div className="mt-1">
                                        <input type="text" onChange={this.props.onChangeHandler} name="last_name" value={this.props.value.last_name} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Phone Number</label>
                                    <div className="mt-1">
                                        <input type="text" maxLength="10" minLength="10" onChange={this.props.onChangeHandler} name="number" value={this.props.value.number} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>
                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Email</label>
                                    <div className="mt-1">
                                        <input type="email" onChange={this.props.onChangeHandler} name="email" value={this.props.value.email} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>
                            </div>
                            <div className="w-full px-2 mb-4">
                                <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">Street Address</label>
                                <div className="mt-1">
                                    <input type="text" onChange={this.props.onChangeHandler} name="address" value={this.props.value.address} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                </div>
                            </div>

                            <div className="sm:flex justify-between">
                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">City</label>
                                    <div className="mt-1">
                                        <input type="text" onChange={this.props.onChangeHandler} name="city" value={this.props.value.city} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>

                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">State/Province</label>
                                    <div className="mt-1">
                                        <input type="text" onChange={this.props.onChangeHandler} name="state" value={this.props.value.state} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
                                </div>

                                <div className="sm:w-3/6 px-2 mb-4">
                                    <label htmlFor="email" className="text-left block text-sm font-normal text-gray-900">ZIP / Postal</label>
                                    <div className="mt-1">
                                        <input maxLength="5" minLength="5" type="text" onChange={this.props.onChangeHandler} name="zip_code" value={this.props.value.zip_code} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                    </div>
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

export default connect(mapStateToProps, {})(companySession)
