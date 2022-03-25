import React, { useReducer } from 'react';
import { InviteMemberWorkspaceContext } from './WorkspaceContext';
import reducers from 'reducers';
import { initInviteMembersStateState } from 'state/Workspace/workspace.state';

const InviteMemberWorkspaceProvider: React.FC = ({ children }) => {
    const [inviteMemberWorkspaceState, dispatch] = useReducer(
        reducers.inviteMembersReducer,
        initInviteMembersStateState
    );
    return (
        <InviteMemberWorkspaceContext.Provider
            value={{ inviteMemberWorkspaceState, dispatch }}
        >
            {children}
        </InviteMemberWorkspaceContext.Provider>
    );
};

export default InviteMemberWorkspaceProvider;
