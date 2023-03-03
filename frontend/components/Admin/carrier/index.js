import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CompanySession from './companySession'
import Loader from "react-loader-spinner";
import { getSingleCarrier, updateCarrier } from '../../../store/actions/warehouseAction'
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
            email: ''
        };
    }

    componentDidMount() {
        this.props.getSingleCarrier(this.props.match.params.id)
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
            number: this.state.number,
            address: this.state.address,
            email: this.state.email,
            city: this.state.city,
            state: this.state.state,
            zip_code: this.state.zip_code,
            timeFormat: this.state.timeFormat,
            loadTime: this.state.loadTime,
            weekDays: this.state.weekDays,
            id: this.state.id
        }
        this.props.updateCarrier(data, this.props.history)
    }

    static getDerivedStateFromProps(props, state) {
        const { singleDriver } = props.driver
        if (state.flag && singleDriver && JSON.stringify(singleDriver) !== JSON.stringify(state.singleDriver)) {
            state.id = singleDriver._id
            state.company_name = singleDriver.company_name
            state.first_name = singleDriver.first_name
            state.last_name = singleDriver.last_name
            state.email = singleDriver.email
            state.number = singleDriver.number
            state.address = singleDriver.address
            state.city = singleDriver.city
            state.state = singleDriver.state
            state.zip_code = singleDriver.zip_code
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
                        {this.props.auth.isLoading ? (<Loader className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 text-sm font-medium"
                            type="Puff"
                            color="#00BFFF"
                            height={32}
                            width={32}
                            style={{ margin: 'auto', width: '32px', height: '32px' }}
                        />) : (
                            <button type="submit" className="w-32 mt-8 mb-5 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                                DONE
                            </button>
                        )}
                    </form>
                </div >
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    driver: state.driver
});
export default connect(mapStateToProps, { getSingleCarrier, updateCarrier })(withRouter(EditWarehouse))
