import React, { useReducer } from 'react';
import { GetWorkspaceContext } from './WorkspaceContext';
import reducers from 'reducers';
import { initCurrentWorkspace } from 'state/Workspace/workspace.state';

const WorkspaceDetailProvider: React.FC = ({ children }) => {
    const [getWorkspaceDetailState, dispatch] = useReducer(
        reducers.getWorkspaceDetailReducer,
        initCurrentWorkspace
    );
    return (
        <GetWorkspaceContext.Provider
            value={{ getWorkspaceDetailState, dispatch }}
        >
            {children}
        </GetWorkspaceContext.Provider>
    );
};

export default WorkspaceDetailProvider;
