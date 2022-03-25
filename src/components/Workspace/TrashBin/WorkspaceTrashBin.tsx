import React, { useContext, useEffect } from 'react';

import FileView from '../WorkspaceFolder/WorkspaceFolderTable/FileView';

//CONTEXT
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';

import googleMiddleware from 'middleware/google.middleware';

const WorkspaceTrashBin = () => {
    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );

    const { driveGoogleGetListResult } = googleState;

    const listData = React.useMemo(() => driveGoogleGetListResult.files, [
        driveGoogleGetListResult,
    ]);

    useEffect(() => {
        googleMiddleware.getListGoogleDrive(googleDispatch, {
            fields: '*',
            q: "'root' in parents and trashed = true",
        });
    }, []);

    return (
        <div>
            {listData.map((i) => (
                <FileView
                    data={i}
                    key={i.id}
                    allowDrag={false}
                    allowDrop={false}
                />
            ))}
        </div>
    );
};

export default WorkspaceTrashBin;
