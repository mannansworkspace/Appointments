import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import moment from 'moment'


const DeliveredView = ({ appointment }) => {




    return (
        <ScrollView>
            <View style={{ paddingVertical: 25, paddingHorizontal: 15, backgroundColor: 'white' }}>
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'semi-bold', }}>
                        You Successfully checked out at :
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: 'semi-bold', }}>
                        {moment(appointment.check_out_time).format("h:mm a on dddd, MM/DD/YYYY")}
                    </Text>
                </View>

                <View>

                    <Text style={{ fontSize: 16, fontWeight: '400' }}>
                        Appointment with {appointment.warehouse_id.company_name}
                    </Text>

                    <Text style={{ color: '#424957', fontSize: 18, fontWeight: '100', marginBottom: 30 }}>
                            
                        {moment(appointment.created_at).format("h:mm a on dddd, MM/DD/YYYY")}

                    </Text>

                    {
                        appointment.vehicleDetail.map((element, index) => {
                            return (
                                <Text style={{ color: '#424957', fontSize: 18, fontWeight: '100' }}>
                                    {element.yearMakeModel}
                                </Text>
                            )
                        })
                    }

                </View>
            </View>
        </ScrollView>
    )

}
export default DeliveredView