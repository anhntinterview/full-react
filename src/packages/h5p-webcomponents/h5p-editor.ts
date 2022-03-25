// @ts-nocheck
import type { IEditorModel, IContentMetadata } from '../h5p-server';

import { mergeH5PIntegration } from './h5p-utils';
import { addScripts } from './dom-utils';
import { IH5PPlayerArgs } from 'types/H5P.type';
import { getLocalCookie } from 'utils/handleAuthorized';

declare global {
    interface Window {
        /**
         * The global H5P "class" of the H5P client core.
         */
        H5P: any;
        /**
         * Used by the H5P core to communicate settings between the server and
         * the H5P core client.
         */
        H5PIntegration: any;
        /**
         * We keep track of whether h5p is initialized globally to avoid
         * resetting settings when we load another editor component. As the H5P
         * core works with globals and this state must be shared with the player
         * component as well, we have to use a global here, too.
         */
        h5pIsInitialized: boolean;
    }
    /**
     * The H5P core "class" for the editor.
     */
    // eslint-disable-next-line vars-on-top, no-var
    var H5PEditor;
    /**
     * Used by the H5P core for namespacing.
     */
    // eslint-disable-next-line vars-on-top, no-var
    var ns;
}

export class H5PEditorComponent extends HTMLElement {
    constructor() {
        super();

        H5PEditorComponent.initTemplate();
    }
    public get argsId(): string {
        return JSON.parse(this.getAttribute('args-id')) ?? undefined;
    }

    public set argsId(argsId: string) {
        if (!argsId) {
            this.removeAttribute('args-id');
        } else {
            this.setAttribute('args-id', argsId);
        }
    }
    // public get contentId(): string {
    //     return this.getAttribute('content-id') ?? undefined;
    // }

    // public set contentId(contentId: string) {
    //     if (!contentId) {
    //         this.removeAttribute('content-id');
    //     } else {
    //         this.setAttribute('content-id', contentId);
    //     }
    // }

