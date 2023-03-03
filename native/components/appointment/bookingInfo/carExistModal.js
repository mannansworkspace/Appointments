import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { connect } from "react-redux";
import {setCarEXistError} from '../../../store/actions/appointment'
import { useDispatch } from "react-redux";
const CarExistModal = ({isCarExist , message}) => {

    const dispatch = useDispatch()
   
  

    return (
        <Modal
            transparent={true}
            visible={isCarExist}
        >
            <TouchableWithoutFeedback >
                <View style={styles.modalTouch} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View>
                        <Text style={styles.topHeading}>Car Exists!!</Text>
                    </View>

                    <View style={styles.msgContainer}>
                        <Text>
                            {
                                message ? message : 'Vehicle with this vin/lot already exists, duplicate appointments are not allowed'
                            }
                        
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight
                            onPress={() => dispatch(setCarEXistError(false))}
                            style={styles.button}
                            underlayColor='none'
                        >
                            <View>
                                <Text style={styles.buttonTxt}>Close</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const mapStateToProps = state => ({
    isCarExist : state.appointmentReducer.carExists
});


export default connect(mapStateToProps , {setCarEXistError})(CarExistModal);

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