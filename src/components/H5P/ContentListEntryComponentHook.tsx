import React from 'react';

// The .js references are necessary for requireJs to work in the browser.
import {
    IContentService,
    IContentListEntry,
    IH5PPlayerArgs,
} from 'types/H5P.type';

import { H5PEditorUI, H5PPlayerUI } from 'packages/h5p-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faSave,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';
import { Overlay, Tooltip } from 'react-bootstrap';

import h5pServices from 'services/h5p.service';

interface ContentListComponentHookProp {
    workspaceId: string;
    contentService: IContentService;
    data: IContentListEntry;
    onDelete: (content: IContentListEntry) => void;
    onDiscard: (content: IContentListEntry) => void;
    onSaved: (data: IContentListEntry) => Promise<void>;
    generateDownloadLink: (contentId: string) => string;
}

const ContentListEntryComponentHook: React.FC<ContentListComponentHookProp> = ({
    workspaceId,
    data,
    onDiscard,
    onSaved,
}) => {
    const [entryState, setEntryState] = React.useState({
        editing: data.contentId === 'new',
        playing: false,
        saving: false,
        saved: false,
        loading: true,
        saveErrorMessage: '',
        saveError: false,
    });
    const { h5pEditPromise, h5pSavePromise, h5pPlayerPromise } = h5pServices;
    const h5pEditor: React.RefObject<H5PEditorUI> = React.useRef(null);
    const saveButton: React.RefObject<HTMLButtonElement> = React.useRef(null);
    const h5pPlayer: React.RefObject<H5PPlayerUI> = React.useRef(null);

    const argsId: IH5PPlayerArgs = {
        workspaceId: workspaceId,
        contentId: data.contentId,
    };

    function onPlayerInitialized() {
        setEntryState({ ...entryState, loading: false });
    }

    // function play() {
    //     setEntryState({ ...entryState, editing: false, playing: true });
    // }
    function close() {
        setEntryState({ ...entryState, editing: false, playing: false });
    }
    // function edit() {
    //     setEntryState({ ...entryState, editing: true, playing: false });
    // }

    async function save() {
        setEntryState({ ...entryState, saving: true });
        try {
            const returnData = await h5pEditor.current?.save();
            if (returnData) {
                await onSaved({
                    contentId: returnData.contentId,
                    // contentId: returnData.contentId,
                    argsId: {
                        workspaceId: workspaceId,
                        contentId: returnData.contentId,
                        contentUid: returnData.uid,
                    },
                    mainLibrary: returnData.metadata.mainLibrary,
                    title: returnData.metadata.title,
                    originalNewKey: data.originalNewKey,
                    updated_on: new Date().toISOString(),
                });
            }
        } catch (error) {
            // We ignore the error, as we subscribe to the 'save-error' and
            // 'validation-error' events.
        }
    }
    const onSaveError = async (event: any) => {
        console.log(`event: `, event);
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
    };

    const handleSaved = async () => {
        setEntryState({
            ...entryState,
            saving: false,
            saved: true,
        });

        setTimeout(() => {
            setEntryState({
                ...entryState,
                saved: false,
            });
        }, 3000);
    };

    const onEditorLoaded = () => {
        setEntryState({ ...entryState, loading: false });
    };

    function isNew() {
        return data.contentId === 'new';
    }

    return (
        <div key={data.originalNewKey ?? data.contentId}>
            <div>
                <div>
                    {entryState.playing ? (
                        <button
                            className="mr-2 mb-2 bg-ooolab_blue_4 text-white px-4 py-2 rounded-2xl"
                            onClick={() => close()}
                        >
                            <FontAwesomeIcon
                                icon={faWindowClose}
                                className="mr-3"
                            />
                            close player
                        </button>
                    ) : undefined}
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
                            <button
                                ref={saveButton}
                                className={`mr-2 mb-2  text-ooolab_blue_1  bg-ooolab_bg_bar px-4 py-2 rounded-header_menu  text-ooolab_1xs hover:bg-ooolab_bg_sub_tab_active hover:text-white ${
                                    entryState.saving || entryState.loading
                                        ? 'disabled'
                                        : ''
                                }`}
                                disabled={
                                    entryState.saving || entryState.loading
                                }
                                onClick={() => save()}
                            >
                                {entryState.saving ? (
                                    <div
                                        className="spinner-border spinner-border-sm m-1 align-middle"
                                        role="status"
                                    ></div>
                                ) : (
                                    <FontAwesomeIcon
                                        icon={faSave}
                                        className="mr-2"
                                    />
                                )}{' '}
                                save{' '}
                                {entryState.saved ? (
                                    <FontAwesomeIcon
                                        icon={faCheck}
                                        className="mr-2"
                                    />
                                ) : undefined}
                            </button>
                        </>
                    ) : undefined}
                    {entryState.editing && !isNew() ? (
                        <button
                            className="mr-2 mb-2 bg-ooolab_gray_5 text-white px-4 py-2 rounded-2xl"
                            onClick={() => close()}
                        >
                            <FontAwesomeIcon
                                icon={faWindowClose}
                                className="mr-2"
                            />
                            close editor
                        </button>
                    ) : undefined}
                    {entryState.editing && isNew() ? (
                        <button
                            className="mr-2 mb-2 bg-ooolab_gray_5  text-white px-4 py-2 rounded-header_menu  text-ooolab_1xs hover:bg-ooolab_pink_1 hover:text-white"
                            onClick={() => onDiscard(data)}
                        >
                            <FontAwesomeIcon
                                icon={faWindowClose}
                                className="mr-2"
                            />
                            discard
                        </button>
                    ) : undefined}
                </div>
            </div>
            {entryState.editing ? (
                <div
                    className={
                        data.contentId !== 'new' && entryState.loading
                            ? 'loading'
                            : ''
                    }
                >
                    {entryState.editing ? (
                        <H5PEditorUI
                            argsId={argsId}
                            loadContentCallback={h5pEditPromise}
                            saveContentCallback={h5pSavePromise}
                            onSaved={handleSaved}
                            onLoaded={onEditorLoaded}
                            onSaveError={onSaveError}
                        />
                    ) : null}
                </div>
            ) : undefined}

            {entryState.playing ? (
                <H5PPlayerUI
                    ref={h5pPlayer}
                    argsId={argsId}
                    loadContentCallback={() => h5pPlayerPromise(argsId)}
                    onInitialized={onPlayerInitialized}
                    onxAPIStatement={(statement: any, context: any, event) =>
                        console.log(statement, context, event)
                    }
                />
            ) : undefined}
        </div>
    );
};

export default ContentListEntryComponentHook;
