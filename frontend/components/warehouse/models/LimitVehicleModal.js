import React from 'react';


const LimitVehicleModal = ({openModel,closeModel}) => {
    
    return(
        <div style={{ display: openModel ? "" : 'none' }} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="fixed top-5 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center p-0">
                    <div className="fixed inset-0 transition-opacity">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
                    <div className="bg-white items-center rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6 z-50" style={{width: '27%'}} role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:h-10 sm:w-10">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="sm:flex sm:items-start mt-5">
                            <div className="mt-3 text-center sm:mt-0 sm:text-left">
                                <h3 className="tracking-wide text-center text-lg leading-6 font-bold text-gray-700 heading-font text-black">
                                    Vehicle limit reached
                                </h3>
                                <div className="mt-2">
                                <p className="leading-5 text-gray-600 normal-font">
                                    You have reached the day???s vehicle limit.  To make more appts, please ???Change??? or ???Remove??? the limit.
                                </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <span className="mt-3 flex w-full rounded-md shadow-sm sm:mt-0">
                                <button onClick={ closeModel } type="button" className="bg-blue-700 text-white inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium shadow-sm hover:text-white-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                                    Go back to dashboard
                                </button>
                            </span>
                        </div>
                    </div>
                </div>
            </div>               
        </div>
    )
}

export default LimitVehicleModal;