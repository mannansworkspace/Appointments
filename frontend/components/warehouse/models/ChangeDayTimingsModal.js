import React, { Fragment,Component } from 'react'
import { Dialog, Transition } from '@headlessui/react';
import * as moment from 'moment';
import timingOptionList from '../../../utils/timingOptionList'

class ChangeTimingsModal extends Component {

    state ={
        fromTime: '08:00',
        toTime: '17:00'
    }

    onChangeHandle = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render(){

        return (
            <Transition.Root show={this.props.openModel} as={Fragment}>
            <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={this.props.openModel} onClose={() => this.props.modelHandler(false)}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

            
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                            <div>
                                
                                <div className="text-center">
                                    <Dialog.Title as="h3" className="text-lg leading-6 text-black font-semi-bold">
                                        Timing for {moment(this.props.date).format("dddd, MMMM Do")}
                                    </Dialog.Title>
                                    
                                    <div className="flex justify-between items-center sm:p-4 md:p-8">
                                        <form>
                                            <div>
                                                <select 
                                                    onChange={this.onChangeHandle}
                                                    name="fromTime"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={this.state.fromTime}
                                                >
                                                    {timingOptionList('00:00', '11:30', 30)}
                                                </select>
                                            </div>
                                            <div>to</div>
                                            <div>
                                                
                                                <select 
                                                    onChange={this.onChangeHandle} 
                                                    name="toTime"
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                    value={this.state.toTime}
                                                >
                                                    {timingOptionList('12:00', '23:30', 30)}
                                                </select>
                                            </div>
                                        </form>

                                    </div>
                                        
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 flex justify-center">
                                <button
                                type="button"
                                    className="inline-flex mr-3 justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm border text-gray-400 border border-solid border-gray-500 w-28"
                                    onClick={() => this.props.modelHandler(false)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex ml-3 justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-28 sm:text-sm"
                                    onClick={() => this.props.onSubmit(this.state) }
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
        );
    }
}

export default ChangeTimingsModal;