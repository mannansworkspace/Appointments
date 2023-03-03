import React, { Component, Fragment } from 'react'
import * as moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import './pagination.css';
import Pagination from '../common/Pagination';
import {getAppointmentsData} from '../../store/actions/superadmin-DashboardAction';
import Loader from "react-loader-spinner";


class AppointmentSession extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            appointments  : [],
            limit : 200,
            totalAppts : 0,
        };
    }

    componentDidMount = () => {
        this.props.getAppointmentsData(this.state.limit, 0)
    }

    static getDerivedStateFromProps(props, state) {
        const {appointments, totalAppts} = props.data;

        if(appointments && JSON.stringify(appointments) !== JSON.stringify(state.appointments)) {
            state.appointments = appointments;
            state.totalAppts = totalAppts;
            state.loading = false;
        }

        return state;
    }


    classnames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    getAppointments = (skip) =>{
        this.props.getAppointmentsData(this.state.limit, skip)
    }

    render() {

        const {appointments, totalAppts, loading, limit} = this.state;


        return (
            <React.Fragment>            
                <div className="time-slot-tabs mt-5 shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg">
                    {loading ? (<Loader
                            type="Puff"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            style={{ margin: 'auto', width: '100px', height: '100px' }}
                        />) : (
                            <>
                                <table className="table min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr className="table-header">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Made By</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked on</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appt Time/Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Carrier</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># of Cars</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((item, key) => {
                                            return (
                                                <React.Fragment key={item._id}>
                                                    <tr className="">
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">{key + 1}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item._id}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.warehouse_id?.company_name}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{moment(item.created_at).format('dddd MMM DD YYYY')}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{moment(item.date).format('MM/DD/yy hh:mm A')}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.driver_id ? item.driver_id.company_name : item.company_name}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.car}</td>
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">
                                                            <Menu as="div" className="inline-block text-left">
                                                                {({ open }) => (
                                                                    <>
                                                                    <div>
                                                                        <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                                                                            Actions
                                                                        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                                                        </Menu.Button>
                                                                    </div>
                                                                    <Transition
                                                                        show={open}
                                                                        as={Fragment}
                                                                        enter="transition ease-out duration-100"
                                                                        enterFrom="transform opacity-0 scale-95"
                                                                        enterTo="transform opacity-100 scale-100"
                                                                        leave="transition ease-in duration-75"
                                                                        leaveFrom="transform opacity-100 scale-100"
                                                                        leaveTo="transform opacity-0 scale-95"
                                                                    >
                                                                        <Menu.Items
                                                                        static
                                                                        className="z-10 origin-top-right absolute mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none fix"
                                                                        >
                                                                        <div className="py-1">
                                                                            <Menu.Item>
                                                                            {({ active }) => (
                                                                                <div onClick={() => this.props.model2Hanlder(item._id)} className={this.classnames(
                                                                                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                    'block px-4 py-2 text-sm hover:text-red-700 cursor-pointer'
                                                                                )}>
                                                                                    Delete
                                                                                </div>
                                                                            )}
                                                                            </Menu.Item>
                                                                        </div>
                                                                        </Menu.Items>
                                                                    </Transition>
                                                                    </>
                                                                )}
                                                            </Menu>
                                                        </td>
                                                    </tr>
                                                </React.Fragment>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>
                    <div>
                        <Pagination itemsCountPerPage={ limit } totalItemsCount={totalAppts} callBack={ this.getAppointments }/>
                    </div>
            </React.Fragment>

        )
    }
}
const mapStateToProps = state => ({
    auth: state.superAdminAuth,
    data: state.superAdminDashboard
});

export default connect(mapStateToProps, {getAppointmentsData})(withRouter(AppointmentSession))