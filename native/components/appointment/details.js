import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TouchableHighlight } from 'react-native';
import Spinner from '../common/Spinner';
import { connect } from 'react-redux';
import { frontendURL } from '@env';
import DeliveredView from './bookingInfo/delivered';
import { getSingleAppointment, cancelAppointment } from '../../store/actions/appointment';
import CancelModal from './bookingInfo/cancelModal';
import VehicleDetails from './bookingInfo/vehicleDetails';

const AppointmentDetail = ({ appointment, cancelAppointment, id, navigation }) => {

    const checkedStatus = appointment?.checkedStatus
    const [showModal, setShowModal] = useState(false)


    const cancelAppointmentHandler = async () => {
        const response = await cancelAppointment(appointment)
        if (response) {
            setShowModal(false)
            navigation.popToTop();
        }

    }
    return (

        <>
            {
                appointment.cancelAppointment ?
                    <><View style={{ marginHorizontal: 10, marginTop: 20, backgroundColor: '#C1E1E1', padding: 10, alignItems: 'center' }}>
                        <Text> Appointment has been cancelled by {appointment.company_name}</Text>
                    </View><View
                        style={styles.topContainer}>
                            <VehicleDetails appointment={appointment} />
                        </View>
                    </>
                    :
                    <>
                        {!appointment ?
                            <Spinner />
                            :
                            <View style={styles.container}>
                                <ScrollView>
                                    {
                                        checkedStatus === 'check-out' ?

                                            <DeliveredView appointment={appointment} />
                                            :
                                            <View>



                                                {checkedStatus === 'check-in' ?
                                                    <View style={{ marginHorizontal: 10, marginVertical: 20, backgroundColor: '#C1E1E1', padding: 10, alignItems: 'center' }}>
                                                        <Text> You have been scanned-in. Please go inside the office to scan-out</Text>
                                                    </View>
                                                    :
                                                    <Text style={styles.scanText}>
                                                        Scan this QR code when you arrive to {appointment.warehouse_id.company_name}:
                                                    </Text>
                                                }

                                                <View style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                                                    <Image
                                                        style={styles.QRImg}
                                                        source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=${frontendURL}/driver-at-warehouse/${appointment._id}&amp;size=100x100` }}
                                                        align="QR Code"
                                                        alt="QR Code"
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                <VehicleDetails appointment={appointment} />
                                            </View>

                                    }
                                    <TouchableHighlight
                                        onPress={() => setShowModal(true)}
                                        style={styles.button}
                                        underlayColor='none'
                                    >
                                        <View>
                                            <Text style={styles.buttonTxt}>Cancel Appointment</Text>
                                        </View>
                                    </TouchableHighlight>
                                </ScrollView>
                            </View>
                        }
                        {
                            showModal && <CancelModal
                                showModal={showModal}
                                setShowModal={setShowModal}
                                id={id}
                                cancelAppointmentHandler={cancelAppointmentHandler}
                            />
                        }
                    </>
            }
        </>
    );
}

const mapStateToProps = state => ({
    appointment: state.appointmentReducer.appointment
});


export default connect(mapStateToProps, { getSingleAppointment, cancelAppointment })(AppointmentDetail);


const styles = StyleSheet.create({
    txtContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20
    },
    detailContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    QRImg: {
        width: 180,
        height: 180
    },
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        maxWidth: 384,
    },
    topContainer: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 20,
        maxWidth: 384,
    },
    scanText: {
        marginBottom: 4,
        lineHeight: 24,
        fontSize: 16
    },
    img: {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
    },
    detailTxtContainer: {
        paddingTop: 48,

    },
    detText: {
        width: 80,
        lineHeight: 24,
        fontSize: 16,
        fontWeight: 'bold'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonTxt: {
        color: '#800'
    }

})