import React, { useReducer } from 'react';
import { GoogleAPIAndServicesContext } from './GoogleAPIAndServicesContext';
import reducers from 'reducers';
import { initGoogleState } from 'state/Google/google.state';

const GoogleAPIAndServicesProvider: React.FC = ({ children }) => {
    const [googleState, dispatch] = useReducer(
        reducers.googleReducer,
        initGoogleState
    );
    return (
        <GoogleAPIAndServicesContext.Provider value={{ googleState, dispatch }}>
            {children}
        </GoogleAPIAndServicesContext.Provider>
    );
};

export default GoogleAPIAndServicesProvider;
