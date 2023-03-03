import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { setVehicleLimitForADay } from '../../../store/actions/appointmentAction';

const LimitModal = ({
    openModel,
    modelHandler,
    date,
    setVehicleLimitForADay,
    perDayVehiclesLimit
}) => {

    const [form, setForm] = useState({
        max_no_of_vehicle_receive: '100',
        max_no_of_vehicle_want: '',
        errors: {}
    })

    const { max_no_of_vehicle_receive, max_no_of_vehicle_want } = form;
    let { errors } = form;

    useEffect(() => {
        if (perDayVehiclesLimit) {
            setForm({
                max_no_of_vehicle_receive: perDayVehiclesLimit.vehiclesPerDay,
                max_no_of_vehicle_want: perDayVehiclesLimit.vehiclesPerSlot
            })
        }
    }, [perDayVehiclesLimit, setForm])


    const onChangeHandle = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const submitLimit = (e) => {
        errors = {}
        e.preventDefault()
        if (errorHandler()) {
            return
        }
        else {
            setVehicleLimitForADay(
                date, max_no_of_vehicle_receive, max_no_of_vehicle_want)

            setForm({
                max_no_of_vehicle_receive: '100',
                max_no_of_vehicle_want: '',
                errors: {}
            })
            modelHandler()
        }

    }

    const errorHandler = () => {
        if (max_no_of_vehicle_receive > 400 || max_no_of_vehicle_receive < 1) {
            errors.max_no_of_vehicle_receive = 'Number of vehicles must be between 1 & 400'
        }

        if (max_no_of_vehicle_want.length <= 0) {
            errors.max_no_of_vehicle_want = 'Please select number of vehicles'
        }

        setForm({
            ...form,
            errors: errors
        })

        return (Object.keys(errors).length)
    }

    const cancelHnadler = () => {
        if (!perDayVehiclesLimit) {
            setForm({
                max_no_of_vehicle_receive: '100',
                max_no_of_vehicle_want: '',
                errors: {}
            })
        }

        modelHandler()
    }

    return <div style={{ display: openModel ? "" : 'none' }} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                <div className="text-gray-900 font-medium text-center text-xl font-semibold">Set vehicle limit</div>

                <div className="form-width mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                    <form onSubmit={submitLimit}>
                        <div className="max-w-7xl mx-auto bg-white mb-5">
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:flex">

                                    <div>
                                        <div className="w-full px-2 mb-4">
                                            <label htmlFor="max_no_of_vehicle_receive" className="block text-sm font-normal text-gray-900">Maximum number of vehicles to receive?</label>
                                            <div className="mt-1">
                                                <input

                                                    onChange={onChangeHandle}
                                                    value={max_no_of_vehicle_receive}
                                                    name="max_no_of_vehicle_receive"
                                                    type='number'
                                                    className="text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                                />
                                                <span className="text-sm text-red-600 font-normal">{errors?.max_no_of_vehicle_receive && errors.max_no_of_vehicle_receive}</span>
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <div className="mt-6">
                                                    <label htmlFor="max_no_of_vehicle_receive" className="block text-sm font-normal text-gray-900"><span>What is the maximum number of vehicles you want to </span><br />
                                                        <span>receive every 30 mins?</span></label>

                                                    <div className="mb-4">
                                                        <select onChange={onChangeHandle} value={max_no_of_vehicle_want} name="max_no_of_vehicle_want" className="mt-1 block w-36 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                                            <option></option>
                                                            <option value="4">4</option>
                                                            <option value="5">5</option>
                                                            <option value="6">6</option>
                                                            <option value="7">7</option>
                                                            <option value="8">8</option>
                                                            <option value="8">9</option>
                                                            <option value="10">10</option>
                                                            <option value="11">11</option>
                                                            <option value="12">12</option>
                                                        </select>
                                                    </div>
                                                    <span className="text-sm text-red-600 font-normal">{errors?.max_no_of_vehicle_want && errors.max_no_of_vehicle_want}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            <button type="button" onClick={cancelHnadler} className={`w-40 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black bg-white-700 hover:bg-white-600 focus:ring-white-500 focus:outline-none focus:ring-2 focus:ring-offset-2 border-gray-300`}>
                                Cancel
                            </button>
                            <button type="submit" className={`w-40 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 `}>
                                Confirm
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

}

export default connect(null, { setVehicleLimitForADay })(LimitModal);