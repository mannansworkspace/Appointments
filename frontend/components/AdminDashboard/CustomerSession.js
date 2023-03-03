import React, { Component, Fragment } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import './pagination.css';
import { getCustomersData } from '../../store/actions/superadmin-DashboardAction';
import Loader from "react-loader-spinner";
import Pagination from '../common/Pagination';


class CustomerSession extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading : true,
            customers  : [],
            limit : 200,
            totalCustomers : 0,
        };
    }

    classnames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    componentDidMount() {
        this.props.getCustomersData(this.state.limit, 0);
    }

    static getDerivedStateFromProps(props, state) {

        const {customers, totalCustomers} = props.data;

        if(customers && JSON.stringify(customers) !== JSON.stringify(state.customers)) {
            state.customers = customers;
            state.totalCustomers = totalCustomers;
            state.loading = false
        }

        return state;
    }

    getCustomers = (skip) =>{
        this.props.getCustomersData(this.state.limit, skip)
    }

    render() {
        const {customers, totalCustomers, loading, limit} = this.state;

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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># of appts</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"># of vehicles</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse Related To</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((item, key) => {                            
                                        return (
                                            <React.Fragment key={item._id}>
                                                <tr className="">
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm font-medium text-gray-900">{key + 1}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.customerName}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.totalAppointments}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.totalCars}</td>
                                                    <td className="px-6 py-3 whitespace-nowrap text-left text-sm">{item.warehouseId?.company_name}</td>   
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
                    <Pagination itemsCountPerPage={ limit } totalItemsCount={totalCustomers} callBack={ this.getCustomers }/>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.superAdminAuth,
    data: state.superAdminDashboard,
});
export default connect(mapStateToProps, { getCustomersData })(withRouter(CustomerSession))