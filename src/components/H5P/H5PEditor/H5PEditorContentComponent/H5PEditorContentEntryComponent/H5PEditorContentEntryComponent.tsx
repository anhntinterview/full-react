import React from 'react';
// PACKAGES
import {
    faCheck,
    faFileDownload,
    faPencilAlt,
    faSave,
    faTrashAlt,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IContentMetadata, IEditorModel } from 'packages/h5p-server';
// TYPES
import {
    IContentListEntry,
    IH5PPlayerArgs,
    TagIdType,
    TagsType,
} from 'types/H5P.type';
// COMPONENTS
import { H5PEditorUI } from 'packages/h5p-react';
// MIDDLEWARE
import h5pMiddleware from 'middleware/h5p.middlware';
// CONTEXTS
import { H5PContext } from 'contexts/H5P/H5PContext';
import { H5PModal } from 'components/H5P/H5PComponents';
import { H5P_MODAL } from 'constant/modal.const';
import { TagType } from 'types/GetListOfWorkspace.type';
import h5pMiddlware from 'middleware/h5p.middlware';
export interface H5PViewerContentListComponent {
    argsId: IH5PPlayerArgs;
    content: IContentListEntry;
    onDelete: () => Promise<void>;
    onSaved: (
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) => Promise<void>;
    h5pEditPromise: (args: IH5PPlayerArgs) => Promise<IEditorModel>;
    h5pSavePromise: (
        argsId: IH5PPlayerArgs,
        requestBody: {
            library: string;
            params: any;
        }
    ) => Promise<{
        argsId: IH5PPlayerArgs;
        metadata: IContentMetadata;
    }>;
    generateDownloadLink: (args: IH5PPlayerArgs) => string;
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

const H5PEditorContentEntryComponent: React.FC<H5PViewerContentListComponent> = ({
    argsId,
    content,
    onDelete,
    onSaved,
    h5pEditPromise,
    h5pSavePromise,
    generateDownloadLink,
    entryState,
    setEntryState,
    h5pEditorRef,
}) => {
    const [apiMsg, setApiMsg] = React.useState<string>();
    const h5PCtx = React.useContext(H5PContext);
    const {
        dispatch,
        H5PState: { h5PPlayerResult, h5PApproveContentResult, err },
    } = h5PCtx;
    const saveButton = React.useRef(null);
    const h5pEditor: React.RefObject<H5PEditorUI> = React.useRef(null);
    const [h5pApprove, setH5pApprove] = React.useState<boolean>(false);
    const [isModal, setIsModal] = React.useState<boolean>(false);
    const [modalProps, setModalProps] = React.useState<{
        component: {
            type: string;
            title: string;
            subTitle: string;
            btnCancel: string;
            btnSubmit: string;
            color: string;
            img: string;
        };
        onFetch: () => Promise<void>;
    }>();
    // const downloadButton = React.useRef(null);

    React.useEffect(() => {
        if (content?.status != 'public') {
            setH5pApprove(true);
        }
    }, [content]);

    async function onEditorSaved() {
        setEntryState({
            ...entryState,
            saving: false,
            saved: true,
        });
        setTimeout(() => {
            setEntryState({ ...entryState, saved: false });
        }, 3000);
    }

    function onEditorLoaded() {
        setEntryState({
            ...entryState,
            loading: false,
        });
    }

    async function onSaveError(event: any) {
        setEntryState({
            ...entryState,
            saving: false,
            saved: false,
            saveError: true,
            saveErrorMessage: event?.detail?.message,
        });
        setTimeout(() => {
            setEntryState({
                ...entryState,
                saveError: false,
            });
        }, 5000);
    }

    function edit() {
        setEntryState({ ...entryState, editing: true });
    }

    React.useEffect(() => {
        edit();
    }, []);

    function close() {
        setEntryState({ ...entryState, editing: false, playing: false });
    }
    React.useEffect(() => {
        setApiMsg(err);
    }, [err]);

    return (
        <div>
            {entryState.editing ? (
                <>
                    <Overlay
                        target={saveButton.current}
                        show={entryState.saveError}
                        placement="right"
                    >
                        <Tooltip id="error-tooltip">
                            {entryState.saveErrorMessage}
                        </Tooltip>
                    </Overlay>
                </>
            ) : null}

            <label
                className={`${h5PApproveContentResult && `text-green-500`} ${
                    err ? `text-red-500` : null
                }`}
            >
                {apiMsg}
            </label>

            {entryState.editing ? (
                <H5PEditorUI
                    ref={h5pEditorRef}
                    argsId={argsId}
                    loadContentCallback={h5pEditPromise}
                    saveContentCallback={h5pSavePromise}
                    onSaved={onEditorSaved}
                    onLoaded={onEditorLoaded}
                    onSaveError={onSaveError}
                />
            ) : null}
            <H5PModal
                isModal={isModal}
                setIsModal={setIsModal}
                modalProps={modalProps}
            />
        </div>
    );
};

export default H5PEditorContentEntryComponent;
