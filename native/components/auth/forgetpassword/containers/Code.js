import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableHighlight, Keyboard } from 'react-native';
import { recoveryCode, sendRecoverPasswordEmail } from '../../../../store/actions/authActions';
import { clearError } from '../../../../store/actions/pageActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Wrapper from '../../../HOC/wrapper';



const Code = (props) => {

    const [myState, myStateHandler] = useState({
        errors: [],
        boxes: ['', '', '', '']
    })

    
    const myRefs = [
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef()
    ]

    const onChange = (index, value) => {

        const regex = /[0-9]$/

        if (regex.test(value)) {

            const newArray = [...myState.boxes]

            newArray[index] = value;

            myStateHandler({
                boxes: [...newArray]
            })


            if ((index + 1) < myState.boxes.length) {
                myRefs[index + 1].current.focus();
            }
            else {
                Keyboard.dismiss()
            }

        }
    }

    const handleSubmit = () => {

        const data = {
            recoveryCode: myState.boxes.map(box => box).join(''),
            email: props.passwordRecovery.email
        }
        props.actions.recoveryCode(data, props.navigation)
    }

    const { boxes } = myState;


    return (
        <View style={[styles.borderBlock, styles.container]}>
            <React.Fragment>

                <View style={{ height: '100%' }}>
                    {!!props.errors && <Text style={styles.error}> {props.errors}</Text>}

                    <Text style={styles.title}>Enter the 4-digit code we sent to {/*{props.passwordRecovery.email}*/} </Text>

                    <Text style={styles.label} >Verification Code</Text>

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        {boxes.map((box, index) => (
                            <TextInput
                                style={styles.inputField}
                                keyboardType="numeric"
                                maxLength={1}
                                value={box}
                                onChangeText={(code) => onChange(index, code)}
                                key={index}
                                ref={myRefs[index]}
                            />
                        ))}
                    </View>


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

            </React.Fragment>

        </View>
    );
}

const mapStateToProps = state => ({
    passwordRecovery: state.newDriverReducer.passwordRecovery,
    errors: state.errorReducer.message
});


function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            recoveryCode,
            clearError,
            sendRecoverPasswordEmail,
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Wrapper(Code));



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
        width: 40,
        margin: 10,
        height: 34,
        paddingHorizontal: 15,
        paddingVertical: 6,
        fontSize: 14,
        color: '#555',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 0,
        marginBottom: 10
    },
    borderBlock: {
        paddingHorizontal: 30
    },
    label: {
        color: '#0e0e0e',
        fontSize: 12,
        marginBottom: 3
    },
    signUp: {
        color: '#1a7fd6',
        marginBottom: 20
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20
    }

});