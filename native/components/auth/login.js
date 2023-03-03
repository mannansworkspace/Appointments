import React, { useRef, useState } from 'react';
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native';
import { Form, TextValidator } from 'react-native-validator-form';
import { connect, useDispatch } from 'react-redux';
import { loginUser } from '../../store/actions/authActions';
import { clearError } from '../../store/actions/pageActions';
import Wrapper from '../HOC/wrapper';
import { useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-gesture-handler';


const Login = ({ navigation, loginUser }) => {
    let formRef = useRef(null);
    const errorMessage = useSelector((state) => state.errorReducer.message)

    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: '',
    })

    const errorStyle = { text: { color: 'red' } }

    const { email, password } = loginFormData;

    const dispatch = useDispatch()
    const onChangeHandler = (name, value) => {
        setLoginFormData({
            ...loginFormData,
            [name]: value
        })

    }

    const onSubmit = () => {

        const loginData = {
            ...loginFormData
        }

        if (loginData.email[0] === '+') {
            loginData.email = loginData.email.slice(1)
        }
        if (loginData.email[0] === '1') {
            loginData.email = loginData.email.slice(1)
        }

        dispatch(loginUser(loginData));
    }

    const handleSubmit = () => {
        formRef.submit();
    }


    return (

        <KeyboardAwareScrollView 
            bounces = {false}
            extraHeight = {110}
            style = {{flex : 1}}>
                <ScrollView style={styles.containerPage} bounces = {false}>
                    <View style={{ flex: 1 }} >
                        {errorMessage?.length > 0 &&
                            <Text style={styles.error} > {errorMessage} </Text>
                        }

                        <View style={styles.iconContainer} >
                            <Text style={styles.iconLabel} >
                                Push <Text style={styles.iconLabel2} > Tow </Text>
                            </Text>
                        </View>

                        <Form
                            ref={ref => formRef = ref}
                            onSubmit={onSubmit}
                        >
                            <Text style={styles.label} > Email </Text>
                            <TextValidator
                                keyboardType="email-address"
                                validators={
                                    ['required']}
                                errorMessages={
                                    ['This field is required']}
                                value={email}
                                onChangeText={
                                    (email) => onChangeHandler('email', email)}
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                placeholder="john@email.com"
                            />

                            <Text style={styles.label} > Password </Text>

                            <TextValidator
                                secureTextEntry
                                validators={
                                    ['required', 'minStringLength:7']}
                                errorMessages={
                                    ['This field is required', 'Password length must be greater than 7']}
                                value={password}
                                onChangeText={
                                    (password) => onChangeHandler('password', password)}
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                placeholder="*******"
                            />

                            <View style={{ position: 'relative' }}>

                                <TouchableHighlight underlayColor='none'
                                    onPress={
                                        () => {
                                            navigation.push("Email")
                                        }
                                    }
                                    style={{
                                        position: 'absolute',
                                        right: 0
                                    }}
                                >
                                    <Text style={{ color: '#1a7fd6' }} > Forgot password ? </Text>
                                </TouchableHighlight>
                            </View>

                            <TouchableHighlight
                                underlayColor='none'
                                style={styles.button}
                                onPress={handleSubmit} >
                                <Text style={styles.buttonTitle} > LOG IN </Text>
                            </TouchableHighlight>
                        </Form>


                    </View>
                    <View
                        style={styles.signUp}

                    >
                        <TouchableHighlight
                            underlayColor='none'
                            onPress={
                                () => {
                                    navigation.navigate('Signup')
                                }
                            }
                        >
                            <Text > New User ? < Text style={{ color: '#1a7fd6' }} > Create a free account </Text> </Text >
                        </TouchableHighlight>
                    </View>
                </ScrollView>
        </KeyboardAwareScrollView>


    );
}



export default connect(null, {
    loginUser,
    clearError
})(Wrapper(Login));

const styles = StyleSheet.create({
    containerPage: {
        flex: 1,
        marginTop: 30,
        paddingHorizontal: 30,
    },
    button: {
        width: '100%',
        borderRadius: 0,
        backgroundColor: '#057a55',
        height: 60,
        justifyContent: 'center',
        marginTop: 40
    },
    buttonTitle: {
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    },
    label: {
        display: 'flex',
        paddingLeft: 0,
        color: '#212529',
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 20
    },
    iconContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconLabel: {
        color: '#014a80',
        fontWeight: 'bold',
        marginBottom: 0,
        fontStyle: 'italic',
        fontSize: 32
    },
    iconLabel2: {
        color: '#00aeef',
        fontWeight: 'bold',
        marginBottom: 0,
        fontStyle: 'normal',
        fontSize: 32
    },
    inputField: {
        display: 'flex',
        width: '100%',
        height: 45,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 14,
        color: '#555',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
    },
    signUp: {
        alignSelf: 'center',
        position: 'relative',
        height: '100%',
        marginTop : 10
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
})