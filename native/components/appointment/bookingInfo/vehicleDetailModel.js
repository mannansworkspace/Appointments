import React, { useState, useRef } from "react";
import { Modal, View, Text, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
import { XIcon } from 'react-native-heroicons/solid'
import { Form, TextValidator } from 'react-native-validator-form';


const SuccessModal = ({ modalVisible, onSave, onCancel }) => {
    let formRef = useRef(null);

    const [formData, setFormData] = useState({
        year: '',
        make: '',
        model: '',
        vin: '',
    })

    const { year, make, model, vin } = formData;

    const errorStyle = { text: { color: 'red' }}

    const onSubmit = () => {

        onSave({
            images: [],
            yearMakeModel: `${formData.year} ${formData.make} ${formData.model}`,
            vinNumber: formData.vin,
            lotNo: formData.vin,
            key: modalVisible
        })
    }

    const onChangeHandler = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    return (
        <Modal
            // animationType="slide"
            transparent={true}
            visible={modalVisible !== null}
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View style={styles.modalTouch} />
            </TouchableWithoutFeedback>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{ borderBottomWidth: 1, borderColor: '#e5e7eb', padding: 15, display: 'flex', flexDirection: 'row', alignItems: 'center', }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', }}>Enter the vehicle details</Text>
                        <XIcon 
                            onPress={onCancel}
                            style={{ color: 'black', position: 'relative', left: 35, }} 
                        />
                    </View>
                    <Form
                        ref={ref => formRef = ref}
                        onSubmit={onSubmit}
                    >
                        <View style={{ padding: 15, marginRight: 'auto', marginBottom: -10 }}>
                            <Text style={styles.label}>Year</Text>
                            <TextValidator
                                style={[styles.inputField]}
                                errorStyle={errorStyle}
                                value={year}
                                onChangeText={(year) => onChangeHandler('year', year)}
                                validators={['required']}
                                errorMessages={['required']}
                            />
                        </View>
                        <View style={{ padding: 15, marginRight: 'auto', marginBottom: -10 }}>
                            <Text style={styles.label}>Make</Text>
                            <TextValidator
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                value={make}
                                onChangeText={(make) => onChangeHandler('make', make)}
                                validators={['required']}
                                errorMessages={['required']}
                            />
                        </View>
                        <View style={{ padding: 15, marginRight: 'auto', marginBottom: -10 }}>
                            <Text style={styles.label}>Model</Text>
                            <TextValidator
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                value={model}
                                onChangeText={(model) => onChangeHandler('model', model)}
                                validators={['required']}
                                errorMessages={['required']}
                            />
                        </View>
                        <View style={{ padding: 15, marginRight: 'auto', marginBottom: -10 }}>
                            <Text style={styles.label}>Full vin#</Text>
                            <TextValidator
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                value={vin}
                                onChangeText={(vin) => onChangeHandler('vin', vin)}
                                validators={['required']}
                                errorMessages={['required']}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                onPress={onCancel}
                                style={styles.cancelButton}
                                underlayColor='none'
                            >
                                <Text style={styles.cancelTxt}>cancel</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                onPress={() => formRef.submit()}
                                style={styles.saveButton}
                                underlayColor='none'
                            >
                                <Text style={styles.saveTxt}>Save</Text>
                            </TouchableHighlight>
                        </View>
                    </Form>
                </View>
            </View>
        </Modal>
    );
}

export default SuccessModal;

const styles = StyleSheet.create({
    label : {
        fontSize: 14, 
        textAlign: 'left'
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
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
        marginBottom: 10,
    },

    cancelButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        marginRight: 8,
        width: 112,
        height: 38,
    },

    saveButton: {
        backgroundColor: '#417958',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginLeft: 8,
        width: 112,
        height: 38,
        color: 'white',
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'lightgray',
        width: 284,
        height: 38,
        borderRadius: 6,
        paddingLeft: 5
    },
    cancelTxt: {
        color: 'gray',
        fontWeight: 'bold'
    },
    saveTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
})