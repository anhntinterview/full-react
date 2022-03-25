// @ts-nocheck
import React, { useRef } from 'react';
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
import { useEffect } from 'react';

defineElements('h5p-editor');

declare global {
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

interface H5PEditorUIHookProp {
    ref?: any;
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
}
const H5PEditorUIHook: React.FC<H5PEditorUIHookProp> = ({
    argsId,
    loadContentCallback,
    saveContentCallback,
    onLoaded,
    onSaveError,
    onSaved,
}) => {
    const h5pEditor: React.RefObject<H5PEditorWebComponent> = useRef(null);
    useEffect(() => {
        registerEvents();
        setServiceCallbacks();
        h5pEditor.current?.resize();
        return () => {
            unregisterEvents();
        };
    }, []);
    // function getSnapshotBeforeUpdate() {
    //     unregisterEvents();
    //     return null;
    // }

    // function save() {
    //     try {
    //         return await h5pEditor.current?.save();
    //     } catch (error) {
    //         // We ignore the error, as we subscribe to the 'save-error' and
    //         // 'validation-error' events.
    //     }
    // }

    const loadContentCallbackWrapper = (
        argsId: IH5PPlayerArgs
        // contentId: string;
    ): Promise<
        IEditorModel & {
            library?: string;
            metadata?: IContentMetadata;
            params?: any;
        }
    > => {
        return loadContentCallback(argsId);
    };

    const onEditorLoaded = (
        event: CustomEvent<{
            argsId: IH5PPlayerArgs;
            // contentId: string;
            ubername: string;
        }>
    ) => {
        if (onLoaded) {
            onLoaded(event.detail.argsId, event.detail.ubername);
            // this.props.onLoaded(event.detail.contentId, event.detail.ubername);
        }
    };

    const onEditorSaved = (
        event: CustomEvent<{
            argsId: IH5PPlayerArgs;
            metadata: IContentMetadata;
        }>
        // event: CustomEvent<{ contentId: string; metadata: IContentMetadata }>
    ) => {
        if (onSaved) {
            onSaved(event.detail.argsId, event.detail.metadata);
            // this.props.onSaved(event.detail.contentId, event.detail.metadata);
        }
    };

    const onEditorSaveError = async (
        event: CustomEvent<{ message: string }>
    ) => {
        if (onSaveError) {
            onSaveError(event.detail.message);
        }
    };

    function registerEvents() {
        h5pEditor.current?.addEventListener('saved', onEditorSaved);
        h5pEditor.current?.addEventListener('editorloaded', onEditorLoaded);
        h5pEditor.current?.addEventListener('save-error', onEditorSaveError);
        h5pEditor.current?.addEventListener(
            'validation-error',
            onEditorSaveError
        );
    }

    const saveContentCallbackWrapper = (
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
        return saveContentCallback(argsId, requestBody);
        // return this.props.saveContentCallback(contentId, requestBody);
    };

    function setServiceCallbacks() {
        if (h5pEditor.current) {
            h5pEditor.current.loadContentCallback = loadContentCallbackWrapper;
            h5pEditor.current.saveContentCallback = saveContentCallbackWrapper;
        }
    }

    function unregisterEvents() {
        h5pEditor.current?.removeEventListener('saved', onEditorSaved);
        h5pEditor.current?.removeEventListener('editorloaded', onEditorLoaded);
        h5pEditor.current?.removeEventListener('save-error', onEditorSaveError);
        h5pEditor.current?.removeEventListener(
            'validation-error',
            onEditorSaveError
        );
    }

    return (
        <h5p-editor
            ref={h5pEditor}
            args-id={argsId && JSON.stringify(argsId)}
            // content-id={this.props.contentId}
        ></h5p-editor>
    );
};

export default H5PEditorUIHook;
