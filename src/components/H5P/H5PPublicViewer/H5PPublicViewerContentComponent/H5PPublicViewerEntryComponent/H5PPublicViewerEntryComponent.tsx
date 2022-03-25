import React from 'react';
// PACKAGES
import { IPlayerModel } from 'packages/h5p-server';
// COMPONENTS
import { H5PPublicViewerUI } from 'packages/h5p-react';

export interface H5PViewerContentListComponent {
    contentUid: string;
    h5pUidPlayerPromise: (contentUid: string) => Promise<IPlayerModel>;
    entryState: {
        loading: boolean;
    };
    setEntryState: React.Dispatch<
        React.SetStateAction<{
            loading: boolean;
        }>
    >;
}

const H5PPublicViewerEntryComponent: React.FC<H5PViewerContentListComponent> = ({
    contentUid,
    h5pUidPlayerPromise,
    entryState,
    setEntryState,
}) => {
    const h5pPlayer = React.useRef(null);

    function onPlayerInitialized() {
        setEntryState({ ...entryState, loading: false });
    }

    return (
        <div className={entryState.loading ? 'loading' : ''}>
            <H5PPublicViewerUI
                ref={h5pPlayer}
                contentId={contentUid}
                loadContentCallback={h5pUidPlayerPromise}
                onInitialized={onPlayerInitialized}
                onxAPIStatement={(statement: any, context: any, event) =>
                    console.log(statement, context, event)
                }
            />
        </div>
    );
};

export default H5PPublicViewerEntryComponent;
