import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableHighlight } from 'react-native';
import { connect } from 'react-redux';
import { Form, TextValidator } from 'react-native-validator-form';
import { Picker } from 'react-native-picker-dropdown'
import { SET_DRIVER } from '../../../store/actions/types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Wrapper from '../../HOC/wrapper';

const CompanyInformation = ({ navigation, saveCompany }) => {


    let formRef = useRef(null);
    const errorStyle = { text: { color: 'red' }, }

    const [companyData, setCompanyData] = useState({
        companyName: '',
        street: '',
        city: '',
        state: 'AL',
        zip: ''
    })

    const { companyName, street, state, city, zip } = companyData;

    const onSubmit = () => {

        saveCompany(companyData);
        navigation.push('YourInformation');
    }

    const handleSubmit = () => {

        formRef.submit();
    }

    const onChangeHandler = (name, value) => {
        setCompanyData({
            ...companyData,
            [name]: value
        })
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <KeyboardAwareScrollView
                extraHeight={100}
                bounces = {false}
            >
                    <View style={styles.borderBlock}>
                        <Form
                            ref={ref => formRef = ref}
                            onSubmit={onSubmit}
                        >
                            <View style={{ height: '100%' }}>
                                <ScrollView
                                    bounces = {false}
                                >
                                    <Text style={styles.title} >Company Information</Text>
                                    <Text >Company Name</Text>

                                    <TextValidator
                                        onChangeText={(companyName) => onChangeHandler('companyName', companyName)}
                                        value={companyName}
                                        style={styles.inputField}
                                        validators={['required']}
                                        errorStyle={errorStyle}
                                        type="text"
                                        errorMessages={['This field is required']}
                                    />


                                    <Text style={styles.label}>Street Address</Text>

                                    <TextValidator
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                        value={street}
                                        onChangeText={(street) => onChangeHandler('street', street)}
                                        style={styles.inputField}
                                        errorStyle={errorStyle}
                                    />

                                    <Text style={styles.label}>City</Text>
                                    <TextValidator
                                        validators={['required']}
                                        errorMessages={['This field is required']}
                                        value={city}
                                        onChangeText={(city) => onChangeHandler('city', city)}
                                        style={[styles.inputField, { width: '70%' }]}
                                        errorStyle={errorStyle}
                                    />

                                    <View style={{ width: '80%', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20 }}>
                                        <View style={{ width: '47%' }}>
                                            <Text>State</Text>

                                            <Picker
                                                selectedValue={state}
                                                style={[styles.inputField, { paddingVertical: 0 }]}
                                                onValueChange={(state) => onChangeHandler('state', state)}
                                            >
                                                {states.map(item => (
                                                    <Picker.Item key={item.name} label={item.name} value={item.name} />
                                                ))}

                                            </Picker>

                                        </View>

                                        <View style={{ width: '50%' }}>
                                            <Text>Zip</Text>
                                            <TextValidator
                                                keyboardType="number-pad"
                                                validators={['minStringLength:5', 'maxStringLength:5']}
                                                errorMessages={['Zip code must be 5 digit']}
                                                value={zip}
                                                onChangeText={(zip) => onChangeHandler('zip', zip)}
                                                style={styles.inputField}
                                                errorStyle={errorStyle}
                                                maxLength={5}
                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                        </Form>
                    </View>
                 
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
            </View>

    );
}

const mapDispatchToProps = dispatch => {
    return {
        saveCompany: (companyData) => dispatch({ type: SET_DRIVER, payload: companyData })
    };
}

export default connect(null, mapDispatchToProps)(Wrapper(CompanyInformation));

const styles = StyleSheet.create({
    btnWrapper: {
        width: '100%',
        bottom: 20,
        alignItems: 'center',
    },
    title: {
        color: '#444243',
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 25,
    },
    label: {
        marginTop: 20
    },
    inputField: {
        display: 'flex',
        width: '100%',
        height: 40,
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 14,
        color: 'black',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',

        borderRadius: 0,
    },
    borderBlock: {
        marginTop: 40,
        paddingHorizontal: 30,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#187fd5',
        paddingVertical: 12,
        paddingHorizontal: 100,
    }

});

const states = [{
    name: 'AL'
}, {
    name: 'AK'
}, {
    name: 'AS'
}, {
    name: 'AZ'
}, {
    name: 'AR'
}, {
    name: 'CA'
}, {
    name: 'CO'
}, {
    name: 'CT'
}, {
    name: 'DE'
}, {
    name: 'DC'
}, {
    name: 'FM'
}, {
    name: 'FL'
}, {
    name: 'GA'
}, {
    name: 'GU'
}, {
    name: 'HI'
}, {
    name: 'ID'
}, {
    name: 'IL'
}, {
    name: 'IN'
}, {
    name: 'IA'
}, {
    name: 'KS'
}, {
    name: 'KY'
}, {
    name: 'LA'
}, {
    name: 'ME'
}, {
    name: 'MH'
}, {
    name: 'MD'
}, {
    name: 'MA'
}, {
    name: 'MI'
}, {
    name: 'MN'
}, {
    name: 'MS'
}, {
    name: 'MO'
}, {
    name: 'MT'
}, {
    name: 'NE'
}, {
    name: 'NV'
}, {
    name: 'NH'
}, {
    name: 'NJ'
}, {
    name: 'NM'
}, {
    name: 'NY'
}, {
    name: 'NC'
}, {
    name: 'ND'
}, {
    name: 'MP'
}, {
    name: 'OH'
}, {
    name: 'OK'
}, {
    name: 'OR'
}, {
    name: 'PW'
}, {
    name: 'PA'
}, {
    name: 'PR'
}, {
    name: 'RI'
}, {
    name: 'SC'
}, {
    name: 'SD'
}, {
    name: 'TN'
}, {
    name: 'TX'
}, {
    name: 'UT'
}, {
    name: 'VA'
}, {
    name: 'VI'
}, {
    name: 'VT'
}, {
    name: 'WA'
}, {
    name: 'WI'
}, {
    name: 'WV'
}, {
    name: 'WY'
}];
