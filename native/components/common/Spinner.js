import React from 'react';
import {StyleSheet, View, Image } from 'react-native';
import spinner from './spinner.gif';

export default () => {
	return (
		<View style={styles.container}>
			<Image
				source={spinner}
				style={{ margin: 'auto' }}
				alt="Loading..."
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems : 'center',
		marginTop : '50%',
		marginBottom : '50%'
	}, 
	logo: {
	  width: 300,
	  height: 400,
	},
});