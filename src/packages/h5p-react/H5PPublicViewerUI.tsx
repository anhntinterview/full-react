// @ts-nocheck
import React from 'react';
// COMPONETS
import {
    defineElements,
    H5PPublicViewerComponent,
    IPublicViewexAPIEvent,
    IPublicViewerContext,
} from '../h5p-webcomponents';
import type { IPlayerModel } from '../h5p-server';

defineElements('h5p-public-viewer');

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'h5p-public-viewer': {
                'content-id'?: string;
                ref?: any;
            };
        }
    }
}

export default class H5PPublicViewerUI extends React.Component<{
    contentId: string;
    loadContentCallback: (contentId: string) => Promise<IPlayerModel>;
    onInitialized?: (contentId: string) => void;
    onxAPIStatement?: (
        statement: any,
        context: any,
        event: IPublicViewexAPIEvent
    ) => void;
}> {
    constructor(props: {
        contentId: string;
        loadContentCallback: (contentId: string) => Promise<IPlayerModel>;
        onInitialized?: (contentId: string) => void;
        onxAPIStatement?: (
            statement: any,
            context: any,
            event: IPublicViewexAPIEvent
        ) => void;
    }) {
        super(props);
        this.h5pPublicViewer = React.createRef();
    }

    private h5pPublicViewer: React.RefObject<H5PPublicViewerComponent>;

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
            <h5p-public-viewer
                ref={this.h5pPublicViewer}
                content-id={this.props.contentId}
            ></h5p-public-viewer>
        );
    }

    private loadContentCallbackWrapper = (
        contentId: string
    ): Promise<IPlayerModel> => {
        console.log(contentId);
        return this.props.loadContentCallback(contentId);
    };

    private onInitialized = (event: CustomEvent<{ contentId: string }>) => {
        if (this.props.onInitialized) {
            this.props.onInitialized(event.detail.contentId);
        }
    };

    private onxAPIStatement = (
        event: CustomEvent<{
            context: IPublicViewerContext;
            event: IPublicViewexAPIEvent;
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
        this.h5pPublicViewer.current?.addEventListener(
            'initialized',
            this.onInitialized
        );

        if (this.props.onxAPIStatement) {
            this.h5pPublicViewer.current?.addEventListener(
                'xAPI',
                this.onxAPIStatement
            );
        }
    }

    private setServiceCallbacks(): void {
        console.log(`this.h5pPublicViewer: `, this.h5pPublicViewer.current);
        if (this.h5pPublicViewer.current) {
            this.h5pPublicViewer.current.loadContentCallback = this.loadContentCallbackWrapper;
        }
    }

    private unregisterEvents(): void {
        this.h5pPublicViewer.current?.removeEventListener(
            'initialized',
            this.onInitialized
        );
        if (this.props.onxAPIStatement) {
            this.h5pPublicViewer.current?.removeEventListener(
                'xAPI',
                this.onxAPIStatement
            );
        }
    }
}
