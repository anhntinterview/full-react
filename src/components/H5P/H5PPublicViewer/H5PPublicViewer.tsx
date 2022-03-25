import React from 'react';
// COMPONENTS
import H5PPublicViewerContentComponent from './H5PPublicViewerContentComponent';

export interface H5PPublicViewerProps {
    contentUid: string;
}

const H5PPublicViewer: React.FC<H5PPublicViewerProps> = ({ contentUid }) => {
    const [entryState, setEntryState] = React.useState({
        loading: false,
    });
    return (
        <div>
            <div className="mx-auto">
                <H5PPublicViewerContentComponent
                    contentUid={contentUid}
                    entryState={entryState}
                    setEntryState={setEntryState}
                />
            </div>
        </div>
    );
};

export default H5PPublicViewer;
