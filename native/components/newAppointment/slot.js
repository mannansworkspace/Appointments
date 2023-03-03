import React from "react";
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native'
import moment from 'moment'

const Slot = ({ item, onPress}) => {

    return (
        <View style={{ alignItems: 'center' }}>
            <TouchableHighlight underlayColor='none' onPress={() => onPress(item.date) } style={ styles.slot }>
                <Text style={styles.text}>{moment(item.date).format('hh:mm A')}</Text>
            </TouchableHighlight>
        </View>
    );
}

export default Slot;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    slot: {
        padding: 20,
        marginVertical: 10,
        width: '70%',
        alignItems: 'center',
        backgroundColor: "#1a56db",
        color: 'white'
    },
    text : {
        color : 'white',
        fontWeight: 'bold'
    }
})