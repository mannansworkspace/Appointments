import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import moment from 'moment';
import { ChevronRightIcon } from 'react-native-heroicons/solid';

import AppointmentStatus from "./AppointmentStatus";


const ContentBox = ({ appointment }) => {
    const { item } = appointment;


    return (
        <View style={styles.bodyContent} >
            <View style={styles.contentBox} >
                <View style={styles.boxTop}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.price}>
                            {moment(item.date).format("h:mmA on ddd, MM/DD/YYYY")}
                        </Text>
                        <Text style={styles.available}>({item.car} vehicle)</Text>
                    </View>
                </View>
                <View style={styles.line}></View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
                    <View style={{ marginLeft: 2, display: 'flex', flexDirection: 'row' }}>
                        <Text style={styles.circles}>
                            &#x25CF;
                        </Text>

                        <View style={{ marginLeft: 13, marginTop: -4 }}>
                            <Text style={styles.lineHeader}>
                                {item.warehouse_id.company_name}
                            </Text>

                            <Text style={styles.lineDetails} >
                                {item.warehouse_id.address}, {item.warehouse_id.city} {item.warehouse_id.state}
                            </Text>
                            <Text style={styles.lineDetails} >
                                Tel: {item.warehouse_id.number}
                            </Text>
                        </View>
                    </View>
                    <ChevronRightIcon style={{ color: 'gray', marginTop: 2 }} />

                </View>

                <AppointmentStatus item={item} />

            </View>
        </View>
    )
}


export default ContentBox;

const styles = StyleSheet.create({
    bodyContent: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        fontFamily: 'Arial'
    },
    contentBox: {
        paddingVertical: 15,
        paddingHorizontal: 7,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d2d6dc',
        height: 'auto',
    },
    boxTop: {
        paddingBottom: 10
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#252f3f',
        paddingRight: 5
    },
    miles: {
        textAlign: 'right',
        fontSize: 20,
        fontWeight: 'bold',
        right: 5,
        color: '#046c4e',
        marginLeft: 'auto'
    },
    status: {
        borderRadius: 1000,
        color: '#fff',
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        fontSize: 16,
        fontWeight: '500'
    },
    available: {
        paddingTop: 5,
        fontSize: 15,
        color: '#BDBDBD'
    },
    line: {
        borderLeftWidth: 2,
        borderLeftColor: '#9fa6b2',
        padding: 16,
        left: 6,
        bottom: 7
    },
    cancel: {
        color: '#fff',
        backgroundColor: '#e02424',
        alignSelf: 'flex-start',
        padding: 5,
        marginTop: 10,
        fontSize: 16
    },
    lineHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4b5563',
    },
    lineDetails: {
        fontSize: 13,
        color: '#828282'
    },
    circles: {
        color: '#374151',
        fontSize: 12
    },
    msgCounter: {
        backgroundColor: 'red',
        width: 15,
        height: 15,
        paddingVertical: 0,
        borderRadius: 58,
        fontWeight: 'bold',
        zIndex: 99,
        position: 'absolute',
        color: 'white',
        left: 15,
    },
    counter: {
        color: 'white',
        textAlign: 'center',
        fontSize: 11,
    },
    mailIcon: {
        width: 24,
        height: 24,
    },
});
