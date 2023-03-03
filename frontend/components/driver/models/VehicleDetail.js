import React from 'react'

const VehicleDetail = ({
    make, 
    year, 
    modelC, 
    vinNumber,
    cancelModelValue,
    saveModelValue,
    onChangeHandler
}) => {
    return (
        <div  className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full">
                            <nav className="bg-white shadow">
                                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                                    <div className="relative flex justify-space-between h-12">
                                        <div className="flex-1 flex items-center justify-between sm:items-stretch">
                                            <div></div>
                                            <div className="">
                                                <div className="text-gray-900 font-medium text-center">Enter the vehicle details</div>
                                            </div>
                                            <div className="cursor-pointer" onClick={() => cancelModelValue(1)}>
                                                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </nav>

                            <div className="form-width mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                                <form onSubmit={(e) => saveModelValue(e, false)}>
                                    <div className="max-w-7xl mx-auto bg-white mb-5">
                                        <div className="space-y-6 sm:space-y-5">
                                            <div className="sm:flex">
                                                <div className="sm:w-10/12">
                                                    <div className="w-4/6 px-2 mb-4 relative">
                                                        <label htmlFor="cars" className="block text-sm font-normal text-gray-900">Year</label>
                                                        <input required type="text" maxLength="4" minLength="4" pattern="[0-9]{4}" onChange={onChangeHandler} name="year" value={year} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                    </div>

                                                    <div className="w-full px-2 mb-4">
                                                        <label htmlFor="email" className="block text-sm font-normal text-gray-900">Make</label>
                                                        <div className="mt-1">
                                                            <input required type="text" onChange={onChangeHandler} name="make" value={make} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                        </div>
                                                    </div>

                                                    <div className="w-full px-2 mb-4">
                                                        <label htmlFor="email" className="block text-sm font-normal text-gray-900">Model</label>
                                                        <div className="mt-1">
                                                            <input required type="text" onChange={onChangeHandler} name="modelC" value={modelC} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                        </div>
                                                    </div>

                                                    <div className="w-full px-2 mb-4">
                                                        <label htmlFor="email" className="block text-sm font-normal text-gray-900">Full vin#</label>
                                                        <div className="mt-1">
                                                            <input required type="text" onChange={onChangeHandler} name="vinNumber" value={vinNumber} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <button onClick={() => cancelModelValue(1)} type="button" className="w-28 mr-2 block justify-center py-2 px-4 border border-solid border-gray-400 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            Cancel
                                        </button>
                                        <button type="submit" className="w-28 ml-2 block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                            SAVE
                                    </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default VehicleDetail;
