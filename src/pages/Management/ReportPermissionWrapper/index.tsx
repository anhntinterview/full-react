import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { useContext } from 'react';
import { useHistory, useParams } from 'react-router';

import Unauthorized from 'components/Workspace/UnAuthorized';

const ReportPermissionWrapper = ({ type, children }: { type?: "teacher" | "student", children }) => {
    const history = useHistory();
    const params: { id: string } = useParams();
    const { getWorkspaceDetailState } = useContext(GetWorkspaceContext);
    const {
        result: { membership },
    } = getWorkspaceDetailState;

    if (
        membership.id !== -1 && type && membership.type !== type
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

export default ReportPermissionWrapper;
