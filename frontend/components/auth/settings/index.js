import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { updateUser } from '../../../store/actions/authAction'
import { NotificationManager } from 'react-notifications';
import AccountSession from './accountSession'
import CompanySession from './companySession'
import WarehouseTimings from './warehouseTimings';
import AllowOnlineAppointments from '../AllowOnlineAppointments';
import Loader from "react-loader-spinner";


class Settings extends Component {
    constructor() {
        super();
        this.state = {
            onlineApptDays: '3',
            ApptStartingFrom: '1',
            lunchBreak: {
                status: false,
                startTime: '12:00',
                endTime: '13:00',
            },
            duplicateSlot: false,
            loadTime: {
                loadTime1To4: '10',
                loadTime5To7: '30',
                loadTime8To9: '30',
            },
            showCustomerAutofill: true,
        };
    }

    static getDerivedStateFromProps(props, state) {
        const { user } = props
        if (JSON.stringify(user) !== JSON.stringify(state.user)) {
            state = {
                ...state,
                user: user,
                ...user,
                weekDays: user.weekDays?.map(item => {

                    if (item.openTime && !item.openTime.includes(':')) {
                        const opentime = (item.openTime.length <= 1 ? '0' : '') + item.openTime + ':00'
                        item.openTime = opentime
                    }

                    if (item.closeTime && !item.closeTime.includes(':')) {
                        const closeTime = item.closeTime = (item.closeTime.length <= 1 ? '0' : '') + item.closeTime + ':00'
                        item.closeTime = closeTime
                    }

                    return item
                }),
                loadTime: user.loadTime?.loadTime1To4 ? user.loadTime : { ...state.loadTime, loadTime1To4: user.loadTime }

            }
        }

        return state;
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

    changeLoadTime = (e) => {

        this.setState({
            loadTime: {
                ...this.state.loadTime,
                [e.target.name]: e.target.value
            }
        })
    }

    onChangeHandler = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        this.setState({
            [e.target.name]: value
        })
    }


    vehicleLimitHandler = (e) => {

        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
        this.setState({
            vehiclesLimit: {
                ...this.state.vehiclesLimit,
                [e.target.name]: value
            }
        })
    }

    handleValidation = () => {
        const fields = this.state;
        let formIsValid = true;

        if (fields['password'] && fields['password'].length) {

            if (!fields["oldPassword"]) {
                formIsValid = false;
                NotificationManager.error('Old Password field is required')
            }

            if (fields["password"]?.length < 8) {
                formIsValid = false;
                NotificationManager.error('Password must be atleast 8 characters')

            }
            if (fields["password"] !== fields["confirmPassword"]) {
                formIsValid = false;
                NotificationManager.error('Passwords are not matched')
            }
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

        if (fields['vehiclesPerSlot'])

            if (!(/[0-9]+/.test(fields["number"]))) {
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
            number: (this.state.number.startsWith('+1') ? this.state.number : '+1' + this.state.number),
            oldPassword: this.state.oldPassword,
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
            onlineApptDays: this.state.onlineApptDays,
            ApptStartingFrom: this.state.ApptStartingFrom,
            lunchBreak: this.state.lunchBreak,
            duplicateSlot: this.state.duplicateSlot,
            showCustomerAutofill: this.state.showCustomerAutofill,
            vehiclesLimit: this.state.vehiclesLimit
        }
        this.props.updateUser(data)
    }

    render() {
        return (
            <React.Fragment>
                {this.props.loadData ? (
                    <Loader className="absolute top-1/2 left-1/2"
                        type="Puff"
                        color="#00BFFF"
                    />
                ) : (
                    <>

                        <div className="h-16"></div>
                        <div className="form-width mx-6 mb-20 max-w-7xl mx-auto mt-5 mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200 px-3 sm:px-3">
                            <form onSubmit={this.onSubmitHandler}>
                                <AccountSession
                                    value={this.state}
                                    onChangeHandler={this.onChangeHandler}
                                />

                                <CompanySession
                                    value={this.state}
                                    onChangeHandler={this.onChangeHandler}
                                />

                                <WarehouseTimings
                                    value={this.state}
                                    onChangeHandler={this.onChangeHandler}
                                    handleChangeCheckBox={this.handleChangeCheckBox}
                                    changeStartTime={this.changeStartTime}
                                    changeEndTime={this.changeEndTime}
                                    changeLunchBreak={this.changeLunchBreak}
                                    changeLoadTime={this.changeLoadTime}
                                />

                                <AllowOnlineAppointments
                                    value={this.state}
                                    onChangeHandler={this.onChangeHandler}
                                    vehicleLimitHandler={this.vehicleLimitHandler}
                                />

                                {this.props.isLoading ? (<Loader className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 text-sm font-medium"
                                    type="Puff"
                                    color="#00BFFF"
                                    height={32}
                                    width={32}
                                    style={{ margin: 'auto', width: '32px', height: '32px' }}
                                />) : (
                                    <button type="submit" className="w-32 mt-8 mb-5 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        UPDATE
                                    </button>
                                )}

                            </form>
                        </div >
                    </>
                )}
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.auth.isLoading,
    loadData: state.auth.loadData,
    user: state.auth.user,
});

export default connect(mapStateToProps, { updateUser })(withRouter(Settings))
