import React from 'react';

import {
    StyleSheet,
    View,
    StatusBar,
    Platform,
} from 'react-native';
  
function StatusBarTheme(){
    return (
    <>
    <View style={[styles.statusBar, { backgroundColor : '#0c203d',color : '#fff'}]}>
      <StatusBar barStyle="light-content" backgroundColor="#0c203d"/>
    </View>
    </>
    ); 
}
  
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

const styles = StyleSheet.create({
    statusBar: {
      height: STATUSBAR_HEIGHT,
    },
});
  
export default StatusBarTheme;