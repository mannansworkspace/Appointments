import React from "react"


const ApptTableView = (props) => {

    return (<>

        {props.bookedAppts.length > 0 ? (
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 ">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Appointment Time
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Order Id
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Customer
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Carrier
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Phone #
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Vehicle
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            Lot #
                                        </th>
                                        <th
                                            scope="col"
                                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                        >
                                            vin #
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-left">
                                    {props.bookedAppts.map((appointment, index) => {
                                        const { Customer, Carrier, lot, vin, vehicle } = appointment
                                        return (<tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment["Appointment Time"]}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment["Order ID"]}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Customer}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Carrier}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment["Phone #"]}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vehicle}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lot}</td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">{vin}</td>

                                        </tr>)
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )

            : <h1 className="mt-5 mt-5" >No record to view in table</h1>}
    </>
    )
}

export default ApptTableView;