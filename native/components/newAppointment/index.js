import React, { useEffect, useState, Fragment, useMemo } from 'react';
import { Keyboard, View, Text, StyleSheet, TouchableHighlight, TextInput, FlatList, ScrollView, Dimensions } from 'react-native';
import { Picker } from 'react-native-picker-dropdown';
import DateInput from './dateInput';
import { getWarehouses, getWarehouseDetails } from '../../store/actions/appointment';
import { connect } from 'react-redux';
import AvailabaleSlots from './availabaleSlots';
import { ChevronDownIcon } from 'react-native-heroicons/solid';
import Wrapper from '../HOC/wrapper';
import { searchCustomerAction, clearCustomerList } from '../../store/actions/customersAction'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const NewAppointment = ({ navigation, getWarehouses, getWarehouseDetails, appointmentState, customerList, searchCustomerAction, clearCustomerList }) => {
    const {
        bookedAppointment,
        warehouses,
        perDayVehiclesLimit,
        warehouseVehiclesLimit
    } = appointmentState;



    const [warehouse, setWarehouse] = useState(null);
    const [date, setDate] = useState(null);
    const [numberOfCar, setNumberOfCar] = useState('');
    const [showWarehouses, setShowWarehouses] = useState(false);
    const [customerName, setCustomerName] = useState('')
    const [customerCarlimit, setCustomerCarLimit] = useState(9)
    const [customer, setCustomer] = useState(null)
    const height = Dimensions.get('window').height / 3
    const [limitError, setLimitError] = useState({
        error: false,
        message: ''
    })


    useEffect(() => {
        getWarehouses();
        clearCustomerList()
    }, [])

    const pickupDate = (date) => {
        setDate(date)
        getWarehouseDetails(warehouse.warehouse_subdomain_name, date);
    }

    const onSelectWarehouse = (value) => {
        setWarehouse(value);
        setShowWarehouses(false);
    }

    const onChangePickerValue = (numberOfCar) => {
        setNumberOfCar(numberOfCar);
    }
    const cancelWarehouse = () => {
        setWarehouse(null)
        setShowWarehouses(true)
        setDate(null)
        setNumberOfCar('')
    }


    const shipperOnchange = (value) => {
        if (customer) {
            setCustomer(null)
            setLimitError({
                error: false,
                message: ''
            })
            setCustomerCarLimit(null)
            setNumberOfCar('')
        }
        searchCustomer(value)
        setCustomerName(value)
    }



    const searchCustomer = value => {
        const data = {
            name: value,
            id: warehouse?._id
        }
        searchCustomerAction(data);
    }

    const selectCustomer = (customer) => {
        Keyboard.dismiss()

        setCustomerName(
            customer.customerName
        )
        //check if customer has limit?? 
        if (customer.customerVehicleLimit) {
            const customerVehicleLimit = parseInt(customer.customerVehicleLimit)
            if (customerVehicleLimit) {
                const { bookedAppointment } = appointmentState
                // finding the already booked appointments with recieved customer
                const limit = bookedAppointment.filter((appointment) => appointment.customerId._id === customer._id)?.reduce((prev, current) => prev + parseInt(current.car), 0)
                // if limit eceeded error has to be set 
                console.log("The limit is : ", limit)
                if (limit >= customerVehicleLimit) {
                    setLimitError({
                        error: true,
                        message: 'Customer Limit has been exceeded for today'
                    })
                } else {
                    // if customer  has limit greater than equal to 10 then set custome rcar limit to 10
                    if (customerVehicleLimit >= 9) {
                        setCustomerCarLimit(9)
                    } else {
                        // finally set to limit - vehicle limit
                        setCustomerCarLimit(customerVehicleLimit - limit)
                    }
                }
            } else {
                setLimitError({
                    error: true,
                    message: 'Customer has the limit of 0 vehicles'
                })
            }
        }
        setCustomer({ ...customer })
        clearCustomerList();
    }

    const carOptionsListCreation = useMemo(() => {

        const vehicleLimit = perDayVehiclesLimit ? { ...perDayVehiclesLimit, status: true } : warehouseVehiclesLimit
        if (vehicleLimit) {

            const { vehiclesPerDay, vehiclesPerSlot, status } = vehicleLimit

            const totalVehicles = bookedAppointment.reduce((a, b) => a + parseInt(b.car), 0);

            return status ? Math.min(vehiclesPerSlot, vehiclesPerDay - totalVehicles, customerCarlimit) : customerCarlimit;
        }

    }, [bookedAppointment,
        warehouse,
        customer,
        perDayVehiclesLimit,
        warehouseVehiclesLimit])



    return (

        <KeyboardAwareScrollView
            style={styles.container}
            bounces={false}
            extraScrollHeight = {height}            
        >
            <TouchableHighlight onPress={() => clearCustomerList()} underlayColor={'none'}>
                <Fragment>
                    <ScrollView >
                        <View style={{ marginTop: 20 }}>
                            <Text style={styles.newApptTxt}>New Appointment</Text>
                        </View>


                        <View style={styles.pickerContainer}>
                            <View style={styles.dropDownHeader}>
                                {warehouse ?
                                    <TouchableHighlight
                                        underlayColor='white'
                                        onPress={cancelWarehouse}
                                    >
                                        <View style={styles.selectedWareHouse}>
                                            <Text>{`${warehouse.company_name}`}</Text>
                                            <Text>{`${warehouse.address} ${warehouse.city} ${warehouse.state} ${warehouse.zip_code}`}</Text>
                                        </View>
                                    </TouchableHighlight>
                                    :
                                    <TouchableHighlight
                                        underlayColor='white'
                                        onPress={() => setShowWarehouses(!showWarehouses)}
                                    >
                                        <View style={{ position: 'relative' }}>
                                            <Text style={styles.dropDownText} >Where Are You Delivering?</Text>
                                            <ChevronDownIcon
                                                style={styles.chevronIcon}
                                            />
                                        </View>
                                    </TouchableHighlight>

                                }
                            </View>
                        </View>
                        {showWarehouses &&
                            // <Animated.View style={animatedStyles} >
                            <View style={styles.dropDownBody}>
                                {warehouses?.filter(item => item.allow_online_appointments).map((warehouse, index) => {
                                    return (
                                        <View key={index} style={{ paddingHorizontal: 10, paddingVertical: 6, }}>
                                            <TouchableHighlight
                                                underlayColor='white'
                                                style={{}}
                                                onPress={() => onSelectWarehouse(warehouse)}
                                            >
                                                <View >
                                                    <Text style={styles.textColor}>{`${warehouse.company_name}`}</Text>
                                                    <Text style={styles.textColor} >{`${warehouse.address} ${warehouse.city} ${warehouse.state} ${warehouse.zip_code}`}</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    );
                                })}
                            </View>
                            // </Aniated.View>
                        }


                        {warehouse && (
                            <View >
                                <View style={{ marginTop: 30 }}><Text>Pick a date & time:</Text></View>
                                <View>
                                    <DateInput
                                        date={date}
                                        setDate={pickupDate}
                                        ApptStartingFrom={warehouse.ApptStartingFrom}
                                        onlineApptDays={warehouse.onlineApptDays}
                                    />
                                </View>
                            </View>)
                        }

                        {date && <>
                            {
                                !!carOptionsListCreation ?
                                    <View style={{ paddingVertical: 10, marginTop: 5 }} >
                                        <ScrollView>
                                            <Text >Shipper / Broker  <Text style={{ fontSize: 13 }} >(as per dispatch sheet)</Text> </Text>

                                            <TextInput
                                                value={customerName}
                                                onChangeText={(value) => shipperOnchange(value)}
                                                style={[styles.input, { width: '65%' }]}
                                            />
                                        </ScrollView>
                                    </View>
                                    : <Text style={{ color: 'red' }} >Warehouse Vehicle limit for today has been reached</Text>
                            }

                        </>

                        }
                        {
                            !!customerList.length &&
                            <View style={styles.dropDownBody}>
                                <FlatList
                                    data={customerList}
                                    renderItem={({ item }) => <TouchableHighlight
                                        onPress={() => selectCustomer(item)}
                                        // onPress={()=> console.log(" Select Event fired") }
                                        underlayColor='white'
                                    >
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 6, }}>
                                            <Text style={{
                                                color: '#374151', fontWeight: '500', fontSize: 14
                                            }}>
                                                {item.customerName}
                                            </Text>
                                        </View>
                                    </TouchableHighlight>
                                    }
                                />
                            </View>
                        }


                        {
                            limitError.error ? <Text style={{ color: 'red' }} >{limitError.message}</Text> :
                                !!customerName.length && (
                                    <View style={{ marginTop: 30 }}>
                                        <Text>How many cars are you delivering?</Text>
                                        <Picker
                                            selectedValue={numberOfCar}
                                            style={{ paddingVertical: 0 }}
                                            onValueChange={(numberOfCar) => onChangePickerValue(numberOfCar)}
                                            style={{ padding: 10, borderWidth: 0.4, backgroundColor: 'white', borderRadius: 6, marginTop: 10, width: '50%' }}
                                        >
                                            {
                                                Array(carOptionsListCreation + 1).fill(0).map((option, i) => (
                                                    <Picker.Item key={i} label={i === 0 ? '' : `${i}`} value={`${i}`} />
                                                ))
                                            }

                                        </Picker>
                                    </View>)

                        }
                    </ScrollView>

                    {appointmentState.warehouse && (numberOfCar !== '' && +numberOfCar !== 0) ? (

                        <AvailabaleSlots
                            date={date}
                            numberOfCar={numberOfCar}
                            navigation={navigation}
                            customerName={customerName}
                        />

                    ) : null
                    }
                </Fragment>
            </TouchableHighlight>
        </KeyboardAwareScrollView >

    );
}

