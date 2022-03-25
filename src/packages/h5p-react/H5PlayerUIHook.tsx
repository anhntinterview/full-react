// @ts-nocheck
import React, { useEffect } from 'react';
// COMPONETS
import {
    defineElements,
    H5PPlayerComponent,
    IxAPIEvent,
    IContext,
} from '../h5p-webcomponents';
import type { IPlayerModel } from '../h5p-server';
// TYPES
import { IH5PPlayerArgs } from 'types/H5P.type';

import { H5PEditorUI, H5PPlayerUI } from 'packages/h5p-react';

defineElements('h5p-player');

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'h5p-player': {
                'args-id'?: IH5PPlayerArgs;
                // 'content-id'?: string;
                // 'workspace-id'?: string;
                ref?: any;
            };
        }
    }
}

interface H5PPlayerUIHookProp {
    ref: React.RefObject<H5PPlayerUI>;
    argsId: IH5PPlayerArgs;
    // contentId: string;
    // workspaceId: string;
    loadContentCallback: (args: IH5PPlayerArgs) => Promise<IPlayerModel>;
    // loadContentCallback: (contentId: string) => Promise<IPlayerModel>;
    onInitialized?: (args: IH5PPlayerArgs) => void;
    // onInitialized?: (contentId: string) => void;
    onxAPIStatement?: (statement: any, context: any, event: IxAPIEvent) => void;
}
const H5PPlayerUIHook: React.FC<H5PPlayerUIHookProp> = ({
    argsId,
    loadContentCallback,
    onInitialized,
    onxAPIStatement,
}) => {
    const h5pPlayer: React.RefObject<H5PPlayerComponent> = React.useRef(null);
    useEffect(() => {
        registerEvents();
        setServiceCallbacks();
        return () => {
            unregisterEvents();
        };
    }, []);

    function getSnapshotBeforeUpdate(): any {
        // Should the old editor instance be destroyed, we unregister from it...
        unregisterEvents();
        return null;
    }

    const loadContentCallbackWrapper = (
        argsId: IH5PPlayerArgs
        // contentId: string
    ): Promise<IPlayerModel> => {
        return loadContentCallback(argsId);
        // return loadContentCallback(contentId);
    };

    const onInitializedPLayer = (
        event: CustomEvent<{ argsId: IH5PPlayerArgs }>
    ) => {
        if (onInitialized) {
            onInitialized(event.detail.argsId);
        }
    };

    const onxAPIStatementPlayer = (
        event: CustomEvent<{
            context: IContext;
            event: IxAPIEvent;
            statement: any;
        }>
    ) => {
        if (onxAPIStatement) {
            onxAPIStatement(
                event.detail.statement,
                event.detail.context,
                event.detail.event
            );
        }
    };

    function registerEvents() {
        h5pPlayer.current?.addEventListener('initialized', onInitializedPLayer);

        if (onxAPIStatement) {
            h5pPlayer.current?.addEventListener('xAPI', onxAPIStatementPlayer);
        }
    }

    function setServiceCallbacks() {
        if (h5pPlayer.current) {
            h5pPlayer.current.loadContentCallback = loadContentCallbackWrapper;
        }
    }

    function unregisterEvents() {
        h5pPlayer.current?.removeEventListener(
            'initialized',
            onInitializedPLayer
        );
        if (onxAPIStatement) {
            h5pPlayer.current?.removeEventListener(
                'xAPI',
                onxAPIStatementPlayer
            );
        }
    }

    return (
        <h5p-player
            ref={h5pPlayer}
            args-id={JSON.stringify(argsId)}
            // content-id={this.props.contentId}
            // workspace-id={this.props.workspaceId}
        ></h5p-player>
    );
};

export default H5PPlayerUIHook;
