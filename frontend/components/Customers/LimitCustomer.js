import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { limitCustomerVehicle } from '../../store/actions/customersAction';

const LimitCustomer = ({
    modelHandler,
    limitCustomerVehicle,
    customer,
    id
}) => {

    const [form, setForm] = useState({
        vehiclesLimit: '',
        errors: {}
    })

    const { vehiclesLimit } = form;
    let { errors } = form;

    useEffect(() => {
        if (customer) {
            setForm({
                vehiclesLimit: customer.customerVehicleLimit
            })
        }
    }, [customer, setForm])


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
            const data ={
                id: customer._id, 
                customerVehicleLimit: vehiclesLimit, 
                warehouseId: id
            }
            limitCustomerVehicle(data)

            setForm({
                vehiclesLimit: '',
                errors: {}
            })
            modelHandler()
        }

    }

    const errorHandler = () => {
        if (vehiclesLimit > 100 || vehiclesLimit < 0) {
            errors.vehiclesLimit = 'Number of vehicles must be between 0 & 100'
        }
        
        if (!vehiclesLimit?.length) {
            errors.vehiclesLimit = 'Please select number of vehicles'
        }

        setForm({
            ...form,
            errors: errors
        })

        return (Object.keys(errors).length)
    }

    const cancelHnadler = () => {
        if (!customer) {
            setForm({
                vehiclesLimit: '',
                errors: {}
            })
        }

        modelHandler()
    }
    
    return <div  className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                <div className="text-gray-900 font-medium text-center text-xl font-semibold">Set Daily Limit</div>
                <p className='text-center text-gray-500'>{customer?.customerName}</p>
                <div className="form-width mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                    <form onSubmit={submitLimit}>
                        <div className="max-w-7xl mx-auto bg-white mb-5">
                            <div className="space-y-6 sm:space-y-5">
                                <div className="sm:flex">

                                    <div>
                                        <div className="w-full px-2 mb-4">
                                            <label htmlFor="max_no_of_vehicle_receive" className="block text-sm font-normal text-gray-900">Maximum number of vehicles allowed per day:</label>
                                            <div className="mt-1">
                                                <input
                                                    onChange={onChangeHandle}
                                                    value={vehiclesLimit}
                                                    name="vehiclesLimit"
                                                    type='number'
                                                    className="text-center shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                                                />
                                                <span className="text-sm text-red-600 font-normal">{errors?.vehiclesLimit && errors.vehiclesLimit}</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex mb-12">
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

const mapStateToProps = state => ({
    id: state.auth?.user?._id
})

export default connect(mapStateToProps, { limitCustomerVehicle  })(LimitCustomer);