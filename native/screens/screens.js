import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { connect } from 'react-redux'
import DrawerNavigator from "./drawerScreens";
import AuthNavigator from "./authScreens";
import AppointmentDetail from "../components/appointment";
import NewAppointment from "../components/newAppointment";
import AvailableSlots from "../components/newAppointment/availabaleSlots";

const Stack = createStackNavigator();

const Screens = ({ isAuthenticated }) => {

  return (
    <Stack.Navigator>
      {
        !isAuthenticated ? (
          <Stack.Screen
            name="AuthNavigator"
            component={AuthNavigator}
            options={{
              header: () => null
            }}
          />
        )

          :
          <>
            <Stack.Screen
              name="Dashboard"
              component={DrawerNavigator}
              options={{
                header: () => null
              }}
            />

            <Stack.Screen
                name="AppointmentDetail"
                options={{
                  headerTitle:()=>null
                }}
                component={AppointmentDetail}
              />

              <Stack.Screen
                name="NewAppointment"
                options={{
                  headerTitle: () => null
                }}
                component={NewAppointment}
              />

              <Stack.Screen
                name="AvailableSlots"
                options={{
                  headerTitle: () => null
                }}
                component={AvailableSlots}
              />
          </>

      }
    </Stack.Navigator>
  );
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, null)(Screens);