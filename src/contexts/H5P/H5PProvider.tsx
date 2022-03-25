import React, { useReducer } from 'react';
import { H5PContext } from './H5PContext';
import reducers from 'reducers';
import { initH5PState } from 'state/H5P/H5P.state';

const H5PProvider: React.FC = ({ children }) => {
    const [H5PState, dispatch] = useReducer(
        reducers.h5pReducer,
        initH5PState
    );
    return (
        <H5PContext.Provider value={{ H5PState, dispatch }}>
            {children}
        </H5PContext.Provider>
    );
};

export default H5PProvider;
