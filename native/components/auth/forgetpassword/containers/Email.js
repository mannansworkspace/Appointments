import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView,  TouchableHighlight } from 'react-native';
import { sendRecoverPasswordEmail } from "../../../../store/actions/authActions"
import { clearError } from '../../../../store/actions/pageActions';
import { connect, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, TextValidator } from 'react-native-validator-form';
import Wrapper from '../../../HOC/wrapper';

const Email = (props) => {

    

    const [myState, myStateHandler] = useState({
        email: '',
        errors: [],
    })

    const errorStyle = { text: { color: 'red' } }

    const handleSubmit = () => {
        props.actions.sendRecoverPasswordEmail(myState.email, props.navigation)
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content} >
                <View style={styles.borderBlock}>
                    <Form
                        onSubmit = {null}
                    
                    >
                        <View style={{ height: '100%' }}>
                            {!!props.errorMessage?.length  && <Text style={styles.error}> {props.errorMessage}</Text>}

                            <Text style={styles.label}>Email</Text>

                            <TextValidator
                                keyboardType="email-address"
                                validators={['required', 'isEmail']}
                                errorMessages={['This field is required', "Invalid Email"]}
                                value={myState.email}
                                onChangeText={(email) => myStateHandler({ ...myState, email: email })}
                                style={styles.inputField}
                                errorStyle={errorStyle}
                                placeholder="john@email.com"
                            />

                        </View>

                        <View style = {styles.btnWrapper}>

                            <TouchableHighlight
                                underlayColor="none"
                                style={styles.button}
                                onPress={handleSubmit}
                            >
                                    <Text style={styles.buttonTitle}>Continue</Text>
                            </TouchableHighlight>
                        </View>
                    </Form>

                </View>
            </View>
        </SafeAreaView>
    );
}

const mapStateToProps = state => ({
    errorMessage: state.errorReducer.message
});


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            sendRecoverPasswordEmail,
            clearError
        }, dispatch)
    };
}
export default connect(mapStateToProps, mapDispatchToProps)(Wrapper(Email));


const styles = StyleSheet.create({
    container:{
        paddingTop:30
    },
    btnWrapper:{
        position: 'absolute', 
        width: '100%',
        bottom: 20,
        display: 'flex', 
        alignItems: 'center',
    },
    button : {
        marginTop: 20,
        backgroundColor : '#187fd5',
        paddingVertical: 12,
        paddingHorizontal: 100
    },
    buttonTitle: {
        alignSelf: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff'
    },
    title: {
        color: '#444243',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 15
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
        borderRadius: 0
    },
    borderBlock: {
        paddingHorizontal: 30
    },
    label: {
        color: '#0e0e0e',
        fontSize: 12,
        marginBottom: 3
    },
    error: {
        color: 'red',
        marginBottom: 20
    }
});


