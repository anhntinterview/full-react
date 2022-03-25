import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faWindowClose,
    faSave,
    faCheck,
} from '@fortawesome/free-solid-svg-icons';

import { H5PEditorUI, H5PPlayerUI } from 'packages/h5p-react';

import { IContentListEntry, IContentService } from 'types/H5P.type';
// import { IContentListEntry, IContentService } from 'services/h5p/ContentService';

import h5pServices from 'services/h5p.service';
export default class ContentListEntryComponent extends React.Component<{
    workspaceId: string;
    contentService: IContentService;
    data: IContentListEntry;
    onDelete: (content: IContentListEntry) => void;
    onDiscard: (content: IContentListEntry) => void;
    onSaved: (data: IContentListEntry) => void;
    generateDownloadLink: (contentId: string) => string;
}> {
    constructor(props: {
        workspaceId: string;
        contentService: IContentService;
        data: IContentListEntry;
        onDiscard: (content: IContentListEntry) => void;
        onDelete: (content: IContentListEntry) => void;
        onSaved: (data: IContentListEntry) => void;
        generateDownloadLink: (contentId: string) => string;
    }) {
        super(props);
        this.state = {
            editing: props.data.contentId === 'new',
            playing: false,
            saving: false,
            saved: false,
            loading: true,
            saveErrorMessage: '',
            saveError: false,
        };
        this.h5pEditor = React.createRef();
        this.saveButton = React.createRef();
        this.h5pPlayer = React.createRef();
    }

    public state: {
        editing: boolean;
        loading: boolean;
        playing: boolean;
        saved: boolean;
        saving: boolean;
        saveError: boolean;
        saveErrorMessage: string;
    };

    private h5pPlayer: React.RefObject<H5PPlayerUI>;
    private h5pEditor: React.RefObject<H5PEditorUI>;
    private saveButton: React.RefObject<HTMLButtonElement>;

    public render(): React.ReactNode {
        return (
            <div
                // className="py-6"
                key={
                    this.props.data.originalNewKey ?? this.props.data.contentId
                }
            >
                <div>
                    <div>
                        {this.state.playing ? (
                            <button
                                className="mr-2 mb-2 bg-ooolab_blue_4 text-white px-4 py-2 rounded-2xl"
                                onClick={() => this.close()}
                            >
                                <FontAwesomeIcon
                                    icon={faWindowClose}
                                    className="mr-3"
                                />
                                close player
                            </button>
                        ) : undefined}
                        {this.state.editing ? (
                            <>
                                <Overlay
                                    target={this.saveButton.current}
                                    show={this.state.saveError}
                                    placement="right"
                                >
                                    <Tooltip id="error-tooltip">
                                        {this.state.saveErrorMessage}
                                    </Tooltip>
                                </Overlay>
                                <button
                                    ref={this.saveButton}
                                    className={`mr-2 mb-2  text-ooolab_blue_1  bg-ooolab_bg_bar px-4 py-2 rounded-header_menu  text-ooolab_1xs hover:bg-ooolab_bg_sub_tab_active hover:text-white ${
                                        this.state.saving || this.state.loading
                                            ? 'disabled'
                                            : ''
                                    }`}
                                    disabled={
                                        this.state.saving || this.state.loading
                                    }
                                    onClick={() => this.save()}
                                >
                                    {this.state.saving ? (
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
                                    {this.state.saved ? (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            className="mr-2"
                                        />
                                    ) : undefined}
                                </button>
                            </>
                        ) : undefined}
                        {this.state.editing && !this.isNew() ? (
                            <button
                                className="mr-2 mb-2 bg-ooolab_gray_5 text-white px-4 py-2 rounded-2xl"
                                onClick={() => this.close()}
                            >
                                <FontAwesomeIcon
                                    icon={faWindowClose}
                                    className="mr-2"
                                />
                                close editor
                            </button>
                        ) : undefined}
                        {this.state.editing && this.isNew() ? (
                            <button
                                className="mr-2 mb-2 bg-ooolab_gray_5  text-white px-4 py-2 rounded-header_menu  text-ooolab_1xs hover:bg-ooolab_pink_1 hover:text-white"
                                onClick={() =>
                                    this.props.onDiscard(this.props.data)
                                }
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
                {this.state.editing ? (
                    <div
                        className={
                            this.props.data.contentId !== 'new' &&
                            this.state.loading
                                ? 'loading'
                                : ''
                        }
                    >
                        <H5PEditorUI
                            ref={this.h5pEditor}
                            argsId={{
                                workspaceId: this.props.workspaceId,
                                contentId: this.props.data.contentId,
                            }}
                            loadContentCallback={h5pServices.h5pEditPromise}
                            saveContentCallback={h5pServices.h5pSavePromise}
                            onSaved={this.onSaved}
                            onLoaded={this.onEditorLoaded}
                            onSaveError={this.onSaveError}
                        />
                    </div>
                ) : undefined}
                {this.state.playing ? (
                    <H5PPlayerUI
                        ref={this.h5pPlayer}
                        argsId={{
                            workspaceId: this.props.workspaceId,
                            contentId: this.props.data.contentId,
                        }}
                        loadContentCallback={h5pServices.h5pPlayerPromise}
                        onInitialized={this.onPlayerInitialized}
                        onxAPIStatement={(
                            statement: any,
                            context: any,
                            event
                        ) => console.log(statement, context, event)}
                    />
                ) : undefined}
            </div>
        );
    }

    protected play() {
        this.setState({ editing: false, playing: true });
    }

    protected edit() {
        this.setState({ editing: true, playing: false });
    }

    protected close() {
        this.setState({ editing: false, playing: false });
    }

    private onPlayerInitialized = () => {
        this.setState({ loading: false });
    };

    protected async save() {
        this.setState({ saving: true });
        try {
            const returnData = await this.h5pEditor.current?.save();
            if (returnData) {
                await this.props.onSaved({
                    contentId: returnData.argsId.contentId,
                    // contentId: returnData.contentId,
                    argsId: returnData.argsId,
                    mainLibrary: returnData.metadata.mainLibrary,
                    title: returnData.metadata.title,
                    originalNewKey: this.props.data.originalNewKey,
                });
            }
        } catch (error) {
            // We ignore the error, as we subscribe to the 'save-error' and
            // 'validation-error' events.
        }
    }

    protected onSaveError = async (event: any) => {
        console.log(`event: `, event);

        this.setState({
            saving: false,
            saved: false,
            saveError: true,
            saveErrorMessage: event?.detail?.message,
        });
        setTimeout(() => {
            this.setState({
                saveError: false,
            });
        }, 5000);
    };

    protected onSaved = async () => {
        this.setState({
            saving: false,
            saved: true,
        });
        setTimeout(() => {
            this.setState({ saved: false });
        }, 3000);
    };

    protected onEditorLoaded = () => {
        this.setState({ loading: false });
    };

    private isNew() {
        return this.props.data.contentId === 'new';
    }
}
