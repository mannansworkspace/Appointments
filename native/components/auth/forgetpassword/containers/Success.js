import React from "react"; 
import { View , StyleSheet , SafeAreaView , Text, TouchableHighlight } from 'react-native';



const Success = (props) =>{


    return(
                <SafeAreaView style={ styles.successContainer}>
                    <View style={ styles.content , styles.padding} >

                    <Text style={{ fontWeight: 'bold' }}>Your password has been reset!</Text>
                    {/* onPress={() => props.navigation.push('Login') */}
                    <TouchableHighlight style={{ marginTop: 30 }}  >
                            <Text style={{ color: '#1a7fd6' }}onPress={() => props.navigation.push('Login')}>Go to Login</Text>
                        </TouchableHighlight>

                    </View>
            </SafeAreaView>
        )

}
export default Success

const styles = StyleSheet.create({
    content : {
        marginTop: 30
    },
    padding : {
        paddingHorizontal: 30
    },
    successContainer : {
        flex : 1,
        marginTop : '30%',
        marginLeft: '10%'
    }

});