import React, { Component } from 'react';
import StickyBox from "react-sticky-box";
import * as moment from 'moment';
import { BookedSlot } from '../../common/Slots';
import { addExtraTimeSlotOnDay} from '../../../store/actions/appointmentAction';
import { connect } from 'react-redux'

class AllSlots extends Component {

    constructor(props) {
        super(props);

        this.state = {
            slotMenuID: null,
        }
    }

    slotMenuHandler = (id) => {
        this.setState({
            slotMenuID: id ? id : null
        })
    }

    addListHandler = (item, time_slot) => {
        
        this.props.addExtraTimeSlotOnDay( item, time_slot);
    }

    AppointmentsGroupedByDate() {
        const result = {};
        this.props.searchAppointmentResults.map( (appointment, index) => {
            const d = moment(appointment.date).format('dddd, MMM Do');
            if(result[d]) {
                result[d].push(appointment)
            } else {
                result[d] = [];
                result[d].push(appointment);
            }
            return null;
        });
        return result;
    }

    render() {
        const groupedByDateAppointment = this.AppointmentsGroupedByDate();

        return (
            <div className="time-slot-tabs mt-5">
                {
                /*this.props.searchAppointmentResults.length ? this.props.searchAppointmentResults.map((value, index) => {*/
                Object.keys( groupedByDateAppointment ).length ? Object.keys( groupedByDateAppointment ).map(key => {
                    const thisTimeSlotAppointments = groupedByDateAppointment[key];
                    
                    return <>
                        <StickyBox style={{ background: '#f3f4f6', zIndex: '9', paddingBottom: '10px' }}>
                            <div className="h-16"></div>
                            <h2 className="text-2xl
                            font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate text-left">
                                {key}
                            </h2>
                        </StickyBox>

                        { 
                            thisTimeSlotAppointments.map( (value) => (
                                <BookedSlot 
                                    slot={value}
                                    slotMenuID={this.state.slotMenuID}
                                    addTimeSlot={this.addListHandler}
                                    sidebarHandler={this.props.sidebarHandler}
                                    slotMenuHandler={this.slotMenuHandler}
                                />
                            ))
                        }
                        
                    </>
                }) : <h4> No result found </h4>}
            </div>
        )
    }
}
export default connect(null, {addExtraTimeSlotOnDay})(AllSlots)
