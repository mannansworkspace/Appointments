import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import './pagination.css';
import { getWarehouseData} from '../../store/actions/superadmin-DashboardAction';
import { updateWarehouse } from '../../store/actions/warehouseAction';
import Loader from "react-loader-spinner";
import Pagination from '../common/Pagination';


class WarehouseSession extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            warehouses  : [],
            limit : 200,
            totalWarehouses : 0,
            showInDriverApp: false
        };
    }

    classnames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    componentDidMount() {
        this.props.getWarehouseData(this.state.limit, 0);
    }

    static getDerivedStateFromProps(props, state) {
        const {warehouses, totalWarehouses, loading} = props.data;

        if(warehouses && JSON.stringify(warehouses) !== JSON.stringify(state.warehouses)) {
            state.warehouses = warehouses;
            state.totalWarehouses = totalWarehouses;
            state.loading = false
        }

        return state;
    }

    getWarehouse = (skip) =>{
        this.props.getWarehouseData(this.state.limit, skip)
    }

    updateWarehouse = (warehouse) => {
        const data = {
            id: warehouse._id,
            showInDriverApp: warehouse?.showInDriverApp ? !warehouse.showInDriverApp : !this.state.showInDriverApp
        }
        this.props.updateWarehouse(data, this.props.history)
    }

    render() {
        const {warehouses, totalWarehouses, loading, limit, showInDriverApp} = this.state;
        
        return (
            <React.Fragment>
                <div className="time-slot-tabs mt-5 shadow overflow-x-auto border-b border-gray-200 sm:rounded-lg" >
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># of appts</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {warehouses.map((item, key) => {                            
                                        return (
                                            <React.Fragment key={item._id}>
                                                <tr className="">
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">{key + 1}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.company_name}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.first_name + ' ' + item.last_name}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.email}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.number}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.totalAppts}</td>
                                                    {item.loadTime?.loadTime1To4 ? (
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">
                                                            <tr>1 to 4 vehicles: {item.loadTime?.loadTime1To4} Minutes</tr>
                                                            <tr>5 to 7 vehicles: {item.loadTime?.loadTime5To7} Minutes</tr>
                                                            <tr>8 to 9 vehicles: {item.loadTime?.loadTime8To9} Minutes</tr>
                                                        </td>
                                                    ) : (
                                                        <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.loadTime} Minutes</td>
                                                    )}
                                                    <td className="py-3 px-6 text-center">
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
                                                                            <div onClick={() => this.props.model1Hanlder(item._id)} className={this.classnames(
                                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                'block px-4 py-2 text-sm hover:text-red-700 cursor-pointer'
                                                                            )}>
                                                                                Delete
                                                                            </div>
                                                                        )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                        {({ active }) => (
                                                                            <div onClick={() => this.props.history.push(`/superadmin/edit-warehouse/${item._id}`)}  className={this.classnames(
                                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                'block px-4 py-2 text-sm hover:text-purple-700 cursor-pointer'
                                                                            )}>
                                                                                Edit
                                                                            </div>
                                                                        )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                        {({ active }) => (
                                                                            <div onClick={() => this.props.openWarehousesDetailModal(item.weekDays)}  className={this.classnames(
                                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                'block px-4 py-2 text-sm hover:text-green-700 cursor-pointer'
                                                                            )}>
                                                                                View
                                                                            </div>
                                                                        )}
                                                                        </Menu.Item>
                                                                        <Menu.Item>
                                                                        {({ active }) => (
                                                                            <div onClick={() => this.updateWarehouse(item)}  className={this.classnames(
                                                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                                                'block px-4 py-2 text-sm hover:text-green-700 cursor-pointer'
                                                                            )}>
                                                                                {item?.showInDriverApp ? (
                                                                                    <p>Hide in driver app</p>
                                                                                ) : (
                                                                                    <p>Show in driver app</p>
                                                                                )}                                                                                
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
                </div >
                <div>
                    <Pagination itemsCountPerPage={ limit } totalItemsCount={totalWarehouses} callBack={ this.getWarehouse }/>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.superAdminAuth,
    data: state.superAdminDashboard,
});
export default connect(mapStateToProps, { getWarehouseData, updateWarehouse})(withRouter(WarehouseSession))