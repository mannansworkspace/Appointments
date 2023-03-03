import React, { useEffect } from "react";
import { Image, Modal, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

const VehicleModal = ({ onCancel, onSave, displayInform }) => {



    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={!!displayInform}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.modalTouch} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ borderWidth: 1, borderColor: 'black', padding: 25 }}>
                        <View>
                            <Text style={styles.topHeading}>Is this the correct vehicle?</Text>
                        </View>

                        <View >
                            {displayInform?.yearMakeModel && <Text style={[styles.topHeading, { marginTop: 25 }]}>{displayInform?.yearMakeModel}</Text>}
                            {displayInform?.vinNumber && <Text style={styles.msgContainer}>Vin: {displayInform?.vinNumber}</Text>}
                            {displayInform?.lotNo && <Text style={styles.msgContainer}>Lot: {displayInform?.lotNo}</Text>}
                        </View>

                        {displayInform?.images && displayInform.images.length > 0 &&
                            <View style={{ marginTop: 20, flexWrap: 'wrap', flexDirection: 'row' }} className="gallery-modal-images mt-5 flex justify-center flex-wrap">
                                {displayInform.images.slice(5).map((item) =>
                                    <Image source={{ uri: item }} style={{ marginRight: 4, marginBottom: 4, height: 55, width: 55 }} alt="car" />
                                )}
                            </View>
                        }

                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                onPress={() => onCancel(displayInform.key)}
                                style={styles.cancelButton}
                                underlayColor='none'
                            >
                                <Text style={styles.cancelTxt}>cancel</Text>
                            </TouchableHighlight>
                            {
                                (displayInform?.vinNumber || displayInform?.lotNo) && <TouchableHighlight
                                    onPress={() => onSave(displayInform)}
                                    style={styles.saveButton}
                                    underlayColor='none'
                                >
                                    <Text style={styles.saveTxt}>Save</Text>
                                </TouchableHighlight>

                            }
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}


const mapStateToProps = state => ({
    displayInform: state.appointmentReducer.displayInform,
});


export default connect(mapStateToProps, {})(VehicleModal);

const styles = StyleSheet.create({
    cancelTxt: {
        color: 'gray',
        fontWeight: 'bold'
    },
    saveTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
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
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 8,
    },
    saveButton: {
        backgroundColor: '#417958',
        paddingVertical: 10,
        paddingHorizontal: 17,
        borderRadius: 8,
        marginLeft: 8,
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
        borderRadius: 8,
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