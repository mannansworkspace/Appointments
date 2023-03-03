import React, { Component } from 'react'
import { connect } from 'react-redux'
import Logo from '../assets/images/logo.png'
import { superadminlogout } from './../store/actions/superadmin-authAction'
import { userlogout } from './../store/actions/authAction'
import {searchAppointmentsByVinOrLotNumber, resetSearchForAppointments} from './../store/actions/appointmentAction';
import NotificationsDorpdown from './NotificationsDorpdown';
import { Link } from 'react-router-dom';


class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggleButton: false
        }
    }

    componentDidMount = () =>{
        document.body.addEventListener('click', this.myHandler);
    }
    onLogoutHandler = () => {
        if (localStorage.getItem("jwtToken")) {
            this.props.userlogout();
        }
        if (localStorage.getItem("jwtTokenAdmin")) {
            this.props.superadminlogout();
        }
    }
    toggle = (e) => {
        if(!this.state.toggleButton){
            this.setState({ toggleButton: !this.state.toggleButton })
            e.stopPropagation();
        }
    }
    myHandler= (e) => {

        if(this.state.toggleButton) this.setState({ toggleButton: false })
        e.stopPropagation();
    }


    searchAppointmentsByVinOrLotNumberHandler = e => {
        const query = e.target.value;

        if(query && query.trim().length>0) {
            this.props.searchAppointmentsByVinOrLotNumber( query );
        } else {
            this.props.resetSearchForAppointments();
        }
        
    }

    debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    render() {
        const { toggleButton } = this.state
        let homePage = '/';

        if(this.props.user_auth){
            homePage = '/warehouse';
        }
        else if(this.props.admin_auth && this.props.admin_auth.user){
            homePage = '/superadmin/dashboard';
        }

        const userLogged = this.props.user_auth || this.props.admin_auth?.user ? true : false;
        let user_name = "";



        if (userLogged) {
            if (this.props.user_auth) {
                user_name = this.props.user_auth.company_name
            }
            else if (this.props.admin_auth.user !== null) {
                user_name = this.props.admin_auth.user.username
            }
        }

        return (

            <header className="bg-white shadow-sm fixed z-20 lg:overflow-y-visible w-full top-0">

                <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
                
                    <div className="relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
                        
                        <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                            <div className="flex-shrink-0 flex items-center">
                                <Link to={homePage}>
                                    <img className="block lg:hidden h-8 w-auto" src={Logo} alt="Appointment App" />
                                    <img className="hidden lg:block h-8 w-auto" src={Logo} alt="Appointment App" />
                                </Link>
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-6 xl:ml-20">
                            <div className="flex items-center px-6 py-4 md:max-w-3xl md:mx-auto lg:max-w-none lg:mx-0 xl:px-0">
                            
                                <div className="w-full">
                                    {userLogged ?
                                        <>
                                        <label htmlFor="search" className="sr-only">Search</label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>

                                            <input 
                                                id="search" 
                                                name="search" 
                                                className="block w-full bg-white border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:text-gray-900 focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                                                placeholder="Search by vin#, lot#, order id#, or appt id#" 
                                                type="search" 
                                                onKeyUp={this.searchAppointmentsByVinOrLotNumberHandler}/>

                                        </div>
                                        </>
                                    : <span>&nbsp;</span>}
                                </div>
                            
                            </div>
                        </div>

                        {userLogged ?
                            <div className="hidden lg:flex lg:items-center lg:justify-end xl:col-span-4">

                                <NotificationsDorpdown />

                                <div className="hidden sm:flex sm:items-center">
                                    <div className="ml-3 relative">
                                        <div>
                                            <span onClick={this.toggle} className="cursor-pointer companyNameLink font-medium hover:underline text-blue-500 hover:text-blue-500 focus:outline-none focus:underline transition ease-in-out duration-150 heading-font">{userLogged ? user_name : ''}</span>
                                            
                                        </div>
                                        <div style={{ display: toggleButton ? "" : "none" }} className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                                            {this.props.user_auth && (
                                                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 text-left" role="menuitem" tabIndex="-1" id="user-menu-item-1">Settings</Link>
                                            )}
                                            <Link to="#" onClick={this.onLogoutHandler} className=" text-left block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        : null}

                        {userLogged ?
                            <div className="-mr-2 flex items-center sm:hidden">
                                <button onClick={this.toggle} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-controls="mobile-menu" aria-expanded="false">
                                    <span className="sr-only">Open main menu</span>
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                    <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            : null}

                    </div>

                </div>

                <div style={{ display: toggleButton ? "" : "none" }} className="sm:hidden" id="mobile-menu">
                    <div className="pt-4 pb-3 border-t border-gray-200">
                        <div className="mt-3 space-y-1">
                            <Link to="/settings" className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-left">Settings</Link>
                            <Link to="#" onClick={this.onLogoutHandler} className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 text-left">Sign out</Link>
                        </div>
                    </div>
                </div>
                        
            </header>
            

        )
    }
}

const mapStateToProps = state => ({
    admin_auth: state.superAdminAuth.user,
    user_auth: state.auth.user
});


export default connect(mapStateToProps, { userlogout, superadminlogout, searchAppointmentsByVinOrLotNumber, resetSearchForAppointments})(Header)
