import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Customers from '../Customers';
import WareHouseHome from '../warehouse';


const Dashboard = () => {
    return (
        <div>
            <div className="mt-20 pl-16" ></div>
            <Tabs>
                <div className="md:flex px-3">
                    <div className="md:w-full lg:w-full z-0">
                        <div className="lg:flex justify-between">
                            <div className="w-full">
                                <div className="tab-section mt-3 flex space-between">
                                    <div className="sm:hidden">
                                        <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                        <select name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded">
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">
                                        <TabList>
                                            <nav className="ml-20 flex space-x-4" aria-label="Tabs">
                                                <Tab default={true}>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm">
                                                        Appointments
                                                    </div>
                                                </Tab>
                                                <Tab>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-5 py-2 font-medium text-sm">
                                                        Customers
                                                    </div>
                                                </Tab>
                                            </nav>
                                        </TabList>
                                    </div>
                                </div>
                                <TabPanel>
                                    <WareHouseHome  />
                                </TabPanel>
                                <TabPanel>
                                    <Customers />
                                </TabPanel>
                            </div>
                        </div>
                    </div>
                </div>
        </Tabs>
    </div>
)}

export default Dashboard;
