import React, { Component } from 'react';
import {withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {  deleteWarehouse, deleteAppointment, deleteCarrier } from '../../store/actions/superadmin-DashboardAction';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import * as moment from 'moment';
import './AdminDashboard.css';
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import AppointmentSession from './AppointmentSession'
import CarrierSession from './CarrierSession'
import WarehouseSession from './WarehouseSession'
import WarehouseDelete from './models/WarehouseDelete';
import AppointmentDelete from './models/AppointmentDelete';
import CarrierDelete from './models/CarrierDelete';
import CustomerSession from './CustomerSession';

class AdminDashboard extends Component {
    constructor() {
        super();
        this.state = {
            warehouseId: '',
            appointmentId: '',
            carrierId: '',
            openModel: false,
            openModel1: false,
            openModel2: false,
            openModel3: false,
            openModel4: false,
            warehousesSubTableHeadings: (
                <tr className="table-header-sub">
                    <th colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Week Day</th>
                    <th colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opening Time</th>
                    <th colSpan="2" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Closing Time</th>
                </tr>
            ),
            appointmentsSubTableHeadings: (
                <tr className="table-header-sub">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Cars</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                </tr>
            ),
            modalBody: (<p>Data is loading....</p>)
        }
    }

    componentDidMount = () => {
        // this.props.getDashboardData();
    }

    openAppointmentsDetailModal = (data) => {
        const modalBody = (
            <div className="time-slot-tabs mt-5 shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                <table className="table min-w-full divide-y divide-gray-200">
                    <thead>
                        {this.state.appointmentsSubTableHeadings}
                    </thead>
                    <tbody>
                        {data.map((b, i) => {
                            return (
                                <tr key={i} className="table-row">
                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.time ? b.time : ""}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.car ? b.car : ""}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.company_name ? b.company_name : ""}</td>
                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.number ? b.number : ""}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
        this.setState({ openModel: true, modalBody: modalBody });
    }

    openWarehousesDetailModal = (data) => {
        const modalBody = (
            <div className="time-slot-tabs mt-5 shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                <table className="table min-w-full divide-y divide-gray-200">
                    <thead>
                        {this.state.warehousesSubTableHeadings}
                    </thead>
                    <tbody>
                        {data.map((b, i) => {
                            return (
                                <tr key={i} className="table-row">
                                    <td colSpan="2" className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.day}</td>
                                    <td colSpan="2" className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.open ? "OPEN" : "CLOSE"}</td>
                                    <td colSpan="2" className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.open ? moment(b.openTime, 'hh').format('LT') : "--"}</td>
                                    <td colSpan="2" className="px-6 py-3 whitespace-nowrap text-left text-sm">{b.open ? moment(b.closeTime, 'hh').format("LT") : "--"}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        );
        this.setState({ openModel: true, modalBody: modalBody });
    }

    modelCloseHandler = () => {
        this.setState({ openModel: false, modalBody: (<p>Data is loading....</p>) });
    }

    model1Hanlder = (id) => {
        this.setState({
            openModel1: !this.state.openModel1,
            warehouseId: id ? id : ''
        })
    }

    model2Hanlder = (id) => {
        this.setState({
            openModel2: !this.state.openModel2,
            appointmentId: id ? id : ''
        })
    }

    model3Hanlder = (id) => {
        this.setState({
            openModel3: !this.state.openModel3,
            carrierId: id ? id : ''
        })
    }

    model4Hanlder = (id) => {
        this.setState({
            openModel4: !this.state.openModel4,
        })
    }

    deleteWarehouse = () => {
        this.props.deleteWarehouse(this.state.warehouseId)
            .then(res => {
                if (res) {
                    this.setState({
                        warehouseId: '',
                        openModel1: false
                    })
                }
            })
    }

    deleteAppointment = () => {
        this.props.deleteAppointment(this.state.appointmentId)
            .then(res => {
                if (res) {
                    this.setState({
                        appointmentId: '',
                        openModel2: false
                    })
                }
            })
    }

    deleteCarrier = () => {
        this.props.deleteCarrier(this.state.carrierId)
            .then(res => {
                if (res) {
                    this.setState({
                        carrierId: '',
                        openModel3: false
                    })
                }
            })
    }

    render() {
        const { openModel, modalBody, openModel1, openModel2, openModel3, openModel4 } = this.state;
        const body = <Tabs>
                <div className="md:flex px-3">
                    <div className="md:w-full lg:w-full z-0">
                        <div className="lg:flex justify-between">
                            <div className="w-full">
                                <div className="tab-section mt-3 flex space-between">
                                    <div className="sm:hidden">
                                        <label htmlFor="tabs" className="sr-only">Select a tab</label>
                                        <select name="tabs" className="block w-full focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md">
                                        </select>
                                    </div>
                                    <div className="hidden sm:block">
                                        <TabList>
                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                <Tab default={true}>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
                                                        Warehouses
                                                    </div>
                                                </Tab>
                                                <Tab>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
                                                        Carriers
                                                    </div>
                                                </Tab>
                                                <Tab>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
                                                        Appointments
                                                    </div>
                                                </Tab>
                                                <Tab>
                                                    <div className="cursor-pointer text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">
                                                        Shippers/brokers
                                                    </div>
                                                </Tab>
                                            </nav>
                                        </TabList>
                                    </div>
                                    <button onClick={() => this.props.history.push("/superadmin/add_warehouse")} className="w-44 ml-auto block py-2 text-sm font-medium rounded-lg text-white bg-green-700 hover:bg-green-600 focus:outline-none" >+ Add warehouse</button>
                                </div>
                                <TabPanel>
                                    <WarehouseSession model1Hanlder={this.model1Hanlder} openWarehousesDetailModal={this.openWarehousesDetailModal} />
                                </TabPanel>
                                <TabPanel>
                                    <CarrierSession model3Hanlder={this.model3Hanlder} />
                                </TabPanel>
                                <TabPanel>
                                    <AppointmentSession model2Hanlder={this.model2Hanlder} />
                                </TabPanel>
                                <TabPanel>
                                    <CustomerSession model4Hanlder={this.model4Hanlder} />
                                </TabPanel>
                            </div>
                        </div>
                    </div>
                </div>
            </Tabs>
        
        return (
            <div>
                <div className="h-16" ></div>
                <div className="form-width mx-6 mb-20 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-0">
                    {body}
                    <div style={{ display: openModel ? "" : 'none' }} className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
                                <div className="flex">
                                    <span>Record Details</span>
                                    <svg onClick={this.modelCloseHandler} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-auto cursor-pointer	" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>

                                {modalBody}
                            </div>
                        </div>
                    </div>
                    {openModel1 && (
                        <WarehouseDelete deleteWarehouse={this.deleteWarehouse} modalHandler={this.model1Hanlder}/>
                    )}
                    {openModel2 && (
                        <AppointmentDelete deleteAppointment={this.deleteAppointment} modalHandler={this.model2Hanlder}/>
                    )}
                    {openModel3 && (
                        <CarrierDelete deleteCarrier={this.deleteCarrier} modalHandler={this.model3Hanlder}/>
                    )}
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.superAdminAuth,
    data: state.superAdminDashboard
});
export default connect(mapStateToProps, { deleteCarrier, deleteWarehouse, deleteAppointment })(withRouter(AdminDashboard))
