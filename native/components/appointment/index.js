import React, { useEffect } from 'react';
import Spinner from '../common/Spinner';
import { connect, useDispatch } from 'react-redux';
import { getSingleAppointment, clearSingleAppt } from '../../store/actions/appointment';
import Details from './details'
import BookingInfo from './bookingInfo'

const Appointment = ({ route, navigation, appointment }) => {

    const id = route?.params?.id
    const dispatch = useDispatch()
    const page  = appointment?.page

    useEffect(() => {
        id && dispatch(getSingleAppointment(id))
        return () => {
            dispatch(clearSingleAppt())
        }
    }, [])

    const isWarehouse = () =>{
     const warehouse = appointment?.warehouse_id
     return typeof warehouse != 'string'
        
    }

    return (
        <>
            {!appointment
                ?
                <Spinner />
                :
                id && page > 2 && isWarehouse() // isWarehouse is used to prevent forwarding details without warehouse details... if warehouse is string it means not-populated yet
                    ?
                    <Details id={id} navigation = {navigation}/>
                    :
                    <BookingInfo navigation={navigation} />
            }
        </>
    );
}

const mapStateToProps = state => ({

    appointment: state.appointmentReducer.appointment
});


export default connect(mapStateToProps, { getSingleAppointment, clearSingleAppt })(Appointment);