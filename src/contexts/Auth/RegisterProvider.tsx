import React, { useReducer } from 'react';
import { RegisterContext } from './RegisterContext';
import reducers from 'reducers';
import { initRegisterState } from 'state/Auth/register.state';

const RegisterProvider: React.FC = ({ children }) => {
    const [registerState, dispatch] = useReducer(
        reducers.registerReducer,
        initRegisterState
    );
    return (
        <RegisterContext.Provider value={{ registerState, dispatch }}>
            {children}
        </RegisterContext.Provider>
    );
};

export default RegisterProvider;
