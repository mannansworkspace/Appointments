import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import { verifyPhoneEmail } from '../../../store/actions/authActions';
import { connect, useDispatch } from 'react-redux';
import { Form, TextValidator } from 'react-native-validator-form';
import { SET_DRIVER } from '../../../store/actions/types';
import Wrapper from '../../HOC/wrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const PhoneNumber = ({ navigation, saveDriver, verifyPhoneEmail, error }) => {
    let formRef = useRef(null);

    const dispatch = useDispatch()



    const [formData, setFormData] = useState({
        phoneNumber: '',
        email: '',
        firstName: '',
        lastName: '',
        password: ''
    })

    const { phoneNumber, email, firstName, lastName, password } = formData;

    const errorStyle = { text: { color: 'red' } }



    const onSubmit = () => {

        const formattedNumber = (__DEV__ ? '+92' : '+1') + phoneNumber

        saveDriver(formData)
        verifyPhoneEmail(formattedNumber, email, navigation);
    }

    const onChangeHandler = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = () => {
        formRef.submit();
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <KeyboardAwareScrollView
                extraHeight={100}
                bounces={false}
            >
                <View style={styles.borderBlock}>
                    <Form
                        ref={ref => formRef = ref}
                        onSubmit={onSubmit}
                    >
                        <View style={{ height: '100%' }}>
                            <ScrollView >
                                {!!error.length && <Text style={styles.error}> {error}</Text>}

                                <Text style={styles.title} >Your Information</Text>

                                <View style={{ width: '100%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                                    <View style={{ width: '45%' }}>
                                        <Text>First Name</Text>
                                        <TextValidator
                                            validators={['required']}
                                            errorMessages={['required']}
                                            value={firstName}
                                            onChangeText={(firstName) => onChangeHandler('firstName', firstName)}
                                            style={styles.inputField}
                                            errorStyle={errorStyle}
                                        />

                                    </View>

                                    <View style={{ width: '50%' }}>
                                        <Text>Last Name</Text>
                                        <TextValidator
                                            validators={['required']}
                                            errorMessages={['required']}
                                            value={lastName}
                                            onChangeText={(lastName) => onChangeHandler('lastName', lastName)}
                                            style={styles.inputField}
                                            errorStyle={errorStyle}
                                        />
                                    </View>
                                </View>

                                <Text style={styles.label}>Email</Text>

                                <TextValidator
                                    keyboardType="email-address"
                                    validators={['required', 'isEmail']}
                                    errorMessages={['This field is required', 'Email invalid']}
                                    value={email}
                                    onChangeText={(email) => onChangeHandler('email', email)}
                                    style={styles.inputField}
                                    errorStyle={errorStyle}
                                    placeholder="john@email.com"
                                />
                                <Text style={{ fontSize: 12, color: '#1a7fd6' }}>Please use an email you can access on your phone</Text>


                                <Text style={styles.label}>Mobile Phone Number</Text>

                                <View style={[styles.inputContainer, styles.inputField]}>
                                    <Text style={styles.prefix} >1</Text>
                                    <TextValidator
                                        keyboardType="number-pad"
                                        style={{ display: 'flex', width: 600, }}
                                        validators={['minStringLength:10', 'maxStringLength:10']}
                                        errorMessages={['Phone number must be 10 digit']}
                                        value={phoneNumber}
                                        onChangeText={(phoneNumber) => onChangeHandler('phoneNumber', phoneNumber)}
                                        errorStyle={errorStyle}
                                        maxLength={10}
                                    />
                                </View>

                                <Text style={styles.label}>Create Password</Text>

                                <TextValidator
                                    secureTextEntry={true}
                                    validators={['minStringLength:7']}
                                    errorMessages={[' Must be at least 7 characters']}
                                    value={password}
                                    onChangeText={(password) => onChangeHandler('password', password)}
                                    style={styles.inputField}
                                    errorStyle={errorStyle}
                                    placeholder="*******"
                                />
                                <Text style={{ fontSize: 12 }}>Must be atleast 7 characters</Text>
                            </ScrollView>
                        </View>
                    </Form>

                </View >
            </KeyboardAwareScrollView>
            <View style={styles.btnWrapper}>
                 <TouchableHighlight
                     underlayColor="none"
                     style={styles.button}
                     onPress={handleSubmit}
                 >
                     <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue</Text>
                 </TouchableHighlight>
             </View>
        </View >

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        color: '#444243',
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 25
    },
    label: {
        marginTop: 20
    },
    inputContainer: {
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'row',
    },
    prefix: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: 14
    },
    inputField: {
        display: 'flex',
        width: '100%',
        height: 34,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 14,
        color: '#555',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
    },
    borderBlock: {
        flex: 1,
        paddingHorizontal: 30,
        marginTop: 20
    },
    btnWrapper: {
        position: 'absolute',
        width: '100%',
        bottom: 20,
        flex: 1,
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#187fd5',
        paddingVertical: 12,
        paddingHorizontal: 100
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }

});

const mapStateToProps = state => ({
    error: state.errorReducer.message,
    newDriver: state.newDriverReducer.newDriver
});


function mapDispatchToProps(dispatch) {
    return {
        verifyPhoneEmail: (phoneNumber, email, navigation) => {
            return dispatch(verifyPhoneEmail(phoneNumber, email, navigation))
        },
        saveDriver: (data) => dispatch({ type: SET_DRIVER, payload: data })
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper(PhoneNumber));
