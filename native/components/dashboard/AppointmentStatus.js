import React from "react";
import {View, Text} from 'react-native';
import { CheckCircleIcon } from 'react-native-heroicons/solid';
import { CheckCircleIcon as CheckCircleIconOutLine } from 'react-native-heroicons/outline';

const AppointmentStatus = ({item}) => {

    let color = 'grey';
    let status = 'Unconfirmed';
    let Icon = CheckCircleIconOutLine;


    if(item.status && item.page > 2){
        Icon = CheckCircleIcon;
        if(item.status){
            if(item.page > 2 && !item.check_out){

                if(item.check_in_time){

                    color = '#3B82F6';
                    status = 'Checked In';
                }
                else{
                    color = '#6B7280';
                    status = 'Confirmed'
                }
            }
            else{
                color = '#10B981';
                status = 'Delivered'
            }
        }
        else{
            color = '#6B7280';
            status = 'Confirmed'
        }
    }


    return(
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
            <Icon style={{ color: color, width: 20, height: 20 }} />
            <Text style={{ fontSize: 13, color: '#BDBDBD', marginTop: 3  }}> {status} </Text>
        </View>
    );
}

export default AppointmentStatus;