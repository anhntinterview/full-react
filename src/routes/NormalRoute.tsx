import { AUTH_CONST } from 'constant/auth.const';
import { AuthContext } from 'contexts/Auth/AuthContext';
import * as React from 'react';
// PACKAGE
import { Route, useHistory } from 'react-router-dom';
// UTILS
import { getParamFromUrl } from 'utils/handleString';

const NormalRoute: React.ComponentType<any> = ({
    path,
    component: Component,
    setAuthStorage,
    ...rest
}) => {
    const { authState, dispatch: AuthDispatch } = React.useContext(AuthContext);
    const { err } = authState;
    // FROM EMAIL ROUTES
    let tokenParam: string | undefined;
    let emailParam: string | undefined;
    const history = useHistory();
    const params = history.location.search;
    if (params.indexOf('token') > -1) {
        tokenParam = getParamFromUrl(params, 'token');
        emailParam = getParamFromUrl(params, 'email');
    }

    return (
        <Route
            path={path}
            exact
            {...rest} // PROPS ITEM inside { ...rest } need inject to Component below
            render={(props) => {
                return (
                    <Component
                        {...props}
                        setAuthStorage={setAuthStorage}
                        emailParam={emailParam}
                        tokenParam={tokenParam}
                    />
                ); // Reminder: { ...rest } initial above, but have to pass PROPS ITEM inside Component below
            }}
        />
    );
};

export default NormalRoute;
