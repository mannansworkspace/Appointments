import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableHighlight, Keyboard } from 'react-native';
// import { RadioButton } from 'react-native-paper';
// import RadioButtonRN from 'radio-buttons-react-native-expo';
import SuccessModal from './successModal';
import { setCarEXistError } from '../../../store/actions/appointment'
import { connect, useDispatch } from 'react-redux';
import moment from 'moment'
import { fetchCarInformation, resetCarInformation, completeAppointment } from '../../../store/actions/appointment';
import VehicleModal from './VehicleModal';
import Spinner from '../../common/Spinner';
import VehicleDetailForm from './vehicleDetailModel';
import { isAlphanumeric } from '../../../utils/alphaNumericValidator';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button'
import { searchCustomerAction, clearCustomerList } from '../../../store/actions/customersAction'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CarExistModal from './carExistModal';
import { isNumber } from 'react-native-validator-form/lib/ValidationRules';

const BookingInfo = ({ isLoading, navigation, appointment, resetCarInformation, displayInform, isCarExist }) => {

    const [type, setType] = useState('lot');
    const [isSuccess, setIsSuccess] = useState(false);
    const [vehicleDetails, setVehicleDetails] = useState([])
    const [loadingIndexs, setLoadingIndes] = useState({})
    const [vehicleDetailForm, setVehicleDetailForm] = useState(null)
    const [orderId, orderIdChanger] = useState('')
    const [editAble, setEditAble] = useState({})
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('')
    const page = appointment?.page
    useEffect(() => {
        const listener = navigation.addListener('blur', beforeRemoveEventHandler)
        return () => {
            listener()
            dispatch(setCarEXistError(false))
        }
    }, [])

    useEffect(() => {
        let driverCarValue = []
        if (appointment && appointment.car) {
            Array(parseInt(appointment.car)).fill().map((item, i) => {
                return driverCarValue.push({ value: '', status: false })
            })

            setVehicleDetails(driverCarValue)
        }

        appointment && isNumber(page) && page > 2 && setIsSuccess(true) 
    }, [appointment])

    const beforeRemoveEventHandler = (event) => {
        navigation.navigate('Dashboard')
    }

    const onChangeHandler = (value, key) => {

        vehicleDetails[key].value = value.toUpperCase();
        setVehicleDetails([...vehicleDetails])
    }

    const checkCar = async (value, key) => {
        Keyboard.dismiss()
        if (value) {
            //chekc if vehicle exitsts already in the details??
            const vehicle = vehicleDetails.find((vehicle, index) => (vehicle.lotNo?.trim() === value || vehicle.vinNumber?.trim() === value) && index != key)
            if (vehicle) {
                setErrorMessage('You have already entered this vin/lot number please choose other!')
                dispatch(setCarEXistError(true))
                return
            }

            setLoadingIndes({ ...loadingIndexs, [key]: true });
            await dispatch(fetchCarInformation(value, key, type))
            setLoadingIndes({ ...loadingIndexs, [key]: false });
        }
        else {
            alert('please Enter Vin Number First')
        }
    }

    const saveModelValue = (displayInform) => {

        const { key } = displayInform
        vehicleDetails[key] = {
            ...displayInform,
            status: true,
            value: type === 'vin' ? displayInform.vinNumber : displayInform.lotNo
        }
        setEditAble({
            ...editAble,
            [key]: false
        })

        setVehicleDetails([...vehicleDetails])

        resetCarInformation()
        setVehicleDetailForm(null)
    }

    const isConfirmDisabled = () => {
        return !!vehicleDetails.filter(item => !item.status).length
    }

    const onSubmit = async () => {
        const appointmentTimeSlot = appointment.appointmentTimeSlot
        const warehouseId = appointment.warehouse_id._id
        const data = {
            ...appointment,
            warehouse_id:warehouseId,
            id: appointment._id,
            vehicleDetail: vehicleDetails,
            orderId: orderId,
            appointmentTimeSlot: appointmentTimeSlot ? appointmentTimeSlot : appointment.time_slot
        }
        dispatch(completeAppointment(data))
    }
    const orderIdOnChange = (value) => {

        if (isAlphanumeric(value)) {
            orderIdChanger(value)
        }
    }

    const onEditClick = (key) => {
        const newVehicleDetails = [...vehicleDetails]

        newVehicleDetails[key].status = false
        setVehicleDetails(newVehicleDetails)
        setEditAble({
            ...editAble,
            [key]: true
        })

    }

    const onCancelVehicleModel = (key) => {
        resetCarInformation()
        setVehicleDetailForm(key)
        setEditAble({
            ...editAble,
            [key]: true
        })

    }
    return (
        <View style={styles.container}>
            {isLoading ?
                <Spinner />
                :
                <>
                    <KeyboardAwareScrollView
                        extraHeight={100}
                        bounces={false}
                    >
                        <ScrollView>

                            <VehicleModal
                                onCancel={onCancelVehicleModel}
                                onSave={saveModelValue}
                            />

                            <VehicleDetailForm
                                modalVisible={vehicleDetailForm}
                                onCancel={() => setVehicleDetailForm(null)}
                                onSave={saveModelValue}
                            />
                            {
                                isCarExist && <CarExistModal
                                    message={errorMessage}
                                />

                            }

                            <SuccessModal
                                modalVisible={isSuccess}
                                navigation={navigation}
                            />


                            <Text style={styles.firstTxt}>Appointment with {appointment.warehouse_id.company_name }</Text>
                            <Text style={styles.dateTime}>{moment(appointment.date).format("h:mm a on MM/DD/YYYY")}</Text>

                            <Text style={styles.confirmDetail}>Please confirm vehicle details</Text>
                            <View style={{ marginTop: 20, marginLeft: 10 }}>

                                <Text >Order Id </Text>

                                <TextInput
                                    value={orderId}
                                    onChangeText={(value) => orderIdOnChange(value)}
                                    style={[styles.input, { width: '65%' }]}
                                />
                            </View>

                            <View style={{ marginTop: 20, marginLeft: 10 }}>

                            </View>

                            <RadioGroup
                                selectedIndex={0}
                                thickness={1}
                                color='grey'
                                activeColor='#2563eb'
                                onSelect={(index, value) => setType(value)}
                                style={styles.radioBtnContainer}
                            >
                                <RadioButton value={'lot'} >
                                    <Text>Use Copart or IAAI lot#</Text>
                                </RadioButton>
                                <RadioButton value={'vin'}>
                                    <Text>Use full vin#</Text>
                                </RadioButton>
                            </RadioGroup>

                            {vehicleDetails.map((item, key) => (
                                <React.Fragment key={key}>
                                    <View style={[styles.centerView, { marginTop: 20, marginLeft: 10 }]}>
                                        <Text>{type === 'vin' ? 'Full vin' : 'Lot'}# for {
                                            key === 0 ? '1st' : key === 1 ? '2nd' : key === 2 ? '3rd' : key + 1 + 'th'
                                        } vehicle:</Text>
                                        {item.status &&
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={styles.editLink} onPress={() => onEditClick(key)}>Edit:</Text>
                                            </View>
                                        }

                                    </View>

                                    <View style={{ display: 'flex', alignItems: 'center', marginTop: 5 }}>
                                        <View style={[styles.inputAndBtn, { width: '95%' }]}>
                                            <View style={{ width: '65%' }}>
                                                <TextInput
                                                    editable={editAble[key]}
                                                    value={item.value}
                                                    onChangeText={(value) => onChangeHandler(value, key)}
                                                    style={styles.input}
                                                    maxLength={type === 'vin' ? 17 : 30}
                                                    onPress={() => console.log(" taped ")}
                                                />
                                            </View>

                                            <View style={{ width: '30%' }}>
                                                {item.status ?
                                                    <TouchableHighlight
                                                        disabled={true}
                                                        style={[styles.statusBtn, { backgroundColor: '#417958' }]}
                                                    >
                                                        <Text style={styles.savedTxt}>SAVED</Text>

                                                    </TouchableHighlight>
                                                    :
                                                    loadingIndexs[key] ?
                                                        <TouchableHighlight
                                                            onPress={() => { }}
                                                            style={[styles.statusBtn, { backgroundColor: '#187fd5' }]}
                                                        >
                                                            <Text style={styles.savedTxt}>Processing</Text>

                                                        </TouchableHighlight>
                                                        :
                                                        <TouchableHighlight
                                                            onPress={() => checkCar(item.value, key)}
                                                            style={[styles.statusBtn, { backgroundColor: '#187fd5' }]}
                                                        >
                                                            <Text style={styles.savedTxt}>Check</Text>
                                                        </TouchableHighlight>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </React.Fragment>
                            ))}
                        </ScrollView>
                    </KeyboardAwareScrollView>
                    <View style={styles.confirmBtnContainer}>
                        <TouchableHighlight
                            onPress={onSubmit}
                            style={isConfirmDisabled() ? styles.disabledBtn : styles.confirmBtn}
                            disabled={isConfirmDisabled()}
                        >
                            <View style={styles.savedContainer}>
                                <Text style={styles.savedTxt}>CONFIRM</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </>
            }
        </View>


    );
}

