import React from 'react';
// COMPONENTS
import H5PPublicViewerEntryComponent from './H5PPublicViewerEntryComponent';
// SERVICE
import h5pServices from 'services/h5p.service';

export interface H5PPlayerContentListComponentProps {
    contentUid: string,
    entryState: {
        loading: boolean;
    };
    setEntryState: React.Dispatch<React.SetStateAction<{
        loading: boolean;
    }>>
}

const H5PPublicViewerContentComponent: React.FC<H5PPlayerContentListComponentProps> = ({
    contentUid,
    entryState,
    setEntryState
}) => {
    return (
        <>
            <H5PPublicViewerEntryComponent
                contentUid={contentUid}
                h5pUidPlayerPromise={h5pServices.h5pUidPlayerPromise}
                entryState={entryState}
                setEntryState={setEntryState}
            />
        </>
    );
};

export default H5PPublicViewerContentComponent;
