import React, { useReducer } from 'react';
import { GetListOfWorkspaceContext } from './WorkspaceContext';
import reducers from 'reducers';
import { initGetListOfWorkspaceState } from 'state/Workspace/workspace.state';

const GetListOfWorkspaceProvider: React.FC = ({ children }) => {
    const [getListOfWorkspaceState, dispatch] = useReducer(
        reducers.getListOfWorkspaceReducer,
        initGetListOfWorkspaceState
    );
    return (
        <GetListOfWorkspaceContext.Provider
            value={{ getListOfWorkspaceState, dispatch }}
        >
            {children}
        </GetListOfWorkspaceContext.Provider>
    );
};

export default GetListOfWorkspaceProvider;
