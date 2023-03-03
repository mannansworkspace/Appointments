import React from 'react';
import * as moment from 'moment';
import Unconfirmed from '../../assets/svgs/unconfirmedAppt.svg';
import CheckIn1 from '../../assets/svgs/checkIn1.svg';
import CheckIn2 from '../../assets/svgs/checkIn2.svg';
import CheckIn3 from '../../assets/svgs/checkIn3.svg';
import Cake from '../../assets/svgs/Cake.svg';
import Exclamation from '../../assets/svgs/Exclamation.svg';

const truncate = (input) => input?.length > 20 ? `${input.substring(0, 20)}...` : input;
    
//this function will return color of the slot to bw shown
const extraSlotColor = (slotNo) => {
    let color = 'bg-pink-100';
    
    if(slotNo === 1) {
        color = 'bg-green-100'
    }
    else if(slotNo === 2) {
        color = 'bg-yellow-100'
    }

    return color;
}

export const AvailableSlot = ({slot, openModel }) => {
    return (
        <>
        <div style={{width: '286px'}} onClick={ () => openModel(slot.date)} 
            className={`mb-4 h-16 w-56 ${!slot.slotNo ? 'bg-blue-700 hover:bg-blue-600' : extraSlotColor(slot.slotNo)} cursor-pointer hover:border-gray-500 text-white relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-4`}>
            <div className="flex-shrink-0">
            </div>
            <div className="time-section text-center ml-0 w-full">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <p className={`text-sm font-semibold ${!slot.slotNo ? 'text-white' : 'text-black'} `}>
                    {moment(slot.date).format('hh:mm A') }
                </p>
            </div>
        </div>
        </> 
    )
}

export const DisabledSlot = ({ slot }) => {

    return (
        <div style={{width: '286px'}} className="mb-4 h-16 w-56 bg-gray-300 text-white relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-4 ">
            <div className="flex-shrink-0">
            </div>
            <div className="time-section text-center ml-0 w-full">
                <span className="absolute inset-0" aria-hidden="true"></span>
                <p className="text-sm font-semibold text-black">
                    {moment(slot.date).format('hh:mm A') }
                </p>
            </div>
        </div> 
    )
}

export const LunchTimeSlot = ({slot}) => {
    return (
        <div className="flex items-center mb-4">
            <div style={{width: '286px'}} className="cursor-pointer h-16 relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-4">
                <div className='flex divide-x-2 divide-gray-200'>
                    <div className='mr-2.5   -mt-2'>
                        <p className="text-xs font-normal text-gray-700 w-full">
                            {moment(slot.date).format('hh:mm A')}
                        </p>
                        
                    </div>
                    <div className='flex items-center'>
                        <img className="text-gray-500 w-6 h-6 ml-5" src={Cake}  alt="cake" />
                        <div className='w-full ml-2'>Lunch Break</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const BookedSlot = ({ slot, slotMenuID, addTimeSlot, sidebarHandler, slotMenuHandler, removeTimeSlot, setButtonRef }) => {
    let missingVehicle = false;
    slot.timeline_events.map(item => item.event_name === 'vehicle Missing' && (missingVehicle = true))
    return (
        <div className="flex items-center mb-4">
            <div style={{width: '286px'}} className={`${slot.slotNo === 0 ? 'bg-white' : extraSlotColor(slot.slotNo)} cursor-pointer h-16 relative rounded-lg border border-gray-300 px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 mr-4`}>
                <div onClick={(e) => sidebarHandler(slot)} className='flex divide-x-2 divide-gray-200'>
                    <div className='w-full mr-1'>
                        <p className="text-xs font-small text-gray-700 w-14">
                            {moment(slot.date).format('hh:mm A')}
                        </p>
                        {slot.status && slot.page > 2 ? <div className="flex-shrink-0">
                            <div className='flex items-center'>           
                                {slot.status ? (
                                    <div>
                                        {slot.page > 2 && !slot.check_out ? (
                                            <div>
                                                {slot.check_in_time ? (
                                                    <img src={CheckIn2} className='h-6 w-6' alt="check in" />
                                                ): (
                                                    <img src={CheckIn1} className='h-6 w-6' alt="check in" />
                                                )}
                                            </div>
                                        ): (
                                            <img src={CheckIn3} className='h-6 w-6' alt="check in" />
                                        )}
                                    </div>
                                ): (
                                    <img src={CheckIn1} className='h-6 w-6' alt="check in" />
                                )}
                                {missingVehicle && (
                                    <img src={Exclamation} className="w-6 h-6"  alt="exclamation" />
                                )}
                            </div>
                        </div>
                            :
                              <div className={`flex-shrink-0 ${slot.company_name?.length < 7 && 'mr-5' } `}>
                                    <img className={`text-gray-500 ${slot.company_name?.length < 7 ? 'w-12' : 'w-6'} h-6`} src={Unconfirmed}  alt="half check in" />
                                </div>
}               
                    </div>
                    <div className="time-section text-center ml-0 w-full">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        
                        <p className={`text-sm text-gray-700 truncate ${slot?.company_name?.length < 7 ? 'ml-2' : 'ml-3'} font-medium`}>
                            {slot.company_name ?  `${ truncate(slot.company_name)}` : '' }
                        </p>
                        <p className={`text-sm text-left text-gray-700 truncate ${slot?.company_name?.length < 7 ? 'ml-4' : 'ml-3'}`}>
                            {slot.car}
                        </p>
                    </div>
                </div>

                <div className="relative ml-auto float-right" style={{marginLeft: "auto"}}>
                    
                    {/* <!-- Dropdown toggle button --> */}
                    <button type='button' className="block p-2 text-gray-400 rounded-md" onClick={() => slotMenuHandler(slot._id)}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>

                    { slotMenuID === slot._id && (
                    <div ref={setButtonRef} className="shadow-2xl absolute z-10 right-0 w-48 py-2 mt-2 bg-white rounded-md">
                        
                        <button type='button' onClick={() => addTimeSlot(slot.date, moment(slot.date).format('hh:mm A'))} className="w-full text-left block px-4 py-2 text-sm text-gray-300 text-gray-700">
                            Add another { moment(slot.date).format('hh:mm A')}
                        </button>
                        {
                            slot.showDelete &&
                            <button onClick={() => removeTimeSlot(slot.date, slot.deleteSlot._id)} className="w-full text-left block px-4 py-2 text-sm text-gray-300 text-gray-700">
                                Delete
                            </button>
                        }
                        
                    </div>
                    )}
                </div> 
            </div>
        </div>
    )
}