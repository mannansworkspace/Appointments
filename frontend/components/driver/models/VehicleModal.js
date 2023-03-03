import React from 'react'

const VehicleModal = ({
    displayInform,
    cancelModelValue,
    saveModelValue
}) => {
    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="mx-6 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-6">
                        <form className="border border-solid border-gray-900">
                            <div className="max-w-7xl mx-auto bg-white mb-5">
                                <div className="space-y-6 sm:space-y-5">
                                    <div className="sm:flex">
                                        <div className="w-full pb-0 pt-8 pl-8 pr-8">
                                            <div className="sm:max-w-sm sm:ml-24 font-medium text-black text-lg">Is this the correct vehicle?</div>

                                            <div className="mt-5 sm:max-w-sm sm:ml-24">
                                                {displayInform && displayInform.yearMakeModel &&
                                                    <div className="text-left text-xl font-medium">{displayInform && displayInform.yearMakeModel}</div>
                                                }

                                                {displayInform && displayInform.vinNumber &&
                                                    <div className="text-left font-light text-sm">Vin: {displayInform && displayInform.vinNumber}</div>
                                                }
                                                {displayInform && displayInform.lotNo &&
                                                    <div className="text-left font-light text-sm">Lot: {displayInform && displayInform.lotNo}</div>
                                                }
                                            </div>

                                            {displayInform && displayInform.images && displayInform.images.length > 0 &&
                                                <div className="gallery-modal-images mt-5 flex justify-center flex-wrap">
                                                    {displayInform && displayInform.images && displayInform.images.length && displayInform.images.filter((item, idx) => idx < 5).map((item) => {
                                                        return <img src={item} className="h-16 w-16 mr-2 mb-2" alt="car" />
                                                    })}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center mb-10">
                                <button onClick={() => cancelModelValue(0)} type="button" className="w-28 mr-2 block justify-center py-2 px-4 border border-solid border-gray-400 shadow-sm text-sm font-medium rounded-md text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Cancel
                                </button>
                                <button onClick={(e) => saveModelValue(e, true)} type="submit" className="w-28 ml-2 block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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

export default VehicleModal;
