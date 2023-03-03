import React from 'react';
import { Text } from 'react-native';
// import { logoutUser } from '../../actions/authActions';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';



const LogoutScreen = () => {

    // this.props.actions.logoutUser();

    return(
        <Text>Logout</Text>
    )

}


// const mapStateToProps = state => ({
//     page: state.page,
//     errors: state.errors
// });

// function mapDispatchToProps(dispatch) {
//     return {
//       actions: bindActionCreators({
//         logoutUser
//       }, dispatch)
//     };
// }

export default connect(null, null)(LogoutScreen);