const mapStateToProps = state => ({
    appointment: state.appointmentReducer.appointment,
    appointmentState: state.appointmentReducer,
    customerList: state.customers.customersList,

})

export default connect(mapStateToProps, { getWarehouses, getWarehouseDetails, searchCustomerAction, clearCustomerList })(Wrapper(NewAppointment));

const styles = StyleSheet.create({
    input: {
        height: 40,
        padding: 10,
        borderWidth: 0.5,
        backgroundColor: 'white',
        // width: '100%',
        borderRadius: 6,
    },
    selectedWareHouse: {
        height: 35
    },
    dropDownText: {
        color: '#374151',
    },
    chevronIcon: {
        color: '#374151',
        position: 'absolute',
        right: 0
    },
    textColor: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 14
    },
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
        elevation: 8,
    },
    dropDownHeader: {
        backgroundColor: 'white',
        textAlign: 'left',
        position: 'relative',
        borderWidth: 1,
        padding: 7,
        borderColor: '#d1d5db',
        borderRadius: 8,
        shadowOffset: {
            width: -5, height: 4
        },
        // shadow
        shadowColor: '#747373',
        shadowOpacity: 0.2,
    }
    ,
    nextBtnTxt: {
        alignItems: 'center'
    },
    nextBtn: {
        backgroundColor: '#187fd5',
        width: '35%',
        // paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 6
    },
    carInput: {
        height: 40,
        backgroundColor: 'white',
        borderWidth: 0.5,
        width: '55%',
        marginTop: 10,
        borderRadius: 6,
        paddingHorizontal: 5
    },
    container: {
        flex: 1,
        paddingHorizontal: 10
    },
    newApptTxt: {
        fontWeight: 'bold'
    },
    pickerContainer: {
        width: '80%',
        // borderWidth: 0.5,
        // borderRadius: 8,
        // backgroundColor: 'white',
        marginTop: 20
    }
})