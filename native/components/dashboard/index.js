import React, { useEffect, useState, useMemo ,useCallback} from 'react';
import { connect } from 'react-redux';
import { Text, View, FlatList, StyleSheet, TextInput, TouchableHighlight } from "react-native";
import ContentBox from './contentBox';
import Spinner from '../common/Spinner';
import { SearchIcon } from "react-native-heroicons/outline";
import { getAllApoointments ,getAllApoointmentsForDebounce} from '../../store/actions/appointment';
import { debounce } from '../../utils/debounce';
import { useDispatch } from 'react-redux';

const AllAppointments = ({ navigation, getAllApoointments, appointments, isLoading }) => {
const [seacrh, setSearch] = useState('');
const dispatch = useDispatch()
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          getAllApoointments();
        });
    
        return () => {
            unsubscribe();
        }
    }, [navigation]);

    const debouncedFunction = useMemo(() =>
        debounce((value) => dispatch(getAllApoointmentsForDebounce(value)), 1000),
        []
    )

  
    const onChangeText = (value) => {
        debouncedFunction(value)
        setSearch(value);
    }

    

    return (
        <View style={styles.screenContainer}>
            {isLoading ?
                <Spinner />
                :
                <>
                    <View style={styles.inputContainer}>
                        <SearchIcon color="black" size={20} style={styles.icon} />
                        <View>
                            <TextInput
                                style={styles.input}
                                onChangeText={onChangeText}
                                value={seacrh}
                                placeholder='Search by vin#, lot#, order id#, or appt id#'
                            />
                        </View>
                    </View>

                    <View>
                        <Text style={{ paddingHorizontal: 12, fontWeight: 'bold' }}>Appointments</Text>
                    </View>

                    {appointments.length ?
                        <FlatList
                            data={appointments}
                            renderItem={(appointment) => <TouchableHighlight
                                onPress={() => navigation.navigate('AppointmentDetail', { id: appointment.item._id }) }
                                underlayColor='none'
                            >
                                <ContentBox appointment={appointment} id={appointment.item._id} />
                            </TouchableHighlight>
                            }
                            keyExtractor={(item, index) => index.toString()}
                        />
                        :
                        <Text style={{ textAlign: 'center' }}>There are no Active orders!</Text>
                    }
                </>

            }
        </View>
    );
}

const mapStateToProps = state => ({
    appointments: state.appointmentReducer.appointments,
    isLoading: state.pageReducer.loading
});

export default connect(mapStateToProps, { getAllApoointments })(AllAppointments);

const styles = StyleSheet.create({
    screenContainer : {
        backgroundColor: '#f7fafc', 
        flex: 1
    },
    input: {
        width: '100%',
        height: 37,
        marginVertical: 12,
        paddingVertical: 10,
        paddingLeft: 40,
        borderWidth: 1,
        borderColor: '#d2d6dc',
        backgroundColor: '#fff',
    },
    inputContainer: {
        position: 'relative',
        display: 'flex',
        marginHorizontal: 12,
        flexDirection: 'row',
    },
    icon: {
        color : '#BDBDBD',
        position: 'absolute',
        zIndex: 10,
        marginTop: 20,
        left: 10
    }
});