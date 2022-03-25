import React, { useReducer } from 'react';
import { PasswordContext } from './PasswordContext';
import reducers from 'reducers';
import { initPasswordState } from 'state/Password/password.state';

const PasswordProvider: React.FC = ({ children }) => {
    const [passwordState, dispatch] = useReducer(
        reducers.passwordReducer,
        initPasswordState
    );
    return (
        <PasswordContext.Provider value={{ passwordState, dispatch }}>
            {children}
        </PasswordContext.Provider>
    );
};

export default PasswordProvider;
