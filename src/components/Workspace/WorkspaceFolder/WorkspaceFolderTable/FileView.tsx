import React from 'react';
import dayJs from 'dayjs';
import { useDrag, DragSourceMonitor, useDrop } from 'react-dnd';
import {
    DocumentIcon,
    DotsVerticalIcon,
    FolderIcon,
    MusicNoteIcon,
    PhotographIcon,
} from '@heroicons/react/solid';
import avatar from 'assets/SVG/workspace_avatar.svg';

// import { MIME_TYPE } from 'constant/google.const';
import { GoogleFiles } from 'types/GoogleType';
// import bookmark from 'assets/SVG/bookmarks.svg';

import googleMiddleware from 'middleware/google.middleware';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { MIME_TYPE } from 'constant/google.const';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
import { useDropzone } from 'react-dropzone';
import WorkspaceLoadingIndicator from '../../WorkspaceHomeContent/WorkspaceLoadingIndicator';

type FileDataProps = {
    data: GoogleFiles;
    //drop
    allowDrop?: boolean;
    allowDrag?: boolean;
    hasCollab?: boolean;
    hasShared?: boolean;
};

const FileView: React.FC<FileDataProps> = ({
    data,
    allowDrop = true,
    allowDrag = true,
    hasCollab = false,
    hasShared = false,
}) => {
    const { dispatch, googleState } = React.useContext(
        GoogleAPIAndServicesContext
    );

    const { shared, permissions } = data;

    //drag setup
    const [{ opacity }, drag] = useDrag(
        () => ({
            type: 'file',
            item: {
                id: data.id,
                name: data.name,
            },
            options: {
                dropEffect: 'copy',
            },
            end(item, monitor) {
                const rs: any = monitor.getDropResult();
                const isDrop = monitor.didDrop();
                if (isDrop) {
                    if (rs.id && item.id && rs.id !== item.id) {
                        googleMiddleware.updateFile(dispatch, {
                            action: 'move',
                            fieldId: item.id,
                            files: {
                                target: item.name,
                                targetId: item.id,
                                destination: rs.name,
                            },
                            args: {
                                addParents: rs.id,
                                fields: '*',
                            },
                        });
                    }
                }
            },
            collect: (monitor: DragSourceMonitor) => ({
                opacity: monitor.isDragging() ? 0.4 : 1,
                name: monitor.getDropResult(),
            }),
            canDrag: allowDrag,
        }),
        [data.id]
    );

    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: 'file',
            drop: () => ({
                id: data.id,
                type: data.mimeType,
                isAppAuthorized: data.isAppAuthorized,
                name: data.name,
            }),
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
            canDrop: () => {
                if (data?.capabilities?.canAddChildren && allowDrop)
                    return true;

                return false;
            },
        }),
        []
    );
    const active = canDrop && isOver;

    const generateType = (type: string) => {
        let tmp = 'file';
        if (type?.includes('image')) {
            tmp = 'image';
        } else if (type?.includes('folder')) {
            tmp = 'folder';
        }
        return tmp;
    };

    const generateIcon = (i: string) => {
        if (data.id === googleState.deletingId) {
            return (
                <div className="h-9 w-9 mr-ooolab_m_4 flex items-center justify-center">
                    <WorkspaceLoadingIndicator />
                </div>
            );
        }
        const type = generateType(i);
        const iconStyle = 'h-9 w-9 text-ooolab_gray_2 mr-ooolab_m_4';
        switch (type) {
            case 'folder':
                return <FolderIcon className={iconStyle} />;
            case 'image':
                return <PhotographIcon className={iconStyle} />;
            default:
                return <DocumentIcon className={iconStyle} />;
        }
    };

    const { dispatch: leftMenuDispatch, leftMenuState } = React.useContext(
        LeftMenuContext
    );
    const onDrop = React.useCallback((acceptedFiles) => {
        if (acceptedFiles) {
            const relativePath = acceptedFiles[0].path;
            const folderName = relativePath.split('/');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    return (
        <div ref={drop} className="w-full">
            <div
                ref={drag}
                className={`hover:bg-ooolab_gray_0 cursor-pointer w-full grid grid-cols-10 gap-2 ${
                    active && 'bg-ooolab_blue_5 border-white text-white'
                }`}
                key={data?.id}
            >
                <div className="py-ooolab_p_4 whitespace-nowrap col-span-4">
                    <span className="flex items-center text-sm font-normal">
                        {generateIcon(data?.mimeType)}
                        {data?.name?.length < 15
                            ? data?.name
                            : `${data?.name?.slice(0, 16)}...`}
                    </span>
                </div>
                <div className="py-ooolab_p_4 whitespace-nowrap col-span-2 place-self-center">
                    <div className="text-sm text-gray-900 ">
                        <span className="flex items-center">
                            <img className="mr-ooolab_m_2" alt="" />
                            {(data.mimeType && MIME_TYPE[data.mimeType]) ||
                                data.mimeType}
                        </span>
                    </div>
                </div>
                <div className="py-ooolab_p_4 whitespace-nowrap col-span-2 place-self-center">
                    <span className="px-2 inline-flex text-sm leading-5 text-ooolab_gray_3 ">
                        {data.modifiedTime &&
                            dayJs(data.modifiedTime).format('DD-MM-YYYY')}
                    </span>
                </div>
                {hasCollab && (
                    <div className="py-ooolab_p_4 whitespace-nowrap col-span-2 place-self-center">
                        <div className="flex -space-x-1 overflow-hidden justify-center py-1">
                            {permissions &&
                                permissions.map((i) => (
                                    <img
                                        key={i.id}
                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                        src={i.photoLink || avatar}
                                        alt=""
                                    />
                                ))}
                        </div>
                    </div>
                )}
                {hasShared && (
                    <div className="py-ooolab_p_4 whitespace-nowrap col-span-2 text-center">
                        <div className="flex -space-x-1 overflow-hidden justify-center py-1">
                            {data.owners &&
                                data.owners.map((i) => (
                                    <img
                                        key={i.id}
                                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                                        src={i.photoLink || avatar}
                                        alt=""
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileView;
