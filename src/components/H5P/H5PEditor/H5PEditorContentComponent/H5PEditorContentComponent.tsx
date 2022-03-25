import React from 'react';
// PACKAGES
import { useHistory } from 'react-router-dom';
// COMPONENTS
import H5PEditorContentEntryComponent from './H5PEditorContentEntryComponent';
// SERVICE
import h5pServices from 'services/h5p.service';
// TYPES
import { IContentListEntry, IH5PPlayerArgs } from 'types/H5P.type';
import { TagType } from 'types/GetListOfWorkspace.type';
import { H5PEditorUI } from 'packages/h5p-react';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import { TrashIcon } from '@heroicons/react/outline';
import { useTranslation } from 'react-i18next';

export interface H5PEditorContentComponentProps {
    argsId: IH5PPlayerArgs;
    h5pContentListEntryState: IContentListEntry;
    setH5PContentListEntryState: React.Dispatch<
        React.SetStateAction<IContentListEntry | undefined>
    >;
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
    h5pEditorRef?: React.RefObject<H5PEditorUI>;
}

const H5PEditorContentComponent: React.FC<H5PEditorContentComponentProps> = ({
    argsId,
    h5pContentListEntryState,
    setH5PContentListEntryState,
    entryState,
    setEntryState,
    h5pEditorRef,
}) => {
    const { t: translator } = useTranslation();

    const history = useHistory();
    async function onDelete() {
        try {
            await h5pServices
                .h5pDeletePromise(argsId)
                .then((res) =>
                    res
                        ? successNoti(
                              translator(
                                  'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH'
                              ),
                              <TrashIcon />
                          )
                        : errorNoti(
                              translator(
                                  'DASHBOARD.H5P_CONTENTS.H5P_MOVE_TO_TRASH_FAILED'
                              ),
                              <TrashIcon />
                          )
                );
            setH5PContentListEntryState(undefined);
            history.push(`/workspace/${argsId.workspaceId}/h5p-content`);
        } catch (error) {
            console.log(error);
        }
    }

    async function onSaved(
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) {
        setH5PContentListEntryState(
            h5pContentListEntryState === oldData
                ? newData
                : h5pContentListEntryState
        );
    }

    return (
        <>
            <H5PEditorContentEntryComponent
                argsId={argsId}
                content={h5pContentListEntryState}
                onSaved={onSaved}
                onDelete={onDelete}
                h5pEditPromise={h5pServices.h5pEditPromise}
                h5pSavePromise={h5pServices.h5pSavePromise}
                generateDownloadLink={h5pServices.generateDownloadLink}
                entryState={entryState}
                setEntryState={setEntryState}
                h5pEditorRef={h5pEditorRef}
            />
        </>
    );
};

export default H5PEditorContentComponent;
