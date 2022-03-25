import React, { useReducer } from 'react';
import { GoogleAPIAndServicesServerSideContext } from './GoogleAPIAndServicesContext';
import reducers from 'reducers';
import { initGoogleServerSideState } from 'state/Google/google.state';

const GoogleAPIAndServicesServerSideProvider: React.FC = ({ children }) => {
    const [googleServerSideState, dispatch] = useReducer(
        reducers.googleServerSideReducer,
        initGoogleServerSideState
    );
    return (
        <GoogleAPIAndServicesServerSideContext.Provider
            value={{ googleServerSideState, dispatch }}
        >
            {children}
        </GoogleAPIAndServicesServerSideContext.Provider>
    );
};

export default GoogleAPIAndServicesServerSideProvider;
