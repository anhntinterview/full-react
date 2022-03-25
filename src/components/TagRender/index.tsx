import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import TagPopover from './TagPopOver';
import { TagType } from 'types/GetListOfWorkspace.type';
import { CreateTagBody, TagsInBodyType } from 'types/ApiData.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceService from 'services/workspace.service';
import { toast } from 'react-toastify';

type TagRenderProps = {
    isEditable?: boolean;
    title: string;
    data?: TagType[];
    listTag?: TagType[];
    onCheck?: (tagId: number) => void;
    onUnCheck?: (tagId: number) => void;
};

const TagRender: React.FC<TagRenderProps> = ({
    isEditable = false,
    title,
    data,
    onCheck,
    onUnCheck,
}) => {
    const { dispatch: WorkspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const { tagList } = getWorkspaceDetailState;

    const params: { lessonId: string; id: string } = useParams();
    const formatList = React.useMemo(() => {
        if (!tagList?.items?.length) return [];
        const tmp = data?.map((i) => i.id) || [];
        const format = tagList.items?.map((j) => ({
            ...j,
            check: tmp.includes(j.id),
        }));
        return format;
    }, [tagList, data]);

    const handleCreateTag = async (body: CreateTagBody): Promise<boolean> => {
        return workspaceService
            .createlessonTags(params.id, body)
            .then((res) => {
                if (res) {
                    setTimeout(
                        () =>
                            workspaceMiddleware.getLessonTags(
                                WorkspaceDispatch,
                                params.id
                            ),
                        1000
                    );
                }
                return true;
            })
            .catch(() => {
                toast.error('Duplicate tag!', {
                    position: 'bottom-left',
                });
                return false;
            });
    };

    const handleSearchTag = (e: string) => {
        workspaceMiddleware.getLessonTags(WorkspaceDispatch, params.id, e);
    };

    useEffect(() => {
        workspaceMiddleware.getLessonTags(WorkspaceDispatch, params.id);
    }, []);

    return (
        <div className="w-full min-h-ooolab_h_18 max-h-ooolab_h_30 border-ooolab_bar_color border rounded-lg flex flex-wrap pb-ooolab_p_2">
            <div className="text-ooolab_sm text-ooolab_dark_1 font-normal border-b border-r border-ooolab_bar_color h-ooolab_h_8 px-ooolab_p_3 rounded-lg inline-flex items-center py-auto mr-ooolab_m_2">
                {title}
            </div>
            {(data?.length &&
                data.map((i) => {
                    let color;
                    try {
                        const test = JSON.parse(i.color);
                        color = {
                            backgroundColor: test.backgroundColor,
                            color: test.textColor,
                        };
                    } catch (error) {
                        color = {
                            backgroundColor: 'blue',
                            color: 'white',
                        };
                    }

                    return (
                        <div
                            key={i.id}
                            className="h-ooolab_h_8 inline-flex items-end px-ooolab_p_1_half"
                        >
                            <p
                                style={{ ...color }}
                                className="px-ooolab_p_2 py-ooolab_p_1 text-center bg-ooolab_blue_4 text-white text-ooolab_xs rounded-lg "
                            >
                                {i.name.length < 16
                                    ? i.name
                                    : `${i.name?.slice(0, 17)}...`}
                            </p>
                        </div>
                    );
                })) ||
                null}

            {(isEditable && (
                <div className="h-ooolab_h_8 flex items-end">
                    <TagPopover
                        title="Tag As"
                        listTag={formatList}
                        onCheck={onCheck}
                        onUnCheck={onUnCheck}
                        lessonId={params.lessonId}
                        onCreate={handleCreateTag}
                        onSearch={handleSearchTag}
                    />
                </div>
            )) ||
                null}
        </div>
    );
};

export default TagRender;
