import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { loginApi } from '../../store/actions/authAction'
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            redirectTo: null
        };
    }

    static getDerivedStateFromProps(props, state){
        state.redirectTo = new URLSearchParams(props.location.search).get("redirectTo")
        return state
    }

    componentDidUpdate(props, state) {

        if (props.auth.isAuthenticated) {
            if(state.redirectTo) props.history.push(state.redirectTo);
            else props.history.push('/warehouse')
        }
    }

    onChangeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmitHandler = (e) => {
        e.preventDefault()
        const data = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginApi(data, this.props.history, this.state.redirectTo)
    }

    render() {
        const { email, password } = this.state
        
        return (
            <div className="form-width mx-6 mb-20 max-w-7xl mx-auto mx-2 sm:mx-6 lg:mx-8 space-y-8 space-y-8 divide-y divide-gray-200">
                <form onSubmit={this.onSubmitHandler}>
                    <div className="">
                        <div className="space-y-6 sm:space-y-5">
                            <div className="min-h-screen flex flex-col justify-center pb-12 sm:px-6 lg:px-8">
                                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                                    <h3 className="text-lg leading-6 font-bold text-gray-900">
                                        Sign in to your account
                                    </h3>
                                </div>
                                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Email</label>
                                            <div className="mt-1">
                                                <input type="email" onChange={this.onChangeHandler} name="email" value={email} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left">Password</label>
                                            <div className="mt-1">
                                                <input type="password" onChange={this.onChangeHandler} name="password" value={password} className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="" />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input name="remember_me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                                    Remember me
                                                </label>
                                            </div>
                                            <div className="text-sm">
                                                <div className="font-medium text-blue-700 hover:text-blue-600 hover:underline cursor-pointer">
                                                    Forgot your password?
                                                </div>
                                            </div>
                                        </div>
                                        {this.props.auth.isLoading ? (<Loader className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 text-sm font-medium"
                                            type="Puff"
                                            color="#00BFFF"
                                            height={32}
                                            width={32}
                                            style={{ margin: 'auto', width: '32px', height: '32px' }}
                                        />) : (
                                            <button type="submit" className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                Sign in
                                            </button>
                                        )}

                                        {/* {this.props.auth.isError ? (<p className="w-full mt-8 ml-3 ml-auto mr-auto block justify-center py-2 px-4 text-sm font-medium text-red-700">{this.props.auth.errorMessage}</p>) : null}
                                        <div className="mt-4 text-center text-gray-900 text-base font-medium">Create An Account? <span className="font-bold text-blue-700 hover:text-blue-600"><a className="hover:underline" href={`${process.env.REACT_APP_FRONTEND}/sign-up`}>click here</a> </span></div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { loginApi })(withRouter(Login))
