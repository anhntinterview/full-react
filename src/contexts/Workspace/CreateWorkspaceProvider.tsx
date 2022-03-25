import React, { useReducer } from 'react';
import { CreateWorkspaceContext } from './WorkspaceContext';
import reducers from 'reducers';
import { initCreateWorkspaceState } from 'state/Workspace/workspace.state';

const CreateWorkspaceProvider: React.FC = ({ children }) => {
    const [createWorkspaceState, dispatch] = useReducer(
        reducers.createWorkspaceReducer,
        initCreateWorkspaceState
    );
    return (
        <CreateWorkspaceContext.Provider
            value={{ createWorkspaceState, dispatch }}
        >
            {children}
        </CreateWorkspaceContext.Provider>
    );
};

export default CreateWorkspaceProvider;
