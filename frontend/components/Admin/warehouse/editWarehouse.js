import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CompanySession from './companySession'
import WarehouseSession from './warehouse'
import Loader from "react-loader-spinner";
import { getSingleWarehouse, updateWarehouse } from '../../../store/actions/warehouseAction'
import { NotificationManager } from 'react-notifications';
class EditWarehouse extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            flag: true,
            company_name: '',
            first_name: '',
            last_name: '',
            number: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            timeFormat: '',
            loadTime: "",
            weekDays: [
                {
                    day: "Monday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Tuesday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Wednesday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Thursday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Friday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Saturday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                },
                {
                    day: "Sunday",
                    open: false,
                    openTime: "8",
                    closeTime: "17"
                }
            ]
        };
    }

    componentDidMount() {
        this.props.getSingleWarehouse(this.props.match.params.id)
    }

    handleChangeCheckBox = (day, value) => {
        this.setState({
            weekDays: this.state.weekDays.map(el => (el.day === day ? Object.assign({}, el, { open: value }) : el))
        })
    }

    changeStartTime = (day, value) => {
        this.setState({
            weekDays: this.state.weekDays.map(el => (el.day === day ? Object.assign({}, el, { openTime: value.target.value }) : el))
        })
    }

    changeEndTime = (day, value) => {
        this.setState({
            weekDays: this.state.weekDays.map(el => (el.day === day ? Object.assign({}, el, { closeTime: value.target.value }) : el))
        })
    }

    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleValidation = () => {
        const fields = this.state;
        let formIsValid = true;
        if (!(fields["zip_code"]?.length === 5)) {
            formIsValid = false;
            NotificationManager.error('Zip Code must be 5 characters')
        }

        if (!fields["company_name"]) {
            formIsValid = false;
            NotificationManager.error('Company Name is Required')
        }

        if (!fields["first_name"]) {
            formIsValid = false;
            NotificationManager.error('First Name Field is Required')
        }
        if (!fields["number"]) {
            formIsValid = false;
            NotificationManager.error('Number Field is Required')
        }

        if (!(/^\d+$/.test(fields["number"]))) {
            formIsValid = false;
            NotificationManager.error('Number Field contain only Numeric Value')
        }

        if (!(fields["zip_code"]?.length === 5) && !(/^\d+$/.test(fields["zip_code"]))) {
            formIsValid = false;
            NotificationManager.error('Zip Code contain only Numeric Value')
        }

        if (!fields["address"]) {
            formIsValid = false;
            NotificationManager.error('Address Field is Required')
        }

        return formIsValid;
    }

    onSubmitHandler = (e) => {
        e.preventDefault()

        if (!this.handleValidation()) {
            return
        }
        const data = {
            company_name: this.state.company_name,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            number: "+1" + this.state.number,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zip_code,
            timeFormat: this.state.timeFormat,
            loadTime: this.state.loadTime,
            weekDays: this.state.weekDays,
            id: this.state.id
        }
        this.props.updateWarehouse(data, this.props.history)
    }

    static getDerivedStateFromProps(props, state) {
        const { warehouseDetail } = props.warehouse
        if (state.flag && warehouseDetail && JSON.stringify(warehouseDetail) !== JSON.stringify(state.warehouseDetail)) {
            state.id = warehouseDetail._id
            state.company_name = warehouseDetail.company_name
            state.first_name = warehouseDetail.first_name
            state.last_name = warehouseDetail.last_name
            state.number = warehouseDetail.number.substring(2)
            state.weekDays = warehouseDetail.weekDays
            state.loadTime = warehouseDetail.loadTime
            state.address = warehouseDetail.address
            state.city = warehouseDetail.city
            state.state = warehouseDetail.state
            state.zip_code = warehouseDetail.zip_code
            state.timeFormat = warehouseDetail.timeFormat
            state.flag = false
        }
        return state;
    }

    render() {
        return (
            <React.Fragment>
                <div className="h-16"></div>
                <div className="form-width mx-6 mb-20 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                    <form onSubmit={this.onSubmitHandler}>
                        <CompanySession value={this.state} onChangeHandler={this.onChangeHandler} />
                        <WarehouseSession value={this.state} onChangeHandler={this.onChangeHandler} handleChangeCheckBox={this.handleChangeCheckBox} changeStartTime={this.changeStartTime} changeEndTime={this.changeEndTime} />
                        {this.props.auth.isLoading ? (<Loader className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 text-sm font-medium"
                            type="Puff"
                            color="#00BFFF"
                            height={32}
                            width={32}
                            style={{ margin: 'auto', width: '32px', height: '32px' }}
                        />) : (
                            <button type="submit" className="w-32 mt-8 mb-5 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                DONE
                            </button>
                        )}
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    warehouse: state.warehouse
});
export default connect(mapStateToProps, { getSingleWarehouse, updateWarehouse })(withRouter(EditWarehouse))
