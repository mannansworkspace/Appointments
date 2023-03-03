import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { getSingleAppointment } from "../../../store/actions/appointment";

const CancelModal = ({ showModal,setShowModal,id, cancelAppointmentHandler}) => {

    const [IsButtonsDisabled , setIsButtonsDisabled] = useState(false)


    useEffect(()=>{
        return () =>{
            id && getSingleAppointment(id)
        } 
    },[])

    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={showModal}
        >
            <TouchableWithoutFeedback >
                <View style={styles.modalTouch} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View>
                        <Text style={styles.topHeading}>Cancel Appointment</Text>
                    </View>

                    <View style={styles.msgContainer}>
                        <Text>
                        Are you sure you want to cancel the appointment?. You will lose your time-slot.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            onPress={() => {
                                setIsButtonsDisabled(true)
                                setShowModal(false)
                            }}
                            style={styles.button}
                            underlayColor='none'
                            disabled={IsButtonsDisabled}
                        >
                            <View>
                                <Text style={styles.buttonTxt}>Keep appt</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            onPress={() => {
                                setIsButtonsDisabled(true)
                                cancelAppointmentHandler() 
                            }}
                            disabled={IsButtonsDisabled}
                            style={styles.cancelButton}
                            underlayColor='none'
                        >
                            <View>
                                <Text style={styles.buttonTxt}>Cancel appt</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default CancelModal;

const styles = StyleSheet.create({
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 25,
        display:"flex",
        flexDirection:"row"
    },
    modalTouch: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)'
    },
    button: {
        backgroundColor: '#187fd5',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 8,
        // marginTop: 20
    },
    cancelButton : {
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 8,
        backgroundColor: '#800',
        marginLeft:5
    },
    msgContainer: {
        marginTop: 20
    },
    topHeading: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 1,
        borderColor: 'grey',
        borderWidth: 1,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
})