import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerApi } from '../../../store/actions/authAction'
import { NotificationManager } from 'react-notifications';
import AccountSession from './accountSession'
import CompanySession from '../settings/companySession'
import WarehouseSession from '../settings/warehouseTimings';
import AllowOnlineAppointments from '../AllowOnlineAppointments';
import Loader from "react-loader-spinner";
import timingOptionList from '../../../utils/timingOptionList'

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            company_name: '',
            first_name: '',
            last_name: '',
            number: '',
            email: '',
            address: '',
            city: '',
            state: '',
            zip_code: '',
            timeFormat: '-5',
            loadTime: {
                loadTime1To4: "10",
                loadTime5To7: "30",
                loadTime8To9: "30"
            },
            password: '',
            confirmPassword: '',
            allow_online_appointments: false,
            warehouse_subdomain_name: '',
            onlineApptDays: '5',
            lunchBreak: {
                status: false,
                startTime: '12:00',
                endTime: '13:00',
            },
            vehiclesLimit: {
                vehiclesPerSlot: 4,
                vehiclesPerDay: 100,
                status: false,
            },
            weekDays: [
                {
                    day: "Monday",
                    open: true,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Tuesday",
                    open: true,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Wednesday",
                    open: true,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Thursday",
                    open: true,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Friday",
                    open: true,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Saturday",
                    open: false,
                    openTime: "08:00",
                    closeTime: "17:00"
                },
                {
                    day: "Sunday",
                    open: false,
                    openTime: "08:00",
                    closeTime: "17:00"
                }
            ]
        };
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

    changeLunchBreak = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

        this.setState({
            lunchBreak: {
                ...this.state.lunchBreak,
                [e.target.name]: value
            }
        })
    }

    onChangeHandler = (e) => {

        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value

        this.setState({
            [e.target.name]: value
        })
    }

    changeLoadTime = (e) => {

        this.setState({
            loadTime: {
                ...this.state.loadTime,
                [e.target.name]: e.target.value
            }
        })
    }



    handleValidation = () => {
        const fields = this.state;
        let formIsValid = true;

        if (!fields["email"]) {
            formIsValid = false;
            NotificationManager.error('Email field is required')
        }

        if (fields["password"]?.length < 8) {
            formIsValid = false;
            NotificationManager.error('Password must be atleast 8 characters')

        }
        if (fields["password"] !== fields["confirmPassword"]) {
            formIsValid = false;
            NotificationManager.error('Passwords are not matched')
        }

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

    vehicleLimitHandler = (e) => {
        this.setState({
            vehiclesLimit: {
                ...this.state.vehiclesLimit,
                [e.target.name]: e.target.value
            }
        })
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
            email: this.state.email,
            address: this.state.address,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zip_code,
            timeFormat: this.state.timeFormat,
            loadTime: this.state.loadTime,
            password: this.state.password,
            weekDays: this.state.weekDays,
            allow_online_appointments: this.state.allow_online_appointments,
            warehouse_subdomain_name: this.state.warehouse_subdomain_name,
            mailingAddress: this.state.mailingAddress || this.state.email,
            onlineApptDays: this.state.onlineApptDays ? this.state.onlineApptDays : '3',
            lunchBreak: this.state.lunchBreak,
            vehiclesLimit: this.state.vehiclesLimit
        }

        this.props.registerApi(data, this.props.history, 'superadmin')
    }

    render() {
        return (
            <React.Fragment>
                <div className="h-16"></div>
                <div className="form-width mx-6 mb-20 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                    <form onSubmit={this.onSubmitHandler}>
                        <AccountSession value={this.state} onChangeHandler={this.onChangeHandler} />
                        <CompanySession value={this.state} onChangeHandler={this.onChangeHandler} />
                        <WarehouseSession
                            value={this.state}
                            onChangeHandler={this.onChangeHandler}
                            handleChangeCheckBox={this.handleChangeCheckBox}
                            changeStartTime={this.changeStartTime}
                            changeEndTime={this.changeEndTime}
                            changeLunchBreak={this.changeLunchBreak}
                            changeLoadTime={this.changeLoadTime}
                            openTimingList={timingOptionList('00:00', '11:30', 30)}
                            closeTimingList={timingOptionList('12:00', '23:30', 30)}
                        />


                        <AllowOnlineAppointments
                            value={this.state}
                            onChangeHandler={this.onChangeHandler}
                            vehicleLimitHandler={this.vehicleLimitHandler}

                        />

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

                        {!this.props.admin.isAuthenticated && (
                            <div className="text-center text-gray-900 text-base font-medium">If you already have an account then please <span className="font-bold text-blue-700 hover:text-blue-600"><a className="hover:underline" href={`${process.env.REACT_APP_FRONTEND}/login`}>click here</a> </span></div>
                        )}
                    </form>
                </div >
            </React.Fragment>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth,
    admin: state.superAdminAuth
});
export default connect(mapStateToProps, { registerApi })(withRouter(Signup))
