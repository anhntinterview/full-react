import React from 'react';
// PACKAGES
import { useHistory } from 'react-router-dom';
import { TagType } from 'types/GetListOfWorkspace.type';
import { H5PEditorUI } from 'packages/h5p-react';
// TYPES
import { IContentListEntry } from 'types/H5P.type';
// COMPONENTS
import H5PEditorContentComponent from './H5PEditorContentComponent';
export interface H5PEditorProps {
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

const H5PEditor: React.FC<H5PEditorProps> = ({
    h5pContentListEntryState,
    setH5PContentListEntryState,
    entryState,
    setEntryState,
    h5pEditorRef,
}) => {
    const history = useHistory();
    const pathname = history.location.pathname;
    const pathArray = pathname.split('/');
    const workspacePos = pathArray.indexOf('workspace');
    const contentPos = pathArray.indexOf('h5p-content');
    const workspaceId = pathArray[workspacePos + 1];
    const contentId = pathArray[contentPos + 1];

    const argsId = {
        workspaceId,
        contentId,
    };
    return (
        <>
            <H5PEditorContentComponent
                argsId={argsId}
                h5pContentListEntryState={h5pContentListEntryState}
                setH5PContentListEntryState={setH5PContentListEntryState}
                entryState={entryState}
                setEntryState={setEntryState}
                h5pEditorRef={h5pEditorRef}
            />
        </>
    );
};

export default H5PEditor;
