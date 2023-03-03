import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../components/auth/login';
import CompanyInformation from "../components/auth/signUp/CompanyInformation";
import YourInformation from "../components/auth/signUp/YourInformation";
import Email from '../components/auth/forgetpassword/containers/Email';
import Code from '../components/auth/forgetpassword/containers/Code';
import Password from '../components/auth/forgetpassword/containers/Password';
import Success from '../components/auth/forgetpassword/containers/Success';
import code from '../components/auth/signUp/Code';
import Wrapper from '../components/HOC/wrapper';


const Stack = createStackNavigator();

const AuthScreens = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />

 
            <Stack.Screen 
                name = "Email"
                component = {Email}
                options  = {{
                    title : 'Email'
                }}
                
            />

                <Stack.Screen 
                    name = "code"
                    component = {Code}
                    options  = {{
                        title : 'Code'
                    }}
                />

                <Stack.Screen 
                    name = "password"
                    component = {Password}
                    options  = {{
                        title : 'New Password'
                    }}
                />

                <Stack.Screen 
                    name = "success"
                    component = {Success}
                    options  = {{
                        title : 'New Password'
                    }}
                />


                <Stack.Screen
                name="Signup"
                component={CompanyInformation}
                options={
                    {
                        title: 'Signup for appointments step (1/3)',
                        headerStyle: {
                            backgroundColor: '#324e73',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        },
                    }
                }
            />

            <Stack.Screen
                name="YourInformation"
                component={YourInformation}
                options={
                    {
                        title: 'Signup for appointments step (2/3)',
                        headerStyle: {
                            backgroundColor: '#324e73',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        },
                    }
                }
            />

            <Stack.Screen
                name="Code"
                component={code}
                options={
                    {
                        title: 'Signup for appointments step (3/3)',
                        headerStyle: {
                            backgroundColor: '#324e73',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'normal',
                            fontSize: 14
                        },
                    }
                }
            />  
        </Stack.Navigator>
    );
}

export default AuthScreens;
