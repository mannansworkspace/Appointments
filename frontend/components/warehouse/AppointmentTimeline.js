import React, { Component } from 'react'
import * as moment from 'moment'
import Exclamation from '../../assets/svgs/Exclamation.svg'

class AppointmentTimeline extends Component {

    render() {

        const timelineEvents = ( this.props.timeline_events && Array.isArray(this.props.timeline_events) ) ? this.props.timeline_events : [];
        const timeFormat = this.props.timeFormat;

        const abs_timeformat = Math.abs(timeFormat)>=10 ? Math.abs(timeFormat)+'00' : '0'+Math.abs(timeFormat)+'00';

        return (

            <div className="py-4 sm:py-8 pl-5 pr-5 sm:grid">
                <div className="flow-root">
            
                    <ul className="-mb-8">

                        { timelineEvents.map( (event, index, timelineEventsArray) => {

                            const nowDateConvertedPerTimeZone = 
                                timeFormat ? 
                                timeFormat < 0 ? moment(event.event_time).utcOffset('-'+abs_timeformat).format('h:mm A') : moment(event.event_time).utcOffset('+'+abs_timeformat).format('h:mm A')
                                : moment(event.event_time).format('h:mm A');

                            return <li key={index}>
                                    <div className="relative pb-8">
                                        { (index<timelineEventsArray.length-1) && <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>}
                                        <div className="relative flex space-x-3">
                                            <div>

                                                { (event.event_name.indexOf('Booked appointment') > -1) && <>
                                                        <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </>
                                                }

                                                { (event.event_name.indexOf('confirmed appt') > -1) && <>
                                                        <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </>
                                                }
                                                
                                                { (event.event_name.indexOf('checked-in') > -1) && <>
                                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    </>
                                                }

                                                { (event.event_name.indexOf('vehicle Missing') > -1) && <>
                                                        {/* <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white"> */}
                                                            <img src={Exclamation} className='h-10 w-8' alt='exclamation' />
                                                            {/* <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg> */}
                                                        {/* </span> */}
                                                    </>
                                                }
                                                
                                                { (event.event_name.indexOf('checked-out') > -1) && <>
                                                    <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                                        <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                    </>
                                                }
                                                
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                                <div>
                                                    {event.vehicle ? (
                                                        <p className='text-sm text-gray-700 w-64'>
                                                            Driver didn't bring {event.vehicle}
                                                        </p>
                                                    ): (
                                                        <p className="text-sm text-gray-500">
                                                            {event.event_name} at <font style={{color: 'black'}}>{nowDateConvertedPerTimeZone}</font>
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time dateTime={moment(event.event_time).format('MMM D')}>{moment(event.event_time).format('MMM D')}</time>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                        })}

                    </ul>

                </div>
            
            </div>

        )
    }
}

export default AppointmentTimeline
