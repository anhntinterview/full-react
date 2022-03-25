import React, { useReducer } from 'react';
import { GetWorkspaceAdminContext } from './WorkspaceContext';
import reducers from 'reducers';
import { initCurrentPendingAdminWorkspace } from 'state/Workspace/workspace.state';

const WorkspaceAdminProvider: React.FC = ({ children }) => {
    const [getWorkspaceAdminState, dispatch] = useReducer(
        reducers.getWorkspaceAdminReducer,
        initCurrentPendingAdminWorkspace
    );
    return (
        <GetWorkspaceAdminContext.Provider
            value={{ getWorkspaceAdminState, dispatch }}
        >
            {children}
        </GetWorkspaceAdminContext.Provider>
    );
};

export default WorkspaceAdminProvider;
