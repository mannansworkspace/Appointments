import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

const PrivateRoute = ({ component: Component, auth, ...rest }) => {
    let location = useLocation();
    
    return (
        <Route
            {...rest}
            render={
                props => auth.isAuthenticated === true ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={`/login?redirectTo=${location.pathname}`} />
                )
            }
        />
    );
}

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);