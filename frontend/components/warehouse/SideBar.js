
import React, { Component, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react'
import AppointmentTimeline from './AppointmentTimeline';
import Lightbox from 'react-image-lightbox';
import * as moment from 'moment'
import 'react-image-lightbox/style.css';
import { connect } from 'react-redux'
import {
    updateAppointment
} from '../../store/actions/appointmentAction';
import Close from '../../assets/svgs/Close.svg';

class SideBar extends Component{
    constructor() {
        super();
        this.state = {
            images: [],
            photoIndex: 0,
            isOpen: false,
            showEdit: false,
            company_name: '',
            number: '',
            endTimesideBar: '',
            keepModalOpen: false
        }
    }


    static getDerivedStateFromProps = (props, state) => {
        const {user, sideBarData} = props;

        let loadTime;

        if(+sideBarData?.car > 0 && +sideBarData?.car < 5) {
            loadTime = user?.loadTime?.loadTime1To4;
        }

        if(+sideBarData?.car > 4 && +sideBarData?.car < 8) {
            loadTime = user?.loadTime?.loadTime5To7;
        }

        if(+sideBarData?.car > 7) {
            loadTime = user?.loadTime?.loadTime8To9;
        }


        const endTimesideBar = new Date(new Date(sideBarData?.date).getTime() + parseInt(loadTime ? loadTime : user?.loadTime) * 60000);


        state.endTimesideBar = endTimesideBar;

        return state;
    }

    onChangeHandle = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    showEditHandler = (item) => {

        this.setState({
            showEdit: true,
            company_name: item.company_name,
            number: item.number
        })
    }

    saveEditHandler = () => {
        const data = {
            ObjectId: this.props.sideBarData._id,
            name: this.state.company_name,
            tel: this.state.number,
            date: this.props.sideBarData?.date
        }   

        this.props.sidebarHandler(null)

        this.props.updateAppointment(data)
        .then(res => {
            if (res) {
                this.setState({
                    company_name: '',
                    number: ''
                })
            }
        })
    }

    componentDidUpdate(nextProps, nextState) {
        if (nextProps.sidebarOpen === false && this.props.sidebarOpen ) {
            this.setState({
                showEdit: false ,
                company_name: '',
                number: '',
            })
        }
    }

    render() {
        const { sidebarOpen, sideBarData, sidebarHandler, cancelAppointmentModelHandler, timeFormat } = this.props;
        const { showEdit, company_name, number, isOpen, images, photoIndex, endTimesideBar, keepModalOpen } = this.state;

        return(
            <Transition.Root show={sidebarOpen} as={Fragment} ref={this.wrapperRef}>
                <Dialog as="div" static className="z-20 fixed inset-0 overflow-hidden" open={sidebarOpen} onClose={() => !keepModalOpen && sidebarHandler(null)}>
                    <div className="absolute inset-0 overflow-hidden">
                        <Dialog.Overlay className="absolute inset-0" />
                        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <div className="w-screen max-w-lg">
                                    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                                        <div className="mt-6 relative flex-1 px-4 sm:px-6">
                                            {/* Replace with your content */}
                                            <div className="absolute inset-0 overflow-hidden">
                                                <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                                                <div className="fixed inset-y-0 right-0 max-w-full flex">
                                                    <div className="w-screen max-w-lg">
                                                        <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                                                            <div className="px-4 sm:px-6">
                                                                <div className="flex justify-between flex" >
                                                                    <h2 className="text-lg font-medium text-gray-900">
                                                                        {moment(sideBarData?.date).format('hh:mm A dddd MM/DD')}
                                                                    </h2>
                                                                    <div className="ml-3 h-7 flex">
                                                                        <button onClick={() => sidebarHandler(null)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                            <span className="sr-only">Close panel</span>
                                                                            <img src={Close} className="h-6 w-6" alt="close"/>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mt-5 border-t border-gray-200">
                                                                <dl className="divide-y divide-gray-200">
                                                                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                        { showEdit ?
                                                                            <dt className="text-sm font-medium text-gray-500 text-left pl-5">

                                                                            </dt>
                                                                            :
                                                                            <dt className="text-sm font-medium text-gray-500 text-left pl-5">
                                                                                {sideBarData?.orderId && (
                                                                                    <p>Order Id#</p> 
                                                                                )}
                                                                                {sideBarData?.customerId?.customerName && (
                                                                                    <p>Customer</p> 
                                                                                )}
                                                                                {sideBarData?.appointment_Id && (
                                                                                    <p>Appointment ID#</p>
                                                                                )}
                                                                                Carrier Name
                                                                                <br/>
                                                                                Tel  
                                                                        </dt>
                                                                        }

                                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 pl-5">
                                                                            <span className="flex-grow text-left">
                                                                                {showEdit ? <div className="text-sm text-gray-600 w-60 text-left">
                                                                                    <div className="block text-left">
                                                                                        <label className="block  text-left text-sm font-medium text-gray-500">Company Name</label>
                                                                                        <input 
                                                                                            required 
                                                                                            type="text" 
                                                                                            className="block border border-solid border-gray-500 pl-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                                                                                            value={company_name} 
                                                                                            name="company_name" 
                                                                                            onChange={this.onChangeHandle} 
                                                                                        />
                                                                                    </div>
                                                                                    <div className="block mt-2">
                                                                                        <label className="block text-left text-sm font-medium text-gray-500">Cell Phone#</label>
                                                                                        <input 
                                                                                            required 
                                                                                            type="text" 
                                                                                            pattern="^[+][0-9]+$" 
                                                                                            minLength="12" 
                                                                                            maxLength="12" 
                                                                                            className="block border border-solid border-gray-500 pl-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" 
                                                                                            value={number} 
                                                                                            name="number" 
                                                                                            onChange={this.onChangeHandle} 
                                                                                        />
                                                                                    </div>
                                                                                </div> 
                                                                                : 
                                                                                <div>
                                                                                    <div className="flex-grow">{sideBarData?.orderId}</div>
                                                                                    <div className="flex-grow">{sideBarData?.customerId?.customerName}</div>
                                                                                    <div className="flex-grow">{ sideBarData?.appointment_Id}</div>
                                                                                    <div className="flex-grow">{ sideBarData?.company_name}</div>
                                                                                    <div className="flex-grow">{ sideBarData?.number}</div>
                                                                                </div>
                                                                                }
                                                                            </span>

                                                                            <span className="flex-shrink-0 w-20">
                                                                                { showEdit ?
                                                                                    <span 
                                                                                        onClick={this.saveEditHandler} 
                                                                                        className="cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                                    >
                                                                                        Save
                                                                                    </span> :
                                                                                    <span 
                                                                                        onClick={() => this.showEditHandler(sideBarData)} 
                                                                                        className="cursor-pointer bg-white rounded-md font-medium text-blue-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                                                    >
                                                                                        Edit
                                                                                    </span>
                                                                                }
                                                                            </span>
                                                                        </dd>
                                                                    </div>



                                                                    <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                                                                        <dt className="text-sm font-medium text-gray-500 text-left pl-5">
                                                                            Vehicles ({ sideBarData?.car}):
                                                                        </dt>
                                                                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 pl-5">
                                                                            <div>
                                                                                {sideBarData?.vehicleDetail.filter(item => !!item).map((item, index) => {
                                                                                    return <div key={{ index }} className="text-sm text-gray-900">
                                                                                        <div className="mb-2">{item.yearMakeModel} {item.vinNumber}</div>
                                                                                        <div className="image-section flex flex-wrap sm:w-72">
                                                                                            {item.images && item.images.length ?
                                                                                                item.images.map((value, key) => (
                                                                                                    <img 
                                                                                                        key={key}
                                                                                                        src={value} 
                                                                                                        style={{ maxHeight: '48px' }} 
                                                                                                        onClick={() => this.setState({ images: item.images, photoIndex: key, isOpen: true, keepModalOpen: true })} 
                                                                                                        className="w-12 mb-2 mr-2 cursor-pointer" 
                                                                                                        alt="img"
                                                                                                    />
                                                                                                )) :
                                                                                                <h2>No Images is Provided</h2>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                })}
                                                                            </div>
                                                                        </dd>
                                                                    </div>

                                                                </dl>
                                                            </div>

                                                            <div className="border-t py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                                                                <dt className="text-sm font-medium text-gray-500 text-left pl-5">
                                                                    Schedule:
                                                    </dt>
                                                                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2 justify-between pl-5">
                                                                    <span className="text-left w-40">
                                                                        <div className="text-sm text-left text-gray-900">
                                                                            <div className="">{moment(sideBarData?.date).format('hh:mm A')} to {moment(endTimesideBar).format('hh:mm A')}</div>
                                                                        </div>
                                                                    </span>

                                                                    <span className="flex-shrink-0 w-40">
                                                                        <div onClick={ cancelAppointmentModelHandler } className="text-sm text-red-600 cursor-pointer">
                                                                            <div className="">Cancel Appointment</div>
                                                                        </div>
                                                                    </span>
                                                                </dd>
                                                            </div>


                                                            <AppointmentTimeline
                                                                timeline_events={sideBarData?.timeline_events}
                                                                timeFormat={timeFormat}
                                                            />


                                                            <div className="mt-6 relative flex-1 px-4 sm:px-6">
                                                                <div className="absolute inset-0 px-4 sm:px-6">

                                                                    <div className="slide-over w-full right-0">
                                                                        <button 
                                                                            onClick={() => sidebarHandler(null)} 
                                                                            type="submit" className="w-32 mt-10 mb-5 ml-3 ml-auto mr-auto block justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                                            DONE
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {isOpen && (
                                                <Lightbox
                                                    mainSrc={images[photoIndex]}
                                                    nextSrc={images[(photoIndex + 1) % images.length]}
                                                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                                                    mainSrcThumbnail={images[photoIndex]}
                                                    nextSrcThumbnail={images[(photoIndex + 1) % images.length]}
                                                    prevSrcThumbnail={images[(photoIndex + images.length - 1) % images.length]}
                                                    onCloseRequest={() => this.setState({ isOpen: false, keepModalOpen: false })}
                                                    onMovePrevRequest={() =>
                                                        this.setState({
                                                            photoIndex: (photoIndex + images.length - 1) % images.length,
                                                        })
                                                    }
                                                    onMoveNextRequest={() =>
                                                        this.setState({
                                                            photoIndex: (photoIndex + 1) % images.length,
                                                        })
                                                    }
                                                />
                                            )}
                                            {/* /End replace */}
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});


export default connect(mapStateToProps, { updateAppointment }) (SideBar);
