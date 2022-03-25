import * as React from 'react';
// PACKAGE
import { Redirect, Route } from 'react-router-dom';
// UTILS
import { isLocalStorageTemporaryAuth } from 'utils/handleLocalStorage';

const AuthTemporaryRoute: React.ComponentType<any> = ({
    path,
    isAuthStorage,
    setAuthStorage,
    storageUserInfo,
    storageUserInfoSession,
    // setHeader,
    component: Component,
    ...rest
}) => {
    // DISPLAY HEADER
    // setHeader(false);

    // TEMPORARY TOKEN
    const isTemporaryAuth = isLocalStorageTemporaryAuth();

    return (
        <Route
            path={path}
            {...rest}
            exact
            render={(props) => {
                return isTemporaryAuth ? (
                    <Component
                        {...props}
                        setAuthStorage={setAuthStorage}
                        storageUserInfo={storageUserInfo}
                        storageUserInfoSession={storageUserInfoSession}
                    />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                );
            }}
        />
    );
};

export default AuthTemporaryRoute;
