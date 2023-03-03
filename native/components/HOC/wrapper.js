import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Spinner from "../common/Spinner";
import { StyleSheet, SafeAreaView, View, KeyboardAvoidingView, Platform } from 'react-native';
import { clearError } from "../../store/actions/pageActions";
import { useDispatch } from "react-redux";

const Wrapper = (WrappedComponent) => {

    return (props) => {
        const dispatch = useDispatch()
        useEffect(() => {
            dispatch(clearError())

            const listener = props.navigation.addListener('beforeRemove', () => {
                dispatch(clearError())
            });

            return () => {
                listener()
            }

        }, [])

        const loading = useSelector((state) => state.pageReducer.loading)
        return (
            <View style={styles.container}>
                {loading && <Spinner />}
                <View style={loading ? styles.hide : styles.container}>
                    <WrappedComponent {...props} />
                </View>
            </View>
        )
    }

}

export default Wrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    hide: {
        display: 'none'
    }
});