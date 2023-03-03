import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, Keyboard } from 'react-native';
import { verifyPhone, signUp } from '../../../store/actions/authActions';
import { connect } from 'react-redux';
import Wrapper from '../../HOC/wrapper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Code = ({ signUp, newDriver, error, sid }) => {
    const [boxes, setBoxes] = useState(['', '', '', '']);

    const onSubmit = () => {

        const driver = {
            code: boxes.map(box => box).join(''),
            sid,
            ...newDriver
        }

        signUp(driver)
    }

    const myRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ]

    const onChange = (index, code) => {

        const regex = /[0-9]$/

        if (regex.test(code)) {
            let updatedBoxes = [...boxes];
            updatedBoxes[index] = code;


            if (code !== '') {

                if ((index + 1) < boxes.length) {
                    myRefs[index + 1].current.focus();
                }
                else {
                    Keyboard.dismiss()
                }
            }

            setBoxes(updatedBoxes);
        }
    }

    return (
        <View style={{ flex: 1, marginLeft: 10, marginTop: 30 }} >
            <View style={{ height: '100%' }}>
                <KeyboardAwareScrollView>

                    {!!error?.length ? <Text style={styles.error}> {error}</Text> : null}
                    <Text style={styles.title}>Enter the 4-digit code we sent to  to verify your number </Text>

                    <Text style={styles.label} >Verification Code</Text>

                    <View style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                        {boxes.map((box, index) => (
                            <TextInput
                                style={styles.inputField}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={box}
                                onChangeText={(code) => onChange(index, code)}
                                key={index}
                                ref={myRefs[index]}
                            />
                        ))}
                    </View>

                    <TouchableHighlight underlayColor='none' onPress={() => verifyPhone(newDriver.phoneNumber, newDriver.email)}  >
                        <Text style={styles.signUp}>Resend Code</Text>
                    </TouchableHighlight>
                    </KeyboardAwareScrollView>

                        <View style={styles.btnWrapper}>
                            <TouchableHighlight
                                underlayColor="none"
                                style={styles.button}
                                onPress={onSubmit}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continue</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
            </View>
            );
}

const mapStateToProps = state => {
    return {
                newDriver: state.newDriverReducer.newDriver,
            sid: state.newDriverReducer.sid,
            error: state.errorReducer.message
    };
}

            export default connect(mapStateToProps, {
                signUp
            })(Wrapper(Code));

            const styles = StyleSheet.create({
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
            signUp: {
                color: '#1a7fd6',
            marginBottom: 20
    },
            error: {
                color: 'red',
            textAlign: 'center',
            marginBottom: 20
    }

})