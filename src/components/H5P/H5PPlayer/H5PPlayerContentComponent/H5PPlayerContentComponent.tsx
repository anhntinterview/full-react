import React from 'react';
// COMPONENTS
import H5PPlayerContentEntryComponent from './H5PPlayerContentEntryComponent';
// SERVICE
import h5pServices from 'services/h5p.service';
// TYPES
import { IH5PPlayerArgs } from 'types/H5P.type';

export interface H5PPlayerContentListComponentProps {
    argsId: IH5PPlayerArgs;
    // contentId: string;
    entryState: {
        editing: boolean;
        playing: boolean;
        loading: boolean;
        saved: boolean;
        saving: boolean;
        saveError: boolean;
        saveErrorMessage: string;
    };
    setEntryState: React.Dispatch<
        React.SetStateAction<{
            editing: boolean;
            playing: boolean;
            loading: boolean;
            saved: boolean;
            saving: boolean;
            saveError: boolean;
            saveErrorMessage: string;
        }>
    >;
}

const H5PPlayerContentComponent: React.FC<H5PPlayerContentListComponentProps> = ({
    argsId,
    // contentId,
    entryState,
    setEntryState,
}) => {
    return (
        <>
            <H5PPlayerContentEntryComponent
                argsId={argsId}
                h5pPlayerPromise={h5pServices.h5pPlayerPromise}
                entryState={entryState}
                setEntryState={setEntryState}
            />
        </>
    );
};

export default H5PPlayerContentComponent;
