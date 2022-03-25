import React, { useReducer } from 'react';
import { AuthContext } from './AuthContext';
import reducers from 'reducers';
import { initAuthState } from 'state/Auth/auth.state';

const AuthProvider: React.FC = ({ children }) => {
    const [authState, dispatch] = useReducer(
        reducers.authReducer,
        initAuthState
    );
    return (
        <AuthContext.Provider value={{ authState, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
