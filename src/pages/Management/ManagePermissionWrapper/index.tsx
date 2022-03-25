import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import Unauthorized from 'components/Workspace/UnAuthorized';

const ManagePermissionWrapper = ({ children }) => {
    const history = useHistory();
    const params: { id: string } = useParams();
    const { getWorkspaceDetailState } = useContext(GetWorkspaceContext);
    const {
        result: { membership },
    } = getWorkspaceDetailState;
    
    if (
        membership.id !== -1 &&
        membership.role !== 'admin' &&
        membership.type !== 'teacher'
    ) {
        return (
            <div className="h-screen">
                <Unauthorized
                    action={() =>
                        history.push(`/workspace/${params.id}/h5p-content`)
                    }
                />
            </div>
        );
    }
    return children;
};

export default ManagePermissionWrapper;
