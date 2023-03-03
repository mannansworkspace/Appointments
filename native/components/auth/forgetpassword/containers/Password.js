import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { connect  } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, TextValidator } from 'react-native-validator-form';
import { resetPassword } from '../../../../store/actions/authActions';
import { clearError } from '../../../../store/actions/pageActions';
import Wrapper from '../../../HOC/wrapper';

const Password = (props) => {

    const [myState, myStateHandler] = useState({
        password: '',
        newPassword: '',
        errors: {}
    })

    

    const errorStyle = { text: { color: 'red' } }


    const handleSubmit =  () => {

        if (JSON.stringify(myState.password) !== JSON.stringify(myState.newPassword)) {
            myStateHandler({
                ...myState
                ,
                errors: {
                    message: 'Password not match.'
                }
            })

            return;
        }

        if (!(myState.password.length > 0 || myState.password.length > 0)) {
            myStateHandler({
                ...myState,
                errors: {
                    message: 'Password Couldnot be empty.'
                }
            })

            return
        }

        const { token } = props.passwordRecovery;

        const data = {
            password: myState.password
        }

         props.actions.resetPassword(data, token, props.navigation)

    }



    return (
        <View style={[styles.borderBlock , styles.container]}>
            <Form>
                <View style={{ height: '100%' }}>
                    <Text style={styles.title} > Create a new password for your account </Text>
                    <Text style={styles.label} >Type a new password. Must be at least 7 characters </Text>

                    <TextValidator
                        secureTextEntry={true}
                        validators={['minStringLength:7']}
                        errorMessages={[' Must be at least 7 characters']}
                        value={myState.password}
                        onChangeText={(password) => { clearError(); myStateHandler({ ...myState, password: password }) }}
                        style={styles.inputField}
                        errorStyle={errorStyle}
                    />

                    <Text style={styles.label} >Retype new password. </Text>
                    <TextValidator
                        secureTextEntry={true}
                        validators={['minStringLength:7']}
                        errorMessages={[' Must be at least 7 characters']}
                        value={myState.newPassword}
                        onChangeText={(newPassword) => { clearError(); myStateHandler({ ...myState, newPassword: newPassword }) }}
                        style={styles.inputField}
                        errorStyle={errorStyle}
                    />

                    {

                        !!props.errors?.length
                            ?
                            <Text style={styles.error}> {props.errors}</Text>
                            :
                            <>
                                {
                                    !!myState.errors?.message?.length? <Text style={styles.error}> {myState.errors?.message}</Text>
                                        :
                                        null
                                }
                            </>
                    }

                </View>



                <View >
                    <View style={styles.btnWrapper}>

                        <TouchableHighlight
                            underlayColor="none"
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.buttonTitle}>Continue</Text>
                        </TouchableHighlight>
                    </View>
                </View>

            </Form>
        </View>
    );
}

const mapStateToProps = state => ({
    errors: state.errorReducer.message,
    passwordRecovery: state.newDriverReducer.passwordRecovery
});

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            resetPassword,
            clearError
        }, dispatch)
    };
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 30
    },
    btnWrapper: {
        position: 'absolute',
        width: '100%',
        bottom: 20,
        display: 'flex',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#187fd5',
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
        borderRadius: 0,
    },
    borderBlock: {
        paddingHorizontal: 30
    },
    label: {
        color: '#0e0e0e',
        fontSize: 12,
        marginBottom: 3,
        marginTop: 10
    },
    error: {
        color: 'red',
        marginTop: 20,
        textAlign: 'center',

    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper(Password))