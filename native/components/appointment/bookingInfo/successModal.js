import React from "react";
import { Modal, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';

const SuccessModal = ({ navigation, modalVisible }) => {


    const goToDashboard = () => {
        navigation.popToTop();
    }

    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={modalVisible}
        >
            <TouchableWithoutFeedback >
                <View style={styles.modalTouch} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View>
                        <Text style={styles.topHeading}>You're all set!</Text>
                    </View>

                    <View style={styles.msgContainer}>
                        <Text>
                            Your appointment is confirmed. You can view the details by clicking
                            the appointment on your dashboard.
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            onPress={() => goToDashboard()}
                            style={styles.button}
                            underlayColor='none'
                        >
                            <View>
                                <Text style={styles.buttonTxt}>Go to Dashboard</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default SuccessModal;

const styles = StyleSheet.create({
    buttonTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 25
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