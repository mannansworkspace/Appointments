import * as React from 'react';
import { TouchableHighlight, View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native'
import { logoutUser } from '../store/actions/authActions'
import { connect } from 'react-redux';
import Dashboard from '../components/dashboard';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ navigation, logoutUser }) => {
  return (
    <>
      <Drawer.Navigator
        initialRouteName="DashboardScreen"
        drawerContent={props => {
          return (
            <DrawerContentScrollView {...props}>
              <View style={styles.iconContainer}>
                <Text style={styles.label}>
                  Push
                  <Text style={styles.label2}>Tow</Text>
                </Text>

              </View>

              <DrawerItemList {...props } />
              <DrawerItem label='Logout' onPress={() => {
                navigation.dispatch(DrawerActions.closeDrawer());
                logoutUser();
              }} />
            </DrawerContentScrollView>
          )
        }}>

        <Drawer.Screen
          name="DashboardScreen"
          component={Dashboard}
          options={{
            title: "Dashboard",
            headerTitle: '',
            headerRight: () => (
              <TouchableHighlight
                activeOpacity={0.6}
                underlayColor="none"
                onPress={() => navigation.navigate('NewAppointment')}
                style={styles.buttonStyle}
              >
                <View><Text style={styles.buttonText}>Make new appt</Text></View>
              </TouchableHighlight>
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(logoutUser())
  };
}

export default connect(null, mapDispatchToProps)(DrawerNavigator);

const styles = StyleSheet.create({
  buttonStyle: {
    marginRight: 10,
    backgroundColor: '#294dd1',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    // marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  iconContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#014a80',
    fontWeight: 'bold',
    marginBottom: 0,
    fontStyle: 'italic',
    fontSize: 22
  },
  label2: {
    paddingLeft: 10,
    color: '#00aeef',
    fontWeight: 'bold',
    marginBottom: 0,
    fontStyle: 'normal',
    fontSize: 22
  },
})