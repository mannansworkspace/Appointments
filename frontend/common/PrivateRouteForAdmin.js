import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRouteForAdmin = ({ component: Component, auth, ...rest }) => (
    <Route
        {...rest}
        render={
            props => auth.isAuthenticated === true ? (
                <Component {...props} />
            ) : (
                <Redirect to="/superadmin/login" />
            )
        }
    />
);

PrivateRouteForAdmin.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.superAdminAuth
});

export default connect(mapStateToProps)(PrivateRouteForAdmin);