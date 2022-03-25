// @ts-nocheck
import React from 'react';
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
export default class H5PPlayerUI extends React.Component<{
    argsId: IH5PPlayerArgs;
    // contentId: string;
    // workspaceId: string;
    loadContentCallback: (args: IH5PPlayerArgs) => Promise<IPlayerModel>;
    // loadContentCallback: (contentId: string) => Promise<IPlayerModel>;
    onInitialized?: (args: IH5PPlayerArgs) => void;
    // onInitialized?: (contentId: string) => void;
    onxAPIStatement?: (statement: any, context: any, event: IxAPIEvent) => void;
}> {
    constructor(props: {
        argsId: IH5PPlayerArgs;
        // contentId: string;
        // workspaceId: string;
        loadContentCallback: (args: IH5PPlayerArgs) => Promise<IPlayerModel>;
        // loadContentCallback: (contentId: string) => Promise<IPlayerModel>;
        onInitialized?: (args: IH5PPlayerArgs) => void;
        // onInitialized?: (contentId: string) => void;
        onxAPIStatement?: (
            statement: any,
            context: any,
            event: IxAPIEvent
        ) => void;
    }) {
        super(props);
        this.h5pPlayer = React.createRef();
    }

    private h5pPlayer: React.RefObject<H5PPlayerComponent>;

    public componentDidMount(): void {
        this.registerEvents();
        this.setServiceCallbacks();
    }

    public componentDidUpdate(): void {
        this.registerEvents();
        this.setServiceCallbacks();
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
            <h5p-player
                ref={this.h5pPlayer}
                args-id={JSON.stringify(this.props.argsId)}
                // content-id={this.props.contentId}
                // workspace-id={this.props.workspaceId}
            ></h5p-player>
        );
    }

    private loadContentCallbackWrapper = (
        argsId: IH5PPlayerArgs
        // contentId: string
    ): Promise<IPlayerModel> => {
        console.log(argsId);
        return this.props.loadContentCallback(argsId);
        // return this.props.loadContentCallback(contentId);
    };

    private onInitialized = (
        event: CustomEvent<{ argsId: IH5PPlayerArgs }>
    ) => {
        if (this.props.onInitialized) {
            this.props.onInitialized(event.detail.args);
        }
    };
    // private onInitialized = (event: CustomEvent<{ contentId: string }>) => {
    //     if (this.props.onInitialized) {
    //         this.props.onInitialized(event.detail.contentId);
    //     }
    // };

    private onxAPIStatement = (
        event: CustomEvent<{
            context: IContext;
            event: IxAPIEvent;
            statement: any;
        }>
    ) => {
        if (this.props.onxAPIStatement) {
            this.props.onxAPIStatement(
                event.detail.statement,
                event.detail.context,
                event.detail.event
            );
        }
    };

    private registerEvents(): void {
        this.h5pPlayer.current?.addEventListener(
            'initialized',
            this.onInitialized
        );

        if (this.props.onxAPIStatement) {
            this.h5pPlayer.current?.addEventListener(
                'xAPI',
                this.onxAPIStatement
            );
        }
    }

    private setServiceCallbacks(): void {
        if (this.h5pPlayer.current) {
            this.h5pPlayer.current.loadContentCallback = this.loadContentCallbackWrapper;
        }
    }

    private unregisterEvents(): void {
        this.h5pPlayer.current?.removeEventListener(
            'initialized',
            this.onInitialized
        );
        if (this.props.onxAPIStatement) {
            this.h5pPlayer.current?.removeEventListener(
                'xAPI',
                this.onxAPIStatement
            );
        }
    }
}
