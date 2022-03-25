import React from 'react';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';

// The .js references are necessary for requireJs to work in the browser.
import {
    IContentService,
    IContentListEntry,
    IH5PContentList,
} from 'types/H5P.type';

import { initH5PContentList } from 'state/H5P/H5P.state';

import ContentListEntryComponent from './ContentListEntryComponent';
import { PlusSmIcon } from '@heroicons/react/outline';
import H5PTitleView from './H5PTitleView';
import H5PTableView from './H5PTableView';

class ContentList extends React.Component<{
    contentService: IContentService;
    workspaceId: string;
}> {
    constructor(props: {
        contentService: IContentService;
        workspaceId: string;
    }) {
        super(props);

        this.state = { contentList: initH5PContentList };
        this.contentService = props.contentService;
    }

    public state: {
        contentList: IH5PContentList;
    };

    protected contentService: IContentService;
    /**
     * Keeps track of newly created content to assign a key
     * @memberof ContentList
     */
    protected newCounter = 0;

    public async componentDidMount(): Promise<void> {
        await this.updateList();
    }

    public render(): React.ReactNode {
        return (
            <div>
                <div className="group">
                    <button
                        className="focus:outline-none bg-ooolab_bg_bar items-center flex p-ooolab_p_1 px-3 rounded-header_menu mb-ooolab_m_6 group-hover:bg-ooolab_bg_sub_tab_active"
                        onClick={() => this.new()}
                    >
                        <PlusSmIcon className="w-ooolab_w_icon_plus h-ooolab_h_6 color text-ooolab_blue_1 pr-ooolab_p_2 group-hover:text-white" />
                        <p className="text-ooolab_blue_1 text-ooolab_1xs group-hover:text-white">
                            New H5P
                        </p>
                    </button>
                </div>
                {this.state.contentList.items.map((content) => (
                    <ContentListEntryComponent
                        workspaceId={this.props.workspaceId}
                        contentService={this.contentService}
                        data={content}
                        key={content.originalNewKey ?? content.contentId}
                        onDiscard={() => this.onDiscard(content)}
                        onDelete={() => this.onDelete(content)}
                        onSaved={(newData) => this.onSaved(content, newData)}
                        generateDownloadLink={
                            this.contentService.generateDownloadLink
                        }
                    ></ContentListEntryComponent>
                ))}
                <div className="">
                    <H5PTableView contentList={this.state.contentList} />
                </div>
            </div>
        );
    }

    protected async updateList(): Promise<void> {
        const contentList = await this.contentService.list();
        this.setState({ contentList });
    }

    protected new() {
        this.setState({
            contentList: {
                items: [
                    {
                        contentId: 'new',
                        mainLibrary: undefined,
                        title: 'New H5P',
                        originalNewKey: `new-${this.newCounter++}`,
                    },
                    ...this.state.contentList.items,
                ],
                order: this.state.contentList.order,
                page: this.state.contentList.page,
                per_page: this.state.contentList.per_page,
                sort_by: this.state.contentList.sort_by,
                total: this.state.contentList.total,
            },
        });
    }

    protected onDiscard(content: IContentListEntry) {
        this.setState({
            contentList: {
                items: this.state.contentList.items.filter(
                    (c) => c !== content
                ),
                order: this.state.contentList.order,
                page: this.state.contentList.page,
                per_page: this.state.contentList.per_page,
                sort_by: this.state.contentList.sort_by,
                total: this.state.contentList.total,
            },
        });
    }

    protected async onDelete(content: IContentListEntry) {
        if (!content.contentId) {
            return;
        }
        try {
            await this.contentService.delete(content.contentId);
            this.setState({
                contentList: {
                    items: this.state.contentList.items.filter(
                        (c) => c !== content
                    ),
                    order: this.state.contentList.order,
                    page: this.state.contentList.page,
                    per_page: this.state.contentList.per_page,
                    sort_by: this.state.contentList.sort_by,
                    total: this.state.contentList.total,
                },
            });
        } catch (error) {
            console.error(error.message);
        }
    }

    protected async onSaved(
        oldData: IContentListEntry,
        newData: IContentListEntry
    ) {
        await this.setState({
            contentList: {
                items: this.state.contentList.items.map((c) =>
                    c === oldData ? newData : c
                ),
                order: this.state.contentList.order,
                page: this.state.contentList.page,
                per_page: this.state.contentList.per_page,
                sort_by: this.state.contentList.sort_by,
                total: this.state.contentList.total,
            },
        });
    }
}

export default ContentList;
