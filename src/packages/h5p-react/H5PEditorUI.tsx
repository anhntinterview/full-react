// @ts-nocheck
import React from 'react';
import {
    defineElements,
    H5PEditorComponent as H5PEditorWebComponent,
} from '../h5p-webcomponents';
// import {
//     defineElements,
//     H5PEditorComponent as H5PEditorWebComponent
// } from '@lumieducation/h5p-webcomponents';
import type { IContentMetadata, IEditorModel } from '../h5p-server';
// TYPES
import { IH5PPlayerArgs } from 'types/H5P.type';

defineElements('h5p-editor');

declare global {
    /**
     * Enables type checks for JSX.
     */
    namespace JSX {
        interface IntrinsicElements {
            'h5p-editor': {
                'args-id'?: IH5PPlayerArgs;
                // 'content-id'?: string;
                'h5p-url'?: string;
                ref?: any;
            };
        }
    }
}

export default class H5PEditorUI extends React.Component<{
    argsId: IH5PPlayerArgs;
    // contentId: string;
    loadContentCallback: (
        argsId: IH5PPlayerArgs
        // contentId: string
    ) => Promise<
        IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        }
    >;
    onLoaded?: (contentId: string, ubername: string) => void;
    onSaved?: (contentId: string, metadata: IContentMetadata) => void;
    onSaveError?: (errorMessage: string) => void;
    saveContentCallback: (
        argsId: IH5PPlayerArgs,
        // contentId: string,
        requestBody: {
            library: string;
            params: any;
        }
    ) => Promise<{
        argsId: IH5PPlayerArgs;
        // contentId: string;
        metadata: IContentMetadata;
    }>;
}> {
    constructor(props: {
        argsId: IH5PPlayerArgs;
        // contentId: string;
        loadContentCallback: (
            argsId: IH5PPlayerArgs
            // contentId: string;
        ) => Promise<
            IEditorModel & {
                library?: string;
                metadata?: IContentMetadata;
                params?: any;
            }
        >;
        onLoaded?: (
            argsId: IH5PPlayerArgs,
            // contentId: string;
            ubername: string
        ) => void;
        onSaved?: (
            argsId: IH5PPlayerArgs,
            // contentId: string;
            metadata: IContentMetadata
        ) => void;
        onSaveError?: (errorMessage: string) => void;
        saveContentCallback: (
            argsId: IH5PPlayerArgs,
            // contentId: string;
            requestBody: {
                library: string;
                params: any;
            }
        ) => Promise<{
            argsId: IH5PPlayerArgs;
            // contentId: string;s
            metadata: IContentMetadata;
        }>;
    }) {
        super(props);
        this.h5pEditor = React.createRef();
    }

    public h5pEditor: React.RefObject<H5PEditorWebComponent>;

    public componentDidMount(): void {
        this.registerEvents();
        this.setServiceCallbacks();
    }

    public componentDidUpdate(): void {
        this.registerEvents();
        this.setServiceCallbacks();
        this.h5pEditor.current?.resize();
    }

    public componentWillUnmount(): void {
        this.unregisterEvents();
    }

    public getSnapshotBeforeUpdate(): any {
        // Should the old editor instance be destroyed, we unregister from it...
        this.unregisterEvents();
        return null;
    }

    public render(): React.ReactNode {
        return (
            <h5p-editor
                ref={this.h5pEditor}
                args-id={JSON.stringify(this.props.argsId)}
                // content-id={this.props.contentId}
            ></h5p-editor>
        );
    }

    /**
     * Call this method to save the current state of the h5p editor. This will
     * result in a call to the `saveContentCallback` that was passed in the
     * through the props.
     * @throws an error if there was a problem (e.g. validation error of the
     * content)
     */
    public async save(): Promise<
        | {
              //   argsId: IH5PPlayerArgs;
              contentId: string;
              metadata: IContentMetadata;
              uid: string;
          }
        | undefined
    > {
        try {
            return await this.h5pEditor.current?.save();
        } catch (error) {
            // We ignore the error, as we subscribe to the 'save-error' and
            // 'validation-error' events.
        }
    }

    private loadContentCallbackWrapper = (
        argsId: IH5PPlayerArgs
        // contentId: string;
    ): Promise<
        IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        }
    > => {
        return this.props.loadContentCallback(argsId);
    };

    private onEditorLoaded = (
        event: CustomEvent<{
            argsId: IH5PPlayerArgs;
            // contentId: string;
            ubername: string;
        }>
    ) => {
        if (this.props.onLoaded) {
            this.props.onLoaded(event.detail.argsId, event.detail.ubername);
            // this.props.onLoaded(event.detail.contentId, event.detail.ubername);
        }
    };

    private onSaved = (
        event: CustomEvent<{
            argsId: IH5PPlayerArgs;
            metadata: IContentMetadata;
        }>
        // event: CustomEvent<{ contentId: string; metadata: IContentMetadata }>
    ) => {
        if (this.props.onSaved) {
            this.props.onSaved(event.detail.argsId, event.detail.metadata);
            // this.props.onSaved(event.detail.contentId, event.detail.metadata);
        }
    };

    private onSaveError = async (event: CustomEvent<{ message: string }>) => {
        if (this.props.onSaveError) {
            this.props.onSaveError(event.detail.message);
        }
    };

    private registerEvents(): void {
        this.h5pEditor.current?.addEventListener('saved', this.onSaved);
        this.h5pEditor.current?.addEventListener(
            'editorloaded',
            this.onEditorLoaded
        );
        this.h5pEditor.current?.addEventListener(
            'save-error',
            this.onSaveError
        );
        this.h5pEditor.current?.addEventListener(
            'validation-error',
            this.onSaveError
        );
    }

    private saveContentCallbackWrapper = (
        argsId: IH5PPlayerArgs,
        // contentId: string;
        requestBody: {
            library: string;
            params: any;
        }
    ): Promise<{
        argsId: IH5PPlayerArgs;
        // contentId: string;
        metadata: IContentMetadata;
    }> => {
        return this.props.saveContentCallback(argsId, requestBody);
        // return this.props.saveContentCallback(contentId, requestBody);
    };

    private setServiceCallbacks(): void {
        if (this.h5pEditor.current) {
            this.h5pEditor.current.loadContentCallback = this.loadContentCallbackWrapper;
            this.h5pEditor.current.saveContentCallback = this.saveContentCallbackWrapper;
        }
    }

    private unregisterEvents(): void {
        this.h5pEditor.current?.removeEventListener('saved', this.onSaved);
        this.h5pEditor.current?.removeEventListener(
            'editorloaded',
            this.onEditorLoaded
        );
        this.h5pEditor.current?.removeEventListener(
            'save-error',
            this.onSaveError
        );
        this.h5pEditor.current?.removeEventListener(
            'validation-error',
            this.onSaveError
        );
    }
}
