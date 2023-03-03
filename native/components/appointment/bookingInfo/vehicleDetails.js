import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment'


const VehicleDetails = ({ appointment }) => {



    return <View style={styles.detailTxtContainer}>
        <View style={styles.txtContainer}>
            <View><Text style={styles.detText}>Appt ID</Text></View>
            <Text>{appointment.appointment_Id}</Text>
        </View>

        {/*  */}
        {

            (appointment.orderId && appointment.orderId.length > 0) ?
                <View style={styles.txtContainer}>
                    <View><Text style={styles.detText}>Order ID</Text></View>
                    <Text>{appointment.orderId}</Text>
                </View> : null

        }
        <View style={styles.txtContainer}>
            <Text style={styles.detText}>When:</Text>
            <Text>{moment(appointment.date).format("h:mm a on dddd, MM/DD/YYYY")}</Text>
        </View>
        <View style={styles.txtContainer}>
            <Text style={styles.detText}>Where:</Text>
            <View>
                <Text >{appointment.warehouse_id.company_name}</Text>
                <Text>{appointment.warehouse_id.address}</Text>
                <Text>{appointment.warehouse_id.city}, {appointment.warehouse_id.state} {appointment.warehouse_id.zip_code}</Text>
                <Text>{appointment.warehouse_id.number}</Text>
            </View>
        </View>
        <View style={styles.txtContainer}>
            <Text style={styles.detText}>Vehicles:</Text>
            <View style={styles.detailContainer}>

                {appointment.vehicleDetail?.map((vehicle, index) =>
                    <View key={index}>
                        <Text>{vehicle.yearMakeModel}</Text>
                        <Text>{vehicle.vinNumber}</Text>

                    </View>
                )}

            </View>

        </View>
    </View>
}
export default VehicleDetails

const styles = StyleSheet.create({
    txtContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20
    },
    detailContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    QRImg: {
        width: 180,
        height: 180
    },
    container: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 10,
        maxWidth: 384,
    },
    scanText: {
        marginBottom: 4,
        lineHeight: 24,
        fontSize: 16
    },
    img: {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
    },
    detailTxtContainer: {
        paddingTop: 48,

    },
    detText: {
        width: 80,
        lineHeight: 24,
        fontSize: 16,
        fontWeight: 'bold'
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonTxt: {
        color: '#800'
    }

})