const mapStateToProps = state => ({
    appointment: state.appointmentReducer.appointment,
    isCarExist: state.appointmentReducer.carExists,
    isLoading: state.pageReducer.loading,
    displayInform: state.appointmentReducer.displayInform,
});


export default connect(mapStateToProps, { fetchCarInformation, completeAppointment, resetCarInformation, searchCustomerAction, clearCustomerList, setCarEXistError })(BookingInfo);


const styles = StyleSheet.create({

    dropDownBody: {
        marginTop: 5,
        borderRadius: 6,
        padding: 7,
        borderRadius: 8,
        width: '80%',
        backgroundColor: 'white',
        shadowColor: '#747373',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 8
    },

    centerView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    confirmBtnContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        position: 'absolute',
        bottom: 40
    },
    inputAndBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    radioBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    confirmDetail: {
        marginTop: 15,
        fontWeight: '600'
    },
    firstTxt: {
        fontWeight: 'bold'
    },
    editLink: {
        color: 'blue'
    },
    input: {
        height: 40,
        padding: 10,
        borderWidth: 0.5,
        backgroundColor: 'white',
        // width: '100%',
        borderRadius: 6,
    },
    statusBtn: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6,
        alignItems: 'center'
    },
    savedContainer: {
        alignItems: 'center'
    },
    savedTxt: {
        color: 'white'
    },
    confirmBtn: {
        backgroundColor: '#294dd1',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '40%',
        borderRadius: 6
    },
    disabledBtn: {
        backgroundColor: 'gray',
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: '40%',
        borderRadius: 6
    },
    dateTime: {
        color: '#A9A9A9',
        marginTop: 5
    },
    error: {
        color: 'red',
        textAlign: 'center'
    }
});