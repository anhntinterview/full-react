import React, { useReducer } from 'react';
import { ManagementContext } from './ManagementContext';
import reducers from 'reducers';
import { initH5PState } from 'state/H5P/H5P.state';

const H5PProvider: React.FC = ({ children }) => {
    const [ManagementState, dispatch] = useReducer(reducers.h5pReducer, initH5PState);
    return (
        <ManagementContext.Provider value={{ ManagementState, dispatch }}>
            {children}
        </ManagementContext.Provider>
    );
};

export default H5PProvider;