    /**
     * Called when the component needs to load data about content. The endpoint
     * called in here combines the results of H5PEditor.render(...) and
     * H5PEditor.getContent(...) to avoid too many requests.
     *
     * Note that the library, metadata and params property of the returned
     * object must only be defined if contentId is defined.
     *
     * Should throw an error with a message in the message property if something
     * goes wrong.
     */
    public get loadContentCallback(): (
        argsId: IH5PPlayerArgs
        // contentId: string
    ) => Promise<
        IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        }
    > {
        return this.privateLoadContentCallback;
    }

    public set loadContentCallback(
        callback: (
            argsId: IH5PPlayerArgs
            // contentId: string
        ) => Promise<
            IEditorModel & {
                library?: string;
                metadata?: IContentMetadata;
                params?: any;
            }
        >
    ) {
        // We only (re-)render the component if the callback was really changed.
        const mustRender = this.privateLoadContentCallback !== callback;
        this.privateLoadContentCallback = callback;
        if (mustRender) {
            this.render(this.argsId);
            // this.render(this.contentId);
        }
    }

    /**
     * Indicates changes to which attributes should trigger calls to
     * attributeChangedCallback.
     */
    public static get observedAttributes(): string[] {
        return ['args-id', 'h5p-url'];
        // return ['content-id', 'h5p-url'];
    }

    private static template: HTMLTemplateElement;

    /**
     * Called when the component needs to save data about content. The endpoint
     * called here should call H5PEditor.saveOrUpdateContentReturnMetaData(...).
     * Note that it makes sense to use PATCH requests for updates and POST
     * requests for new content, but it's up to you how you implement this. See
     * defaultSaveContentCallback for an example.
     *
     * Should throw an error with a message in the message property if something
     * goes wrong.
     * @param contentId the contentId which needs to be saved; can be undefined
     * for new content, which hasn't been saved before
     * @param requestBody the data needed by the server; usually encoded as JSON
     * string and sent to the server
     * @returns the newly assigned content id and metadata
     */
    public saveContentCallback: (
        argsId: IH5PPlayerArgs,
        // contentId: string,
        requestBody: { library: string; params: any }
    ) => Promise<{ contentId: string; metadata: IContentMetadata }>;

    private editorInstance: any;
    /**
     * Stores the H5P instance (H5P native object of the core).
     */

    private privateLoadContentCallback: (
        argsId: IH5PPlayerArgs
        // contentId: string,
    ) => Promise<
        IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        }
    >;

    private resizeObserver: ResizeObserver;

    private root: HTMLElement;

    private static initTemplate(): void {
        // We create the static template only once
        if (!H5PEditorComponent.template) {
            H5PEditorComponent.template = document.createElement('template');
            H5PEditorComponent.template.innerHTML = `
            <style>
            .h5peditor-semi-fullscreen {
                margin: 0;
                padding: 0;
                position: fixed;
                overflow-y: scroll;
                box-sizing: border-box;
                height: 100%;
                width: 100%;
                left: 0;
                top: 0;
            }
            </style>
            <div class="h5p-editor-component-root"></div>`;
        }
    }

    /**
     * Called when one of the attributes in observedAttributes changes.
     */
    public async attributeChangedCallback(
        name: string,
        oldVal: any,
        newVal: any
    ): Promise<void> {
        // We don't render if the component's content id changes from 'new'
        // to something else, as this would lead to flickering when saving
        // newly created content.
        if (name === 'content-id' && oldVal !== newVal && oldVal !== 'new') {
            await this.render(newVal);
        }
    }

    /**
     * Called when the component is added to the DOM.
     */
    public async connectedCallback(): Promise<void> {
        this.appendChild(H5PEditorComponent.template.content.cloneNode(true));
        this.root = this.querySelector('.h5p-editor-component-root');

        this.resizeObserver = new ResizeObserver(() => {
            this.resize();
        });
        this.resizeObserver.observe(this);

        await this.render(this.argsId);
        // await this.render(this.contentId);
        this.updateScript();
    }

    private updateScript() {
        if (document.getElementsByClassName('h5p-editor-iframe').length === 0) {
            setTimeout(() => this.updateScript(), 20);
        } else {
            const cookieToken = getLocalCookie();
            const script = document.createElement('script');
            script.innerHTML = `
                const originalFetch = window.fetch;
                window.fetch = function () {
                    if (arguments[1].headers) {
                        arguments[1].headers = { 'X-CSRF-TOKEN': '${cookieToken}', ...arguments[1].headers };
                    } else {
                        arguments[1].headers = { 'X-CSRF-TOKEN': '${cookieToken}' };
                    }
                    return originalFetch.apply(this, arguments)
                };
            
                const open = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function (method, url, ...rest) {
                    var recall = open.call(this, method, url, ...rest);
                    this.setRequestHeader('X-CSRF-TOKEN', '${cookieToken}');
                    return recall;
                };
            `;
            document
                .getElementsByClassName('h5p-editor-iframe')[0]
                .contentWindow.document.getElementsByTagName('head')[0]
                .appendChild(script);
        }
    }

    /**
     * Called when the component is removed from the DOM.
     */
    public disconnectedCallback(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        // Unregister our event listener from the global H5P dispatcher.
        if (window.H5P.externalDispatcher) {
            window.H5P.externalDispatcher.off(
                'editorloaded',
                this.onEditorLoaded
            );
        }
    }

    /**
     * Call this method when the iframe containing the editor needs to be
     * resized, e.g. because the some
     */
    public resize = (): void => {
        const h5pEditorIframe = this.querySelector(
            '.h5p-editor-iframe'
        ) as HTMLIFrameElement;
        if (h5pEditorIframe) {
            const newHeight =
                h5pEditorIframe.contentWindow?.document?.body?.scrollHeight;
            if (newHeight !== undefined) {
                h5pEditorIframe.style.height = `${h5pEditorIframe.contentWindow.document.body.scrollHeight.toString()}px`;
            }
        }
    };

    /**
     * Call save() to get data from the H5P editor and send it to the server.
     * You can use the saveContentCallback hook to customize server requests.
     * The component emits 'saved', 'save-error' and 'validation-error' events,
     * depending on success of the function. You can subscribe to those or use
     * the promise's return value and catch the errors in a try-catch block.
     * @throws an error if something went wrong
     * @returns the contentId and metadata of the saved content
     */
    public save = async (): Promise<{
        argsId: IH5PPlayerArgs;
        // contentId: string;
        metadata: IContentMetadata;
    }> => {
        if (this.editorInstance === undefined) {
            this.dispatchAndThrowError(
                'save-error',
                'editorInstance of h5p editor not defined.'
            );
        }
        if (!this.saveContentCallback) {
            this.dispatchAndThrowError(
                'save-error',
                'saveContentCallback of H5P Editor Web Component not defined.'
            );
        }

        const params = this.editorInstance.getParams();
        if (!params.params) {
            this.dispatchAndThrowError(
                'validation-error',
                'The parameters entered by the user are invalid.'
            );
        }
        // Validate mandatory main title. Prevent submitting if that's not set.
        // Deliberately doing it after getParams(), so that any other validation
        // problems are also revealed.
        if (!this.editorInstance.isMainTitleSet()) {
            this.dispatchAndThrowError(
                'validation-error',
                "The main title of the content hasn't been set."
            );
        }

        let saveResponseObject: {
            argsId: IH5PPlayerArgs;
            // contentId: string;
            metadata: IContentMetadata;
        };
        const requestBody = {
            library: this.editorInstance.getLibrary(),
            params,
        };
        try {
            saveResponseObject = await this.saveContentCallback(
                this.argsId === 'new' ? undefined : this.argsId,
                // this.contentId === 'new' ? undefined : this.contentId,
                requestBody
            );
        } catch (error) {
            this.dispatchAndThrowError('save-error', error.message);
        }

        if (this.argsId !== saveResponseObject.argsId) {
            this.setAttribute('content-id', saveResponseObject.argsId);
        }
        // if (this.contentId !== saveResponseObject.contentId) {
        //     this.setAttribute('content-id', saveResponseObject.contentId);
        // }

        this.dispatchEvent(
            new CustomEvent('saved', {
                detail: {
                    argsId: saveResponseObject.argsId,
                    // contentId: saveResponseObject.contentId,
                    metadata: saveResponseObject.metadata,
                },
            })
        );
        return saveResponseObject;
    };

    /**
     * Dispatches an event of the specified name and throws an error whose error
     * message starts with the eventName.
     * @param eventName
     * @param message
     */
    private dispatchAndThrowError(eventName: string, message: string): void {
        this.dispatchEvent(
            new CustomEvent(eventName, {
                detail: {
                    message,
                },
            })
        );
        throw new Error(`${eventName}: ${message}`);
    }

    /**
     * Called by the global H5P event dispatcher when any editor was loaded.
     */
    private onEditorLoaded = (event: { data: string }): void => {
        // We must manually check if our editor instance is initialized, as the
        // event is only sent globally.
        if (this.editorInstance.selector.form) {
            this.dispatchEvent(
                new CustomEvent('editorloaded', {
                    detail: { argsId: this.argsId, ubername: event.data },
                    // detail: { contentId: this.contentId, ubername: event.data },
                })
            );
            // After our editor has been initialized, it will never fire the
            // global event again, so we can unsubscribe from it.
            window.H5P.externalDispatcher.off(
                'editorloaded',
                this.onEditorLoaded
            );
        }
    };

    /**
     * Displays the editor inside the component by creating a new DOM tree.
     * @param contentId the content id to display or undefined if a new piece
     * of content was created
     */
    private async render(argsId?: IH5PPlayerArgs): Promise<void> {
        // private async render(contentId?: string): Promise<void> {
        if (!this.loadContentCallback) {
            return;
        }

        if (!argsId) {
            return;
        }
        // if (!contentId) {
        //     return;
        // }

        let editorModel: IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        };
        try {
            editorModel = await this.loadContentCallback(
                argsId === 'new' ? undefined : argsId
                // contentId === 'new' ? undefined : contentId
            );
        } catch (error) {
            this.root.innerHTML = `<p>Error loading H5P content from server: ${error.message}`;
            return;
        }

        // Reset DOM tree inside component.
        this.root.innerHTML = '';

        // We have to prevent H5P from initializing when the h5p.js file is
        // loaded.
        if (!window.H5P) {
            window.H5P = {};
        }
        window.H5P.preventInit = true;

        // We merge the H5P integration we received from the server with the one
        // that already exists in the window globally to allow for several H5P
        // content objects on a single page.
        mergeH5PIntegration(
            editorModel.integration,
            argsId === 'new' ? undefined : argsId
            // contentId === 'new' ? undefined : contentId
        );

        // As the editor adds an iframe anyway and styles don't really matter, we
        // only add the global editor scripts to the whole page, but not the styles
        // (to avoid side effects).
        await addScripts(
            editorModel.scripts,
            document.getElementsByTagName('head')[0]
        );

        // Create the necessary DOM tree.
        const h5pCreateDiv = document.createElement('div');
        h5pCreateDiv.className = 'h5p-create';
        h5pCreateDiv.hidden = true;
        this.root.appendChild(h5pCreateDiv);
        const h5pEditorDiv = document.createElement('div');
        h5pEditorDiv.className = 'h5p-editor';
        h5pCreateDiv.appendChild(h5pEditorDiv);

        // Set up the H5P core editor.
        H5PEditor.getAjaxUrl = (
            action: string,
            parameters: { [x: string]: any }
        ): string => {
            let url = editorModel.integration.editor.ajaxPath + action;

            if (parameters !== undefined) {
                for (const property in parameters) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            parameters,
                            property
                        )
                    ) {
                        url = `${url}&${property}=${parameters[property]}`;
                    }
                }
            }

            url += window.location.search.replace(/\\?/g, '&');
            return url;
        };

        window.H5P.preventInit = false;
        // Only initialize H5P once to avoid resetting values.
        if (!window.h5pIsInitialized) {
            window.H5P.init(this.root);
            window.h5pIsInitialized = true;
        }

        // Register our global editorloaded event handler.
        window.H5P.externalDispatcher.on(
            'editorloaded',
            this.onEditorLoaded,
            this
        );

        // Configure the H5P core editor.
        H5PEditor.$ = window.H5P.jQuery;
        H5PEditor.basePath = editorModel.integration.editor.libraryUrl;
        H5PEditor.fileIcon = editorModel.integration.editor.fileIcon;
        H5PEditor.ajaxPath = editorModel.integration.editor.ajaxPath;
        H5PEditor.filesPath = editorModel.integration.editor.filesPath;
        H5PEditor.apiVersion = editorModel.integration.editor.apiVersion;
        H5PEditor.contentLanguage = editorModel.integration.editor.language;
        H5PEditor.copyrightSemantics =
            editorModel.integration.editor.copyrightSemantics;
        H5PEditor.metadataSemantics =
            editorModel.integration.editor.metadataSemantics;
        H5PEditor.assets = editorModel.integration.editor.assets;
        H5PEditor.baseUrl = '';
        H5PEditor.contentId =
            argsId.contentId === 'new' ? undefined : argsId.contentId;
        // H5PEditor.contentId = contentId === 'new' ? undefined : contentId;
        H5PEditor.enableContentHub =
            editorModel.integration.editor.enableContentHub || false;

        if (argsId.contentId === 'new') {
            // Create an empty editor for new content
            this.editorInstance = new ns.Editor(
                undefined,
                undefined,
                h5pEditorDiv
            );
        } else {
            // Load the editor with populated parameters for existing content
            this.editorInstance = new ns.Editor(
                editorModel.library,
                JSON.stringify({
                    metadata: editorModel.metadata,
                    params: editorModel.params,
                }),
                h5pEditorDiv
            );
        }

        h5pCreateDiv.hidden = false;
    }
